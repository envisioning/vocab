import logging
import sys
from pathlib import Path
import frontmatter
import requests
from typing import Union
import signal
from config import API_KEY
import json
import tempfile
import os

logging.basicConfig(
    level=logging.INFO,
    format='%(message)s'
)


# Constants
VOCAB_DIR = Path('../content/articles/')
SCORE_FIELD = 'generality'
API_ENDPOINT = "https://api.openai.com/v1/chat/completions"
OUTPUT_FILE = Path('../data/names.json')

def signal_handler(signum, frame):
    print("\nGracefully shutting down...")
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)

def identify_key_names(title: str, summary: str) -> Union[list[str], None]:
    """Identify 1-7 key people associated with an AI concept."""
    logging.info(f"\nProcessing: {title}")
    
    prompt = f"Who are the 1-7 MOST significant people (researchers, inventors, creators) associated with developing or pioneering '{title}'? Return ONLY a comma-separated list of full names (maximum 7 names), or 'unknown' if uncertain. Focus on the primary inventors/creators only. Context: {summary}"
    
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    
    data = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "You are a helpful AI historian. Respond only with 1-7 full names separated by commas, or 'unknown'. List only the most significant primary contributors."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 150,
        "temperature": 0.3
    }
    
    try:
        logging.info("Making API request...")
        response = requests.post(API_ENDPOINT, headers=headers, json=data)
        response.raise_for_status()
        
        logging.info(f"API Response Status: {response.status_code}")
        logging.debug(f"API Response: {response.json()}")
        
        names_str = response.json()['choices'][0]['message']['content'].strip().lower()
        logging.info(f"Raw API response: {names_str}")
        
        if names_str == 'unknown':
            logging.info("Result: unknown")
            return ['unknown']
            
        names = [name.strip() for name in names_str.split(',')]
        if 1 <= len(names) <= 7:
            logging.info(f"Result: {', '.join(names)}")
            return names
        logging.info("Result: unknown (invalid number of names)")
        return ['unknown']
            
    except requests.exceptions.RequestException as e:
        logging.error(f"API request failed: {str(e)}")
        if hasattr(e.response, 'json'):
            logging.error(f"API error details: {e.response.json()}")
        return ['unknown']
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        return ['unknown']

def process_markdown_files(directory: Path):
    """Process all markdown files and collect results in a dictionary."""
    md_files = list(directory.glob('**/*.md'))
    print(f"Found {len(md_files)} Markdown files to process\n")
    
    results = {}
    
    # Load existing results if they exist
    if OUTPUT_FILE.exists():
        with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
            results = json.load(f)
            logging.info(f"Loaded {len(results)} existing results")
    
    for md_file in md_files:
        if 'src/content/articles/' in str(md_file):
            continue
            
        try:
            post = frontmatter.load(md_file)
            title = post.metadata.get('title', '')
            summary = post.metadata.get('summary', '')
            slug = post.metadata.get('slug', '')
            
            if not title or not slug:
                continue
            
            # Skip if already processed
            if slug in results:
                continue
                
            names = identify_key_names(title, summary)
            
            if names is not None:
                results[slug] = names
                # Atomic save after each successful processing
                save_results_atomic(results)
                    
        except Exception as e:
            logging.error(f"Error processing {md_file}: {str(e)}")
            continue
            
    return results

def save_results_atomic(results: dict):
    """Save results atomically using a temporary file."""
    temp_fd, temp_path = tempfile.mkstemp(dir=OUTPUT_FILE.parent)
    try:
        with os.fdopen(temp_fd, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        # Atomic rename
        os.replace(temp_path, OUTPUT_FILE)
    except Exception as e:
        logging.error(f"Error saving results: {str(e)}")
        # Clean up the temporary file if something goes wrong
        os.unlink(temp_path)
        raise

def main():
    if not VOCAB_DIR.exists():
        logging.error(f"Directory not found: {VOCAB_DIR}")
        return
        
    results = process_markdown_files(VOCAB_DIR)
    save_results_atomic(results)
    
    logging.info(f"\nFinal results written to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
