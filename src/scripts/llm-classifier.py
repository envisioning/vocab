import logging
import sys
from pathlib import Path
import frontmatter
import yaml
import requests
import re
from config import API_KEY
import shutil  # Add this import at the top

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

# Constants
VOCAB_DIR = Path('../vocab2/')
CATEGORY_FIELD = 'category'
# Define both the codes and full categories
CATEGORY_CODES = ["CORE", "ARCH", "IMPL", "DATA", "MATH", "GOV", "BIO"]
PRESET_CATEGORIES = [
    "CORE (foundational AI concepts, base algorithms)",
    "ARCH (architecture, components, models)",
    "IMPL (tools, infrastructure, practical implementation)",
    "DATA (data processing, handling, patterns)",
    "MATH (mathematical & statistical foundations)",
    "GOV (governance, ethics, safety, societal impact)",
    "BIO (biological, neural, cognitive inspiration)"
]

# OpenAI Configuration
API_ENDPOINT = "https://api.openai.com/v1/chat/completions"

def get_md_files(directory: Path):
    """Retrieve all .md files in the specified directory."""
    md_files = list(directory.glob('*.md'))
    logging.info(f"Found {len(md_files)} Markdown files in {directory.resolve()}.")
    return md_files

def has_category(front_matter: dict) -> bool:
    """Check if 'category' field exists in frontmatter."""
    return CATEGORY_FIELD in front_matter

def extract_title_summary(front_matter: dict) -> (str, str):
    """Extract title and summary from frontmatter."""
    title = front_matter.get('title', '').strip()
    summary = front_matter.get('summary', '').strip()
    if not title:
        logging.warning("Title not found in frontmatter.")
    if not summary:
        logging.warning("Summary not found in frontmatter.")
    return title, summary

def classify_content(title: str, summary: str) -> str:
    """Send title and summary to OpenAI API to classify into categories."""
    prompt = (
        "Please classify the following content into one, two or three of the following categories, as few as possible: "
        f"{', '.join(PRESET_CATEGORIES)}. Provide the categories as comma-separated values, only the code (ex: CORE)."
        "with the most important category first.\n\n"
        f"Title: {title}\n"
        f"Summary: {summary}\n"
        "Categories:"
    )
    
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    
    data = {
        "model": "gpt-4",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant that classifies content into predefined categories."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 10,
        "temperature": 0
    }
    
    try:
        logging.info("Sending request to OpenAI API for classification")
        response = requests.post(API_ENDPOINT, headers=headers, json=data)
        response.raise_for_status()
        response_data = response.json()
        categories = response_data['choices'][0]['message']['content'].strip()
        logging.info(f"API returned categories: {categories}")
        # Validate and sanitize response
        categories_list = [cat.strip() for cat in categories.split(',') if cat.strip() in CATEGORY_CODES]
        if not categories_list:
            logging.warning("No valid categories found in response. Defaulting to 'Uncategorized'.")
            return "Uncategorized"
        # Map codes back to full categories if needed
        return ', '.join(categories_list[:2])
    except requests.exceptions.RequestException as e:
        logging.error(f"Error during OpenAI API call: {e}")
        return "Uncategorized"

def generate_slug(title: str) -> str:
    """Generate a slug from the title."""
    # Remove special characters and replace spaces with hyphens
    slug = title.lower()
    # Remove parentheses and their contents
    slug = re.sub(r'\([^)]*\)', '', slug)
    # Replace special characters and spaces with hyphens
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    # Remove leading/trailing hyphens
    slug = slug.strip('-')
    return slug

def add_category_to_frontmatter(md_file: Path, post, category: str):
    """Add category and slug fields to frontmatter and save to new file."""
    # Generate slug from title
    title = post.metadata.get('title', '')
    slug = generate_slug(title)
    
    # Create new metadata dictionary with desired order
    new_metadata = {
        'title': title,
        'summary': post.metadata.get('summary', ''),
        'category': category,
        'slug': slug
    }
    
    # Update post metadata
    post.metadata = new_metadata
    
    try:
        # Create output directory if it doesn't exist
        output_dir = Path('terms2')
        output_dir.mkdir(exist_ok=True)
        
        # Define new file path using slug
        new_file_path = output_dir / f"{slug}.md"
        
        # Convert the Post object to a string with frontmatter
        content_with_frontmatter = frontmatter.dumps(post)
        
        # Write to the new file
        with new_file_path.open('w', encoding='utf-8') as f:
            f.write(content_with_frontmatter)
        logging.info(f"Saved file as '{new_file_path}' with category '{category}' and slug '{slug}'.")
    except Exception as e:
        logging.error(f"Failed to write file '{slug}.md': {e}")

def process_files(md_files):
    """Process each Markdown file."""
    for md_file in md_files:
        logging.info(f"Processing file: {md_file.name}")
        try:
            post = frontmatter.load(md_file)
        except Exception as e:
            logging.error(f"Failed to load frontmatter from '{md_file.name}': {e}")
            continue

        if has_category(post.metadata):
            logging.info(f"'{md_file.name}' already has a '{CATEGORY_FIELD}' field. Skipping.")
            continue

        title, summary = extract_title_summary(post.metadata)
        if not title and not summary:
            logging.warning(f"Both title and summary are missing in '{md_file.name}'. Skipping classification.")
            continue

        logging.info(f"Classifying '{md_file.name}'...")
        category = classify_content(title, summary)
        add_category_to_frontmatter(md_file, post, category)

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
