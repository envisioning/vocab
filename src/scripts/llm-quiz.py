import logging
import sys
from pathlib import Path
import frontmatter
import requests
from config import API_KEY
import json

# Configure logging ...
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)

# Constants
VOCAB_DIR = Path('../content/articles/')
DATA_FILE = Path('../data/quizzes.json')
SCORE_FIELD = 'quiz'
API_ENDPOINT = "https://api.openai.com/v1/chat/completions"

def get_md_files(directory: Path):
    """Retrieve all .md files in the specified directory."""
    md_files = list(directory.glob('*.md'))
    logging.info(f"Found {len(md_files)} Markdown files in {directory.resolve()}.")
    return md_files

def has_score(front_matter: dict) -> bool:
    """Check if quiz field exists in frontmatter."""
    return SCORE_FIELD in front_matter

def generate_quiz(title: str, summary: str) -> dict:
    """Generate two quiz questions with multiple choice answers using OpenAI API."""
    prompt = (
        "Create TWO multiple choice quiz questions based on this AI/ML concept. "
        "\n\nQUESTION 1: Create a conceptual question that tests understanding of the core concept. "
        "Do not propose a quiz where the correct answer is just the repetition of the concept name. "
        "\n\nQUESTION 2: Create a practical question about real-world applications or examples of this concept. "
        "The correct answer should be a valid use/example, while the other 4 should be plausible but incorrect. "
        "\n\nAlways call it AI or ML, not by its full name. "
        "Be imaginative, educational and brief. "
        "Format your response EXACTLY as a JSON object with this structure:\n"
        "{\n"
        '"conceptual": {\n'
        '    "question": "Your conceptual question here",\n'
        '    "answers": [\n'
        '        "Correct answer",\n'
        '        "Plausible wrong answer 1",\n'
        '        "Plausible wrong answer 2",\n'
        '        "Plausible wrong answer 3",\n'
        '        "Plausible wrong answer 4"\n'
        '    ]\n'
        '},\n'
        '"practical": {\n'
        '    "question": "Which of the following is a real-world application/example of [concept]?",\n'
        '    "answers": [\n'
        '        "Correct use case/example",\n'
        '        "Plausible but incorrect example 1",\n'
        '        "Plausible but incorrect example 2",\n'
        '        "Plausible but incorrect example 3",\n'
        '        "Plausible but incorrect example 4"\n'
        '    ]\n'
        '}\n'
        "}\n\n"
        f"Title: {title}\n"
        f"Summary: {summary}\n"
    )
    
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    
    data = {
        "model": "gpt-4-turbo-preview",
        "messages": [
            {
                "role": "system", 
                "content": "You are a quiz generator. Always respond with valid JSON containing exactly two question objects: 'conceptual' and 'practical'. Each must have a 'question' field and 'answers' array with exactly 5 items. The first answer must be correct. Use double quotes for JSON strings."
            },
            {"role": "user", "content": prompt}
        ],
        "response_format": {"type": "json_object"},
        "max_tokens": 800,
        "temperature": 0.7
    }
    
    try:
        logging.info("Sending request to OpenAI API for quiz generation")
        response = requests.post(API_ENDPOINT, headers=headers, json=data)
        response.raise_for_status()
        
        response_data = response.json()
        if 'choices' not in response_data or not response_data['choices']:
            raise ValueError("Invalid API response structure")
            
        quiz_str = response_data['choices'][0]['message']['content'].strip()
        logging.debug(f"Raw API response: {quiz_str}")  # Added for debugging
        
        quiz = json.loads(quiz_str)
        
        # Validate response structure
        if not isinstance(quiz, dict):
            raise ValueError("Response is not a dictionary")
        for key in ['conceptual', 'practical']:
            if key not in quiz:
                raise ValueError(f"Missing '{key}' field")
            if 'question' not in quiz[key]:
                raise ValueError(f"Missing 'question' field in {key}")
            if 'answers' not in quiz[key] or not isinstance(quiz[key]['answers'], list):
                raise ValueError(f"Missing or invalid 'answers' field in {key}")
            if len(quiz[key]['answers']) != 5:
                raise ValueError(f"Must have exactly 5 answers in {key}")

        logging.info(f"Successfully generated quiz questions for: {title}")
        return quiz
        
    except json.JSONDecodeError as e:
        logging.error(f"JSON parsing error: {e}")
        return {
            "conceptual": {
                "question": "Error: Invalid JSON response",
                "answers": ["Error", "Error", "Error", "Error", "Error"]
            },
            "practical": {
                "question": "Error: Invalid JSON response",
                "answers": ["Error", "Error", "Error", "Error", "Error"]
            }
        }
    except Exception as e:
        logging.error(f"Error during quiz generation: {e}")
        return {
            "conceptual": {
                "question": f"Error: {str(e)}",
                "answers": ["Error", "Error", "Error", "Error", "Error"]
            },
            "practical": {
                "question": f"Error: {str(e)}",
                "answers": ["Error", "Error", "Error", "Error", "Error"]
            }
        }

def update_frontmatter_with_quiz(md_file: Path, post, quiz: dict):
    """Add quiz to frontmatter and save file."""
    post.metadata[SCORE_FIELD] = quiz
    
    try:
        content_with_frontmatter = frontmatter.dumps(post, sort_keys=False, width=999)
        with md_file.open('w', encoding='utf-8') as f:
            f.write(content_with_frontmatter)
        logging.info(f"Updated '{md_file.name}' with quiz")
    except Exception as e:
        logging.error(f"Failed to write file '{md_file.name}': {e}")

def load_existing_scores():
    """Load existing scores from quizzes.json."""
    try:
        if DATA_FILE.exists():
            with DATA_FILE.open('r', encoding='utf-8') as f:
                return json.load(f)
        return {}
    except Exception as e:
        logging.error(f"Error loading quizzes.json: {e}")
        return {}

def save_scores(scores_dict):
    """Save scores to quizzes.json."""
    try:
        with DATA_FILE.open('w', encoding='utf-8') as f:
            json.dump(scores_dict, f, indent=2)
        logging.info("Saved scores to quizzes.json")
    except Exception as e:
        logging.error(f"Error saving quizzes.json: {e}")

def process_files(md_files):
    """Process each Markdown file."""
    existing_quizzes = load_existing_scores()
    
    for md_file in md_files:
        slug = md_file.stem
        logging.info(f"Processing file: {md_file.name}")
        
        if slug in existing_quizzes:
            logging.info(f"Skipping '{slug}' - already has quiz")
            continue

        try:
            post = frontmatter.load(md_file)
        except Exception as e:
            logging.error(f"Failed to load frontmatter from '{md_file.name}': {e}")
            continue

        title = post.metadata.get('title', '').strip()
        summary = post.metadata.get('summary', '').strip()
        
        if not title and not summary:
            logging.warning(f"Both title and summary are missing in '{md_file.name}'. Skipping quiz generation.")
            continue

        logging.info(f"Generating quiz for '{slug}'...")
        quiz = generate_quiz(title, summary)
        
        existing_quizzes[slug] = quiz
        save_scores(existing_quizzes)

def main():
    """Main function to execute the script."""
    if not VOCAB_DIR.exists() or not VOCAB_DIR.is_dir():
        logging.error(f"Directory '{VOCAB_DIR.resolve()}' does not exist or is not a directory.")
        sys.exit(1)

    md_files = get_md_files(VOCAB_DIR)
    if not md_files:
        logging.info("No Markdown files to process.")
        return

    process_files(md_files)
    logging.info("Processing completed.")

if __name__ == "__main__":
    main()
