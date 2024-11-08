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
DATA_FILE = Path('../data/impact.json')
SCORE_FIELD = 'impact'
API_ENDPOINT = "https://api.openai.com/v1/chat/completions"

def get_md_files(directory: Path):
    """Retrieve all .md files in the specified directory."""
    md_files = list(directory.glob('*.md'))
    logging.info(f"Found {len(md_files)} Markdown files in {directory.resolve()}.")
    return md_files

def has_score(front_matter: dict) -> bool:
    """Check if importance score field exists in frontmatter."""
    return SCORE_FIELD in front_matter

def calculate_importance_score(title: str, summary: str) -> list[float]:
    """Calculate impact scores using OpenAI API returning all 7 scores."""
    prompt = (
        "You are an AI expert. Please analyze the following AI/ML term and assign it 7 different societal impact scores "
        "from 0 to 1, where:\n"
        "- Scores near 1.0 are for concepts with massive potential societal impact (e.g., 'AGI', 'Large Language Models')\n"
        "- Scores near 0.0 are for concepts with minimal direct societal impact (e.g., 'Specific Optimization Techniques')\n"
        "Consider factors like: economic impact, social changes, ethical implications, and potential risks/benefits to society.\n"
        "Return exactly 7 scores in a JSON array format with 3 decimal places each, like this: [0.950, 0.925, 0.900, 0.875, 0.850, 0.825, 0.800]\n\n"
        f"Title: {title}\n"
        f"Summary: {summary}\n"
        "Scores:"
    )
    
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    
    data = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "You are an AI expert that scores terms based on their potential societal impact. Always return exactly 7 scores in a JSON array."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 50,
        "temperature": 0.7  # Slightly increased temperature for more variation in scores
    }
    
    try:
        logging.info("Sending request to OpenAI API for scoring")
        response = requests.post(API_ENDPOINT, headers=headers, json=data)
        response.raise_for_status()
        
        # Parse the response string as a JSON array
        import json
        scores_str = response.json()['choices'][0]['message']['content'].strip()
        scores = json.loads(scores_str)
        
        if not isinstance(scores, list) or len(scores) != 7:
            raise ValueError("API did not return 7 scores")
            
        # Return all scores rounded to 3 decimal places
        scores = [round(max(0.0, min(1.0, score)), 3) for score in scores]
        
        logging.info(f"Scores: {scores}")
        return scores
    except KeyboardInterrupt:
        logging.info("\nScript interrupted by user. Shutting down gracefully...")
        sys.exit(0)
    except Exception as e:
        logging.error(f"Error during scoring: {e}")
        return [0.5] * 7  # Default middle score array in case of error

def update_frontmatter_with_score(md_file: Path, post, scores: list[float]):
    """Add importance scores to frontmatter and save file."""
    # Update metadata while preserving existing fields
    post.metadata[SCORE_FIELD] = scores
    
    try:
        # Convert the Post object to a string with frontmatter
        # Use a very large integer instead of infinity for width
        content_with_frontmatter = frontmatter.dumps(post, sort_keys=False, width=999)
        
        # Write back to the same file
        with md_file.open('w', encoding='utf-8') as f:
            f.write(content_with_frontmatter)
        logging.info(f"Updated '{md_file.name}' with importance scores: {scores}")
    except Exception as e:
        logging.error(f"Failed to write file '{md_file.name}': {e}")

def load_existing_scores():
    """Load existing scores from impact.json."""
    try:
        if DATA_FILE.exists():
            with DATA_FILE.open('r', encoding='utf-8') as f:
                return json.load(f)
        return {}
    except Exception as e:
        logging.error(f"Error loading impact.json: {e}")
        return {}

def save_scores(scores_dict):
    """Save scores to impact.json."""
    try:
        with DATA_FILE.open('w', encoding='utf-8') as f:
            json.dump(scores_dict, f, indent=2)
        logging.info("Saved scores to impact.json")
    except Exception as e:
        logging.error(f"Error saving impact.json: {e}")

def process_files(md_files):
    """Process each Markdown file."""
    existing_scores = load_existing_scores()
    
    for md_file in md_files:
        slug = md_file.stem  # Get filename without extension
        logging.info(f"Processing file: {md_file.name}")
        
        # Skip if scores already exist for this slug
        if slug in existing_scores:
            logging.info(f"Skipping '{slug}' - already has impact scores")
            continue

        try:
            post = frontmatter.load(md_file)
        except Exception as e:
            logging.error(f"Failed to load frontmatter from '{md_file.name}': {e}")
            continue

        title = post.metadata.get('title', '').strip()
        summary = post.metadata.get('summary', '').strip()
        
        if not title and not summary:
            logging.warning(f"Both title and summary are missing in '{md_file.name}'. Skipping scoring.")
            continue

        logging.info(f"Scoring '{slug}'...")
        scores = calculate_importance_score(title, summary)
        
        # Add new scores to the dictionary and save
        existing_scores[slug] = scores
        save_scores(existing_scores)

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
