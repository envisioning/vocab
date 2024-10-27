import requests
from bs4 import BeautifulSoup
import time
import random
import re
import logging
import json
from typing import Optional, List, Dict, Tuple
import yaml
import os
from pathlib import Path
import argparse
import urllib.parse
from dataclasses import dataclass, asdict
from datetime import datetime

# Set up logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(message)s',
    handlers=[logging.StreamHandler()]
)

@dataclass
class Source:
    """Represents a scholarly source with its metadata and quality metrics"""
    title: str
    authors: List[str]
    year: int
    url: str
    citation_count: int
    venue: str
    abstract: str = ""
    relevance_score: float = 0.0
    authority_score: float = 0.0
    
    @property
    def total_score(self) -> float:
        """Calculate total score combining relevance and authority"""
        return (self.relevance_score * 0.4) + (self.authority_score * 0.6)
    
    def calculate_authority_score(self):
        """Calculate authority score based on citations, venue, and recency"""
        # Base score from citations (normalized to 0-1 range)
        citation_score = min(self.citation_count / 10000, 1.0)
        
        # Recency bonus (0-1 range)
        recency_score = (self.year - 2015) / (2024 - 2015) if self.year >= 2015 else 0
        
        # Venue score
        venue_terms = ['nature', 'science', 'acl', 'neurips', 'icml', 'iclr', 'aaai', 'ijcai']
        venue_score = 0.8 if any(term in self.venue.lower() for term in venue_terms) else 0.4
        
        # Combine scores with weights
        self.authority_score = (
            citation_score * 0.5 +
            recency_score * 0.3 +
            venue_score * 0.2
        )
    
    def to_dict(self) -> Dict:
        """Convert source to dictionary with computed scores"""
        data = asdict(self)
        data['total_score'] = self.total_score
        
        # Add score breakdowns for transparency
        data['score_components'] = {
            'citation_impact': min(self.citation_count / 10000, 1.0),
            'recency_score': (self.year - 2015) / (2024 - 2015) if self.year >= 2015 else 0,
            'venue_score': 0.8 if any(term in self.venue.lower() 
                                    for term in ['nature', 'science', 'acl', 'neurips', 'icml', 'iclr', 'aaai', 'ijcai']) 
                              else 0.4
        }
        
        return data

class ScholarSourceFinder:
    def __init__(self, delay_range: Tuple[float, float] = (30.0, 60.0)):
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
        logging.info(f"Waiting {delay:.1f} seconds...")
        time.sleep(delay)

    def _make_request(self, params: Dict) -> Optional[requests.Response]:
        """Make request with exponential backoff for rate limiting"""
        max_retries = 3
        retry_delay = 60  # Initial delay in seconds
        
        for attempt in range(max_retries):
            try:
                self._random_delay()
                
                logging.info(f"Search URL: {self.base_url}?{urllib.parse.urlencode(params)}")
                response = self.session.get(self.base_url, params=params)
                
                if response.status_code == 200:
                    return response
                elif response.status_code == 429:
                    wait_time = retry_delay * (2 ** attempt)  # Exponential backoff
                    logging.warning(f"Rate limited. Waiting {wait_time} seconds before retry {attempt + 1}/{max_retries}")
                    time.sleep(wait_time)
                    continue
                else:
                    response.raise_for_status()
                    
            except requests.exceptions.RequestException as e:
                if attempt < max_retries - 1:
                    wait_time = retry_delay * (2 ** attempt)
                    logging.warning(f"Request failed: {str(e)}. Waiting {wait_time} seconds...")
                    time.sleep(wait_time)
                else:
                    raise e
        
        return None

    def generate_search_queries(self, concept: str, title: str) -> List[Dict[str, any]]:
        """Generate search queries with better focus on ML/AI papers"""
        return [
            {
                'query': f'"{concept}" ("machine learning" OR "artificial intelligence" OR "deep learning") ("theory" OR "foundations")',
                'strategy': 'foundational',
                'params': {
                    'as_ylo': 2010,  # Updated to more recent papers
                    'sort': 'citations'
                }
            },
            {
                'query': f'"{concept}" ("survey" OR "review") ("machine learning" OR "artificial intelligence" OR "deep learning")',
                'strategy': 'review',
                'params': {
                    'as_ylo': 2018,  # More recent reviews
                    'as_yhi': 2024
                }
            },
            {
                'query': f'"{title}" ("implementation" OR "architecture" OR "methodology") ("machine learning" OR "deep learning")',
                'strategy': 'technical',
                'params': {
                    'as_ylo': 2015
                }
            }
        ]

    def find_sources(self, concept: str, title: str, num_sources: int = 5) -> List[Source]:
        sources = []
        queries = self.generate_search_queries(concept, title)
        
        try:
            for query_info in queries:
                try:
                    self._random_delay()
                    
                    params = {
                        'q': query_info['query'],
                        'hl': 'en',
                        **query_info['params']
                    }
                    
                    logging.info(f"🔍 Searching: {query_info['query']}")
                    response = self._make_request(params)
                    
                    if not response:
                        logging.warning("Failed to get response after retries, skipping query")
                        continue
                    
                    soup = BeautifulSoup(response.text, 'html.parser')
                    
                    for result in soup.select('.gs_ri'):
                        try:
                            title_elem = result.select_one('.gs_rt')
                            if not title_elem:
                                continue
                            paper_title = title_elem.get_text(strip=True)
                            
                            url_elem = title_elem.select_one('a')
                            url = url_elem['href'] if url_elem else ""
                            
                            author_venue = result.select_one('.gs_a')
                            if author_venue:
                                text = author_venue.get_text(strip=True)
                                parts = text.split(' - ')
                                authors = [a.strip() for a in parts[0].split(',')]
                                venue = parts[1] if len(parts) > 1 else ""
                                year_match = re.search(r'20\d{2}', text)
                                year = int(year_match.group(0)) if year_match else 0
                            else:
                                authors = []
                                venue = ""
                                year = 0
                            
                            cite_elem = result.select_one('.gs_fl a')
                            citations = 0
                            if cite_elem and 'Cited by' in cite_elem.get_text():
                                citations = int(re.search(r'\d+', cite_elem.get_text()).group())
                            
                            abstract_elem = result.select_one('.gs_rs')
                            abstract = abstract_elem.get_text(strip=True) if abstract_elem else ""
                            
                            # Fix spacing issues in text extraction
                            paper_title = ' '.join(paper_title.split())  # Normalize spaces
                            if abstract_elem:
                                abstract = ' '.join(abstract_elem.get_text(strip=True).split())
                            
                            # Clean up author names and venue
                            if author_venue:
                                text = ' '.join(author_venue.get_text(strip=True).split())
                                parts = text.split(' - ')
                                authors = [' '.join(a.strip().split()) for a in parts[0].split(',')]
                                venue = ' '.join(parts[1].split()) if len(parts) > 1 else ""
                            
                            source = Source(
                                title=paper_title,
                                authors=authors,
                                year=year,
                                url=url,
                                citation_count=citations,
                                venue=venue,
                                abstract=abstract,
                                relevance_score=0.7  # Default score, could be improved
                            )
                            source.calculate_authority_score()
                            
                            if not any(s.title == source.title for s in sources):
                                sources.append(source)
                            
                        except Exception as e:
                            logging.warning(f"Error processing result: {str(e)}")
                    
                except requests.exceptions.RequestException as e:
                    logging.error(f"Request failed: {str(e)}")
                    continue
            
            # Sort by total score
            sources.sort(key=lambda x: x.total_score, reverse=True)
            return sources[:num_sources]
            
        except Exception as e:
            logging.error(f"Error finding sources for '{concept}': {str(e)}")
            return []

