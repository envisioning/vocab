import requests
from bs4 import BeautifulSoup
import time
import random
import re
import logging
import json
from typing import Optional, Tuple, Dict, List
import yaml
import os
from pathlib import Path
import argparse
import urllib.parse
from datetime import datetime, timedelta
import signal
import sys
from fake_useragent import UserAgent

# Set up logging
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
console_formatter = logging.Formatter('%(message)s')
console_handler.setFormatter(console_formatter)

logger = logging.getLogger()
logger.setLevel(logging.INFO)
logger.addHandler(console_handler)

class ScholarScraper:
    def __init__(self, delay_range: Tuple[float, float] = (3.0, 7.0)):
        self.base_url = "https://scholar.google.com/scholar"
        self.session = requests.Session()
        self.ua = UserAgent()
        self.update_user_agent()
        self.delay_range = delay_range
        self.request_count = 0
        self.MAX_REASONABLE_CITATIONS = 1000000
        
        # Backoff settings in seconds
        self.base_backoff = 1800    # 30 minutes
        self.backoff_increment = 1800  # Add 30 minutes each time
        self.max_backoff = 10800    # 180 minutes max
        self.current_backoff = self.base_backoff
        self.last_error_time = None

    def update_user_agent(self):
        """Update the session's User-Agent with a new random one"""
        self.session.headers.update({
            'User-Agent': self.ua.random
        })

    def _random_delay(self):
        delay = random.uniform(*self.delay_range)
        time.sleep(delay)

    def _clean_title(self, title: str) -> str:
        """Remove parenthetical explanations and clean the title."""
        # Extract both short and long forms if present
        match = re.match(r'^(.*?)\s*\((.*?)\)(.*)$', title)
        if match:
            short_form = match.group(1).strip()
            long_form = match.group(2).strip()
            remainder = match.group(3).strip()
            # Combine them for search
            return f"{short_form} {long_form} {remainder}".strip()
        return title.strip()

    def construct_search_queries(self, title: str) -> List[str]:
        """
        Construct multiple search queries using different formulations.
        Returns a list of tuples (query, weight) where weight influences final calculation.
        """
        queries = []
        
        # Extract acronym and full form if present
        match = re.match(r'^(.*?)\s*\((.*?)\)(.*)$', title)
        if match:
            short_form = match.group(1).strip()
            long_form = match.group(2).strip()
            
            # Formulation 1: Exact technical term
            queries.append((f'"{short_form}" "{long_form}"', 1.0))
            
            # Formulation 2: AI context
            queries.append((f'{short_form} {long_form} "artificial intelligence"', 0.8))
            queries.append((f'{long_form} AI', 0.8))
            
            # Formulation 3: ML/CS context
            queries.append((f'{short_form} {long_form} "machine learning"', 0.8))
            queries.append((f'{long_form} "computer science"', 0.7))
        
        else:
            clean_title = title.strip()
            
            # Formulation 1: Exact term
            queries.append((f'"{clean_title}"', 1.0))
            
            # Formulation 2: AI context
            queries.append((f'{clean_title} "artificial intelligence"', 0.8))
            queries.append((f'{clean_title} AI', 0.8))
            
            # Formulation 3: ML/CS context
            queries.append((f'{clean_title} "machine learning"', 0.8))
            queries.append((f'{clean_title} "computer science"', 0.7))

        return queries

    def _handle_rate_limit(self):
        """Handle rate limiting with linear backoff"""
        now = datetime.now()
        
        if self.last_error_time:
            # Add 30 minutes if we got another error within the last backoff period
            time_since_error = (now - self.last_error_time).total_seconds()
            if time_since_error < self.current_backoff:
                self.current_backoff = min(
                    self.current_backoff + self.backoff_increment, 
                    self.max_backoff
                )
        else:
            self.current_backoff = self.base_backoff
            
        self.last_error_time = now
        
        minutes = self.current_backoff / 60
        logging.warning(f"⏳ Rate limited. Waiting {minutes:.0f} minutes...")
        logging.warning(f"⏰ Will resume at: {(now + timedelta(seconds=self.current_backoff)).strftime('%H:%M:%S')}")
        
        time.sleep(self.current_backoff)

    def _make_request(self, query: str, params: Dict) -> Tuple[Optional[BeautifulSoup], Optional[str]]:
        """Make request with rate limit handling"""
        max_retries = 3
        retry_count = 0
        
        while retry_count < max_retries:
            try:
                self._random_delay()
                self.update_user_agent()
                
                # Construct the permalink
                query_string = urllib.parse.urlencode(params)
                original_url = f"{self.base_url}?{query_string}"
                
                # Add the proxy prefix
                proxied_url = f"https://r.jina.ai/{original_url}"
                
                # Make the request to the proxied URL
                response = self.session.get(proxied_url)
                
                if response.status_code == 429:  # Too Many Requests
                    logging.warning(f"Rate limit response: {response.text}")
                    logging.warning(f"Response headers: {dict(response.headers)}")
                    self._handle_rate_limit()
                    retry_count += 1
                    continue
                    
                response.raise_for_status()
                
                # Reset backoff on successful request
                self.current_backoff = self.base_backoff
                self.last_error_time = None
                
                return BeautifulSoup(response.text, 'html.parser'), None
                
            except requests.exceptions.RequestException as e:
                if "429" in str(e):
                    logging.warning(f"Rate limit exception: {str(e)}")
                    if hasattr(e.response, 'text'):
                        logging.warning(f"Response content: {e.response.text}")
                    if hasattr(e.response, 'headers'):
                        logging.warning(f"Response headers: {dict(e.response.headers)}")
                    self._handle_rate_limit()
                    retry_count += 1
                    continue
                return None, str(e)
                
        return None, "Max retries exceeded"

    def get_citation_count(self, title: str) -> List[Dict]:
        """Try multiple search queries and return all results."""
        queries = self.construct_search_queries(title)
        query_results = []
        
        for query, weight in queries:
            params = {
                'q': query,
                'hl': 'en'
            }
            
            logging.info(f"🔍 Trying query: {query}")
            soup, error = self._make_request(query, params)
            
            result = {
                'query': query,
                'weight': weight,
                'count': None,
                'raw_results': None,
                'timestamp': datetime.now().isoformat()
            }
            
            if error:
                result['error'] = error
                query_results.append(result)
                continue
                
            if soup:
                results_div = soup.find('div', id='gs_ab_md')
                if results_div:
                    results_text = results_div.get_text()
                    logging.info(f"📝 Results: {results_text}")
                    result['raw_results'] = results_text
                    
                    match = re.search(r'About ([\d.,]+) results', results_text)
                    if match:
                        raw_count = match.group(1)
                        citation_count = int(raw_count.replace('.', '').replace(',', ''))
                        result['count'] = citation_count
                        logging.info(f"✅ Found {citation_count} citations (weight: {weight})")
            
            query_results.append(result)
        
        return query_results

