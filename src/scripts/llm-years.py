import logging
import sys
from pathlib import Path
import frontmatter
import requests
from typing import Union
import signal
from config import API_KEY
import json
import time

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

def estimate_year_origin(title: str, summary: str, retry: bool = False) -> Union[int, None]:
    """Estimate the year when an AI concept was first introduced."""
    logging.info(f"\nProcessing: {title}")
    logging.info("Sending API request..." + (" (retry attempt)" if retry else ""))
    logging.info("-" * 50)
    start_time = time.time()
    
    if retry:
        prompt = f"When was '{title}' first introduced or defined in AI? Return ONLY a year (YYYY) or 'unknown'. Context: {summary}"
    else:
        prompt = f"When was '{title}' first introduced or defined in AI? Return ONLY the year (YYYY) or 'unknown'. Context: {summary}"
    
    logging.info(f"Prompt: {prompt}")
    
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    
    data = {
        "model": "gpt-4o-mini",  # Change to standard OpenAI model
        "messages": [
            {"role": "system", "content": "You are a helpful AI historian. Respond only with a year (YYYY) or 'unknown'."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 50,
        "temperature": 0.3
    }
    
    logging.info(f"Request data: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(API_ENDPOINT, headers=headers, json=data)
        response.raise_for_status()
        
        elapsed_time = time.time() - start_time
        logging.info(f"API response received in {elapsed_time:.2f} seconds")
        
        response_json = response.json()
        logging.info(f"Full API response: {json.dumps(response_json, indent=2)}")
        
        year_str = response_json['choices'][0]['message']['content'].strip().lower()
        logging.info(f"Raw response: {year_str}")
        
        try:
            if year_str == 'unknown':
                logging.info("Result: unknown year (storing as 0)")
                return 0
            year = int(year_str)
            if 1700 <= year <= 2025:
                logging.info(f"Result: {year}")
                return year
            logging.info(f"Result: year {year} out of valid range (storing as 0)")
            return 0
        except ValueError:
            logging.info(f"Result: could not parse year from response (storing as 0)")
            return 0
            
    except Exception as e:
        logging.error(f"API Error: {str(e)} (storing as 0)")
        logging.error(f"Response content: {response.text if 'response' in locals() else 'No response'}")
        return 0
    finally:
        logging.info("-" * 50)

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
    
    # Get all markdown files
    md_files = list(directory.glob('**/*.md'))
    filtered_files = [f for f in md_files if 'src/content/articles/' not in str(f)]
    
    # Only process terms that have a year of 0
    zero_terms = {slug: year for slug, year in years_dict.items() if year == 0}
    logging.info(f"Found {len(zero_terms)} terms with year 0 to process\n")
    
    processed = 0
    total_files = len(zero_terms)
    
    for slug in zero_terms:
        processed += 1
        logging.info(f"\nProgress: {processed}/{total_files} files")
        
        try:
            # Find the corresponding markdown file
            md_file = next(f for f in filtered_files if slug in str(f))
            post = frontmatter.load(md_file)
            title = post.metadata.get('title', '')
            summary = post.metadata.get('summary', '')
            
            if not title:
                continue
                
            # Try to get the year with retry logic
            year = estimate_year_origin(title, summary, retry=True)
            if year != 0:  # Only update if we got a non-zero result
                years_dict[slug] = year
                save_years(years_dict)
                    
        except Exception as e:
            print(f"Error processing {slug}: {str(e)}")
            continue

def main():
    vocab_dir = Path('../content/articles/')
    if not vocab_dir.exists():
        print(f"Directory not found: {vocab_dir}")
        return
        
    process_markdown_files(vocab_dir)

if __name__ == "__main__":
    main()