def process_markdown_files(input_dir: str, output_dir: str):
    """Process markdown files and create corresponding JSON source files"""
    finder = ScholarSourceFinder()
    
    input_path = Path(input_dir)
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    md_files = list(input_path.glob('**/*.md'))
    total_files = len(md_files)
    
    logging.info(f"\nFound {total_files} markdown files to process")
    
    # Process files one at a time with longer delays
    for index, md_path in enumerate(md_files, 1):
        try:
            logging.info(f"\n[{index}/{total_files}] Processing: {md_path}")
            
            # Check if sources file already exists and is recent
            slug = md_path.stem
            source_file = output_path / f"{slug}_sources.json"
            if source_file.exists():
                mod_time = datetime.fromtimestamp(source_file.stat().st_mtime)
                if (datetime.now() - mod_time).days < 30:
                    logging.info(f"⏭️  Skipping - sources recently updated")
                    continue
            
            # Parse the markdown file
            with open(md_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            frontmatter_match = re.match(r'^---\n(.*?)\n---\n(.*)$', content, re.DOTALL)
            if not frontmatter_match:
                logging.warning("⚠️  No frontmatter found")
                continue
            
            metadata = yaml.safe_load(frontmatter_match.group(1))
            title = metadata.get('title')
            
            if not title:
                logging.warning("⚠️  Missing title in frontmatter")
                continue
            
            # Find sources
            logging.info(f"🔍 Finding sources for: {title}")
            sources = finder.find_sources(title, title)
            
            if not sources:
                logging.warning("⚠️  No sources found")
                continue
            
            # Create JSON output
            output_data = {
                'concept': title,
                'slug': slug,
                'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'sources': [s.to_dict() for s in sources],
                'metadata': {
                    'total_sources': len(sources),
                    'source_strategies': [
                        'foundational',
                        'review',
                        'technical'
                    ],
                    'score_weights': {
                        'relevance': 0.4,
                        'authority': 0.6
                    }
                }
            }
            
            # Save as JSON
            with open(source_file, 'w', encoding='utf-8') as f:
                json.dump(output_data, f, indent=2, ensure_ascii=False)
            
            logging.info(f"✅ Created source file with {len(sources)} sources")
            
            # Add a longer delay between files
            if index < total_files:
                delay = random.uniform(300, 600)  # 5-10 minutes
                logging.info(f"Taking a longer break between files ({delay:.0f} seconds)...")
                time.sleep(delay)
            
        except Exception as e:
            logging.error(f"❌ Error processing {md_path}: {str(e)}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Find and save authoritative sources for AI concepts')
    parser.add_argument('input_dir', help='Directory containing concept markdown files')
    parser.add_argument('output_dir', help='Directory to save source files')
    
    args = parser.parse_args()
    
    process_markdown_files(args.input_dir, args.output_dir)
