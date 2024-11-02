import logging
import sys
from pathlib import Path
import frontmatter
import requests
from typing import Union
import signal
from config import API_KEY

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

def process_markdown_files(directory: Path):
    """Process all markdown files in the directory."""
    md_files = list(directory.glob('**/*.md'))
    print(f"Found {len(md_files)} Markdown files to process\n")
    
    for md_file in md_files:
        if 'src/content/articles/' in str(md_file):
            continue
            
        try:
            post = frontmatter.load(md_file)
            title = post.metadata.get('title', '')
            summary = post.metadata.get('summary', '')
            
            if not title:
                continue
                
            year = estimate_year_origin(title, summary)
            
            if year is not None:
                post.metadata['year_origin'] = year
                with open(md_file, 'w', encoding='utf-8') as f:
                    f.write(frontmatter.dumps(post))
                    
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