class ResultsManager:
    def __init__(self, output_file: str):
        self.output_file = output_file
        self.results: Dict[str, Dict] = self._load_existing_results()
        self.last_save_time = time.time()
        self.SAVE_INTERVAL = 300  # Save every 5 minutes

    def _load_existing_results(self) -> Dict[str, Dict]:
        """Load existing results from JSON file if it exists."""
        if os.path.exists(self.output_file):
            try:
                with open(self.output_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except json.JSONDecodeError:
                logging.warning(f"⚠️  Error reading existing results file. Starting fresh.")
        return {}

    def save_result(self, slug: str, title: str, query_results: List[Dict]):
        """Save all raw query results for a term."""
        self.results[slug] = {
            'title': title,
            'last_updated': datetime.now().isoformat(),
            'queries': query_results
        }
        
        # Save immediately after each result
        self._save_to_file()

    def _save_to_file(self):
        """Save all results to JSON file."""
        try:
            os.makedirs(os.path.dirname(self.output_file), exist_ok=True)
            with open(self.output_file, 'w', encoding='utf-8') as f:
                json.dump(self.results, f, indent=2, ensure_ascii=False)
            logging.info(f"💾 Saved results to {self.output_file}")
        except Exception as e:
            logging.error(f"❌ Error saving results: {str(e)}")

    def is_processed(self, slug: str) -> bool:
        """Check if a slug has already been processed."""
        return slug in self.results

def get_markdown_files(directory: str) -> List[Path]:
    """Get all markdown files from directory."""
    return list(Path(directory).glob('**/*.md'))

def get_slug_from_path(path: Path) -> str:
    """Extract slug from file path."""
    return path.stem

def signal_handler(sig, frame):
    """Handle graceful shutdown on Ctrl+C"""
    logging.info("\n🛑 Gracefully shutting down...")
    if 'results_manager' in globals():
        results_manager._save_to_file()
    sys.exit(0)

def process_markdown_files(directory: str, output_file: str):
    """
    Process markdown files and save citation counts to JSON.
    """
    global results_manager  # Make it accessible to signal handler
    
    signal.signal(signal.SIGINT, signal_handler)
    
    scraper = ScholarScraper()
    results_manager = ResultsManager(output_file)
    
    md_files = get_markdown_files(directory)
    total_files = len(md_files)
    
    logging.info(f"\n📚 Found {total_files} markdown files to process")
    
    for index, md_path in enumerate(md_files, 1):
        try:
            slug = get_slug_from_path(md_path)
            
            # Skip if already processed
            if results_manager.is_processed(slug):
                logging.info(f"⏭️  [{index}/{total_files}] Skipping {slug} - already processed")
                continue
            
            logging.info(f"\n[{index}/{total_files}] Processing: {md_path}")
            
            # Read and parse markdown file
            with open(md_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract frontmatter
            frontmatter_match = re.match(r'^---\n(.*?)\n---\n(.*)$', content, re.DOTALL)
            if not frontmatter_match:
                logging.warning(f"⚠️  No frontmatter found in {slug}")
                continue
            
            try:
                frontmatter = yaml.safe_load(frontmatter_match.group(1))
            except yaml.YAMLError as e:
                logging.error(f"❌ Error parsing frontmatter in {slug}: {str(e)}")
                continue
            
            title = frontmatter.get('title')
            if not title:
                logging.warning(f"⚠️  No title found in frontmatter for {slug}")
                continue
            
            # Get all query results
            query_results = scraper.get_citation_count(title)
            
            # Save raw results
            results_manager.save_result(slug, title, query_results)
            
            # Log summary
            valid_counts = [r['count'] for r in query_results if r.get('count') is not None]
            if valid_counts:
                logging.info(f"✅ Saved {len(valid_counts)} query results for {slug}")
                logging.info(f"📊 Range: {min(valid_counts)} - {max(valid_counts)} citations")
            else:
                logging.info(f"⚠️ No valid citation counts found for {slug}")
            
        except Exception as e:
            logging.error(f"❌ Error processing {md_path}: {str(e)}")
            # Continue with next file instead of stopping

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Scrape Google Scholar citation counts for AI terms')
    parser.add_argument('--directory', default='../content/articles/',
                      help='Directory containing markdown files (default: ../content/articles/)')
    parser.add_argument('--output', default='../data/google-scholar.json', 
                      help='Output JSON file path (default: ../data/google-scholar.json)')
    
    args = parser.parse_args()
    
    process_markdown_files(args.directory, args.output)