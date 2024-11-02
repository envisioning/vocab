import logging
import sys
from pathlib import Path
import frontmatter
import requests
from typing import Union
import signal
from config import API_KEY
import json

logging.basicConfig(
    level=logging.INFO,
    format='%(message)s'
)


# Constants
VOCAB_DIR = Path('../content/articles/')
SCORE_FIELD = 'generality'
API_ENDPOINT = "https://api.openai.com/v1/chat/completions"

def signal_handler(signum, frame):
    print("\nGracefully shutting down...")
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)

def estimate_year_origin(title: str, summary: str) -> Union[int, None]:
    """Estimate the year when an AI concept was first introduced."""
    prompt = f"What year was the concept of '{title}' first introduced or formally defined? Return ONLY the year (YYYY) or 'unknown'. Context: {summary}"
    
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    
    data = {
        "model": "gpt-4",
        "messages": [
            {"role": "system", "content": "You are a helpful AI historian. Respond only with a year (YYYY) or 'unknown'."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 50,
        "temperature": 0.3
    }
    
    try:
        response = requests.post(API_ENDPOINT, headers=headers, json=data)
        response.raise_for_status()
        
        year_str = response.json()['choices'][0]['message']['content'].strip().lower()
        
        try:
            if year_str == 'unknown':
                return None
            year = int(year_str)
            if 1700 <= year <= 2025:
                print(f"{title} → {year}")
                return year
            return None
        except ValueError:
            return None
            
    except Exception as e:
        print(f"Error processing {title}: {str(e)}")
        return None

def load_existing_years() -> dict:
    """Load existing year mappings from years.json."""
    try:
        with open('../data/years.json', 'r', encoding='utf-8') as f:
            content = f.read().strip()
            if not content:  # If file is empty
                return {}
            return json.loads(content)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

def save_years(years_dict: dict):
    """Save year mappings to years.json."""
    with open('../data/years.json', 'w', encoding='utf-8') as f:
        json.dump(years_dict, f, sort_keys=True, indent=2)

def process_markdown_files(directory: Path):
    """Process all markdown files in the directory."""
    years_dict = load_existing_years()
    logging.info(f"Found {len(years_dict)} existing terms in years.json\n")
    
    md_files = list(directory.glob('**/*.md'))
    filtered_files = [f for f in md_files if 'src/content/articles/' not in str(f)]
    
    logging.info(f"Found {len(filtered_files)} total Markdown files")
    logging.info(f"Terms left to process: {len(filtered_files) - len(years_dict)}\n")
    
    for md_file in filtered_files:
        try:
            post = frontmatter.load(md_file)
            title = post.metadata.get('title', '')
            summary = post.metadata.get('summary', '')
            slug = post.metadata.get('slug', '')
            
            if not title or not slug:
                continue
                
            # Skip if we already have this entry
            if slug in years_dict:
                continue
                
            year = estimate_year_origin(title, summary)
            
            if year is not None:
                years_dict[slug] = year
                # Save after each successful addition
                save_years(years_dict)
                    
        except Exception as e:
            print(f"Error processing {md_file}: {str(e)}")
            continue

def main():
    vocab_dir = Path('../content/articles/')
    if not vocab_dir.exists():
        print(f"Directory not found: {vocab_dir}")
        return
        
    process_markdown_files(vocab_dir)

if __name__ == "__main__":
    main()
