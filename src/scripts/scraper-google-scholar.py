import requests
from bs4 import BeautifulSoup
import time
import random
import re
import logging
from typing import Optional, Tuple, Dict
import yaml
import os
from pathlib import Path
import argparse
import urllib.parse

# Set up logging
# Create console handler
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
console_formatter = logging.Formatter('%(message)s')  # Simplified format for console
console_handler.setFormatter(console_formatter)

# Set up root logger
logger = logging.getLogger()
logger.setLevel(logging.INFO)
logger.addHandler(console_handler)

class ScholarScraper:
    def __init__(self, delay_range: Tuple[float, float] = (3.0, 7.0)):
        """
        Initialize the scraper with configurable delay between requests.
        
        Args:
            delay_range: Tuple of (min_delay, max_delay) in seconds
        """
        self.base_url = "https://scholar.google.com/scholar"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.delay_range = delay_range
        self.request_count = 0

    def _random_delay(self):
        """Implement a random delay between requests to avoid rate limiting."""
        delay = random.uniform(*self.delay_range)
        time.sleep(delay)

    def get_citation_count(self, title: str) -> Optional[int]:
        """
        Search for a paper title and return its citation count.
        
        Args:
            title: The title of the paper to search for
            
        Returns:
            Optional[int]: Number of citations or None if not found
        """
        try:
            # Implement exponential backoff for rate limiting
            max_retries = 3
            retry_delay = 60  # Initial delay in seconds
            
            for attempt in range(max_retries):
                try:
                    # Add a delay between requests
                    self._random_delay()
                    
                    # Construct the search URL with "(machine learning)" appended
                    params = {
                        'q': f'{title} "machine learning"',  # Remove allintitle: and use quotes instead
                        'hl': 'en'
                    }
                    logging.info(f"Search URL: {self.base_url}?{urllib.parse.urlencode(params)}")
                    response = self.session.get(self.base_url, params=params)
                    response.raise_for_status()
                    
                    # Parse the response
                    soup = BeautifulSoup(response.text, 'html.parser')
                    
                    # Look for the results count text
                    results_div = soup.find('div', id='gs_ab_md')
                    if results_div:
                        results_text = results_div.get_text()
                        logging.info(f"Results text found: {results_text}")
                        # Match patterns like "About 4.170.000 results" or "About 4,170,000 results"
                        match = re.search(r'About ([\d.,]+) results', results_text)
                        if match:
                            raw_count = match.group(1)
                            logging.info(f"Matched results count: {raw_count}")
                            citation_count = int(raw_count.replace('.', '').replace(',', ''))
                            return citation_count
                    
                    # If we found the results div but no count
                    return 0
                    
                    return None
                
                except requests.exceptions.RequestException as e:
                    if attempt < max_retries - 1:
                        logging.warning(f"Request failed for '{title}'. Retrying in {retry_delay} seconds...")
                        time.sleep(retry_delay)
                        retry_delay *= 2  # Exponential backoff
                    else:
                        raise e
                
        except Exception as e:
            logging.error(f"Error processing title '{title}': {str(e)}")
            return None

class MarkdownFile:
    def __init__(self, filepath: str):
        self.filepath = filepath
        self.frontmatter: Dict = {}
        self.content: str = ""
        self._load_file()

    def _load_file(self):
        """Load and parse markdown file with frontmatter."""
        with open(self.filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check for frontmatter
        frontmatter_match = re.match(r'^---\n(.*?)\n---\n(.*)$', content, re.DOTALL)
        
        if frontmatter_match:
            # Parse YAML frontmatter
            try:
                self.frontmatter = yaml.safe_load(frontmatter_match.group(1))
                self.content = frontmatter_match.group(2)
            except yaml.YAMLError as e:
                logging.error(f"Error parsing frontmatter in {self.filepath}: {str(e)}")
                self.content = content
        else:
            self.content = content

    def save(self):
        """Save the markdown file with updated frontmatter."""
        # Ensure summary is on one line if it exists
        if 'summary' in self.frontmatter:
            # Replace newlines with spaces and remove multiple spaces
            self.frontmatter['summary'] = ' '.join(str(self.frontmatter['summary']).split())

        output = "---\n"
        # Use literal style (|) for all strings EXCEPT summary
        output += yaml.dump(
            self.frontmatter, 
            allow_unicode=True, 
            sort_keys=False,
            width=float('inf'),  # Prevent line wrapping
            default_style=None,  # Don't quote everything
            default_flow_style=False  # Use block style as default
        )
        output += "---\n"
        output += self.content

        with open(self.filepath, 'w', encoding='utf-8') as f:
            f.write(output)

def process_markdown_files(directory: str):
    """
    Process all markdown files in a directory and update their frontmatter with citation counts.
    
    Args:
        directory: Path to directory containing markdown files
    """
    scraper = ScholarScraper()
    path = Path(directory)
    md_files = list(path.glob('**/*.md'))
    total_files = len(md_files)
    
    logging.info(f"\nFound {total_files} markdown files to process")
    
    for index, md_path in enumerate(md_files, 1):
        try:
            logging.info(f"\n[{index}/{total_files}] Processing: {md_path}")
            
            # Load and parse the markdown file
            md_file = MarkdownFile(str(md_path))
            
            # Skip if we've already processed this file and it has citations
            if md_file.frontmatter.get('citations') is not None:
                logging.info(f"⏭️  Skipping - already has citation count")
                continue
            
            # Get the title from frontmatter
            title = md_file.frontmatter.get('title')
            if not title:
                logging.warning(f"⚠️  No title found in frontmatter")
                continue
            
            # Get citation count
            logging.info(f"🔍 Searching for: {title}")
            citation_count = scraper.get_citation_count(title)
            
            # Update frontmatter with citations and timestamp
            md_file.frontmatter['citations'] = citation_count if citation_count is not None else 'Not found'
            md_file.frontmatter['last_scraped'] = time.strftime('%Y-%m-%d %H:%M:%S')
            
            # Save the updated file
            md_file.save()
            
            logging.info(f"✅ Updated with {citation_count} citations")
            
        except Exception as e:
            logging.error(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Update markdown files with citation counts from Google Scholar')
    parser.add_argument('directory', help='Directory containing markdown files')
    
    args = parser.parse_args()
    
    process_markdown_files(args.directory)
