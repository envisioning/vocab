import json
import requests
from bs4 import BeautifulSoup
import re
from datetime import datetime, date
import time
import signal
import sys
import random

def signal_handler(sig, frame):
    print('\n\nGracefully exiting...')
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)

def parse_date_string(date_str):
    """Try to parse a date string into a standardized format"""
    try:
        # Common date formats to try
        formats = [
            '%Y-%m-%d',
            '%Y/%m/%d',
            '%B %d, %Y',
            '%d %B %Y',
            '%Y-%m-%dT%H:%M:%S',
            '%Y-%m-%dT%H:%M:%SZ',
            '%Y-%m-%d %H:%M:%S',
            '%d-%m-%Y',
            '%m/%d/%Y',
            '%Y'
        ]
        
        for fmt in formats:
            try:
                date = datetime.strptime(date_str.strip(), fmt)
                # Return full date if available, otherwise just year
                if fmt == '%Y':
                    return str(date.year)
                return date.strftime('%Y-%m-%d')
            except ValueError:
                continue
                
        # If no format matches, try to find just a year
        year_match = re.search(r'20\d{2}', date_str)
        if year_match:
            return year_match.group(0)
            
    except Exception as e:
        print(f"Error parsing date string '{date_str}': {str(e)}")
    
    return None

def is_valid_date(date_str):
    """Check if date is valid (not in future)"""
    try:
        if len(date_str) == 4:  # Just a year
            year = int(date_str)
            return year <= datetime.now().year
        else:  # Full date
            pub_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            return pub_date <= date.today()
    except:
        return False

def get_random_user_agent():
    """Return a random user agent string"""
    user_agents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/91.0.864.59'
    ]
    return random.choice(user_agents)

def extract_date_from_page(url):
    """Scrape the page and look for publication dates"""
    try:
        # Randomize headers
        headers = {
            'User-Agent': get_random_user_agent(),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
        
        session = requests.Session()
        
        # First request to get the page
        response = session.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # For ScienceDirect, try to find and click "Show more" button
        if 'sciencedirect.com' in url:
            # Look for the button or expanded content first
            show_more_button = soup.select_one('button#show-more-btn, .show-more-btn')
            
            if show_more_button:
                # Get the expanded content URL from the data attribute or construct it
                article_id = url.split('/')[-1]
                expanded_url = f"https://www.sciencedirect.com/science/article/abs/{article_id}/expanded-dates"
                
                # Make another request for the expanded content
                time.sleep(random.uniform(1, 3))  # Random delay
                response = session.get(expanded_url, headers=headers)
                soup = BeautifulSoup(response.text, 'html.parser')
            
            text = soup.get_text()
            found_dates = []
            
            sciencedirect_patterns = [
                r'Available online (\d{1,2} [A-Za-z]+ 20\d{2})',
                r'Version of Record (\d{1,2} [A-Za-z]+ 20\d{2})',
                r'Published (\d{1,2} [A-Za-z]+ 20\d{2})',
                r'Received (\d{1,2} [A-Za-z]+ 20\d{2})',
                r'Accepted (\d{1,2} [A-Za-z]+ 20\d{2})',
                r'Revised (\d{1,2} [A-Za-z]+ 20\d{2})',
            ]
            
            # Debug: Print the text we're searching
            print("Text sample:", text[:1000])
            
            for pattern in sciencedirect_patterns:
                matches = re.finditer(pattern, text)
                for match in matches:
                    date_str = match.group(1)
                    parsed_date = parse_date_string(date_str)
                    if parsed_date and is_valid_date(parsed_date):
                        print(f"Found ScienceDirect date from pattern '{pattern}': {parsed_date}")
                        found_dates.append(parsed_date)
            
            if found_dates:
                # For ScienceDirect, prefer "Available online" or "Version of Record" dates
                for date_type in ["Available online", "Version of Record"]:
                    for pattern in sciencedirect_patterns:
                        if date_type in pattern:
                            matches = re.finditer(pattern, text)
                            for match in matches:
                                date_str = match.group(1)
                                parsed_date = parse_date_string(date_str)
                                if parsed_date and is_valid_date(parsed_date):
                                    print(f"Using {date_type} date: {parsed_date}")
                                    return parsed_date
                
                # If no preferred dates found, use the earliest valid date
                valid_date = min(found_dates)
                print(f"Using earliest date found: {valid_date}")
                return valid_date
        
        # IEEE Xplore specific patterns
        elif 'ieeexplore.ieee.org' in url:
            ieee_patterns = [
                r'Date Added to IEEE Xplore:\s*(\d{1,2}\s+[A-Za-z]+\s+20\d{2})',
                r'Date of Publication:\s*(\d{1,2}\s+[A-Za-z]+\s+20\d{2})',
                r'Published in:\s*(\d{1,2}\s+[A-Za-z]+\s+20\d{2})',
            ]
            
            # Debug: Print the first 1000 chars of text
            print("Text sample:", text[:1000])
            
            for pattern in ieee_patterns:
                matches = re.finditer(pattern, text)
                for match in matches:
                    date_str = match.group(1)
                    parsed_date = parse_date_string(date_str)
                    if parsed_date and is_valid_date(parsed_date):
                        print(f"Found IEEE date from pattern '{pattern}': {parsed_date}")
                        found_dates.append(parsed_date)
            
            if found_dates:
                valid_date = min(found_dates)  # Use earliest date found
                print(f"Using earliest IEEE date: {valid_date}")
                return valid_date
        
        # General "Published" patterns
        published_patterns = [
            r'Published\s+(\d{1,2}\s+[A-Za-z]+\s+20\d{2})',
            r'Published:\s*(\d{1,2}\s+[A-Za-z]+\s+20\d{2})',
            r'Published\s+on\s+(\d{1,2}\s+[A-Za-z]+\s+20\d{2})',
        ]
        
        for pattern in published_patterns:
            match = re.search(pattern, text)
            if match:
                date_str = match.group(1)
                parsed_date = parse_date_string(date_str)
                if parsed_date and is_valid_date(parsed_date):
                    found_dates.append(parsed_date)
        
        # Meta tags and other patterns
        date_patterns = [
            ('meta[property="article:published_time"]', 'content'),
            ('meta[name="citation_publication_date"]', 'content'),
            ('meta[name="publication_date"]', 'content'),
            ('meta[name="date"]', 'content'),
            ('meta[property="og:published_time"]', 'content'),
            ('time', 'datetime'),
            ('time', 'text'),
            ('.published-date', 'text'),
            ('.date', 'text'),
            ('.pub-date', 'text')
        ]
        
        for selector, attr in date_patterns:
            elements = soup.select(selector)
            for el in elements:
                if attr == 'text':
                    date_str = el.get_text()
                else:
                    date_str = el.get(attr)
                
                if date_str:
                    parsed_date = parse_date_string(date_str)
                    if parsed_date and is_valid_date(parsed_date):
                        found_dates.append(parsed_date)
        
        # Look for full dates in text as last resort
        date_matches = re.findall(r'\d{4}-\d{2}-\d{2}', text)
        for date_str in date_matches:
            parsed_date = parse_date_string(date_str)
            if parsed_date and is_valid_date(parsed_date):
                found_dates.append(parsed_date)
        
        # Look for years if no full dates found
        if not found_dates:
            year_matches = re.findall(r'20\d{2}', text)
            for year in year_matches:
                if is_valid_date(year):
                    found_dates.append(year)
        
        # Return the most recent valid date if any found
        if found_dates:
            valid_date = max(found_dates)
            print(f"Found date: {valid_date} (from {len(found_dates)} candidates)")
            return valid_date
            
    except Exception as e:
        print(f"Error scraping {url}: {str(e)}")
    
    return None

def update_json_with_dates(filepath):
    """Update JSON file with publication dates from page content"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        updates_made = False
        
        for entry in data:
            results = entry.get('search_results', {}).get('results', [])
            for result in results:
                if 'publication_date' in result:
                    continue
                    
                print(f"\nScraping: {result['link']}")
                date = extract_date_from_page(result['link'])
                
                if date:
                    result['publication_date'] = date
                    updates_made = True
                    print(f"✓ Found date: {date}")
                    
                    # Save after each update
                    with open(filepath, 'w', encoding='utf-8') as f:
                        json.dump(data, f, indent=2, ensure_ascii=False)
                    print("Progress saved.")
                else:
                    print("✗ No date found")
                
                # Be nice to servers
                time.sleep(2)
        
        return updates_made
        
    except KeyboardInterrupt:
        print('\n\nSaving progress and exiting...')
        # Save one final time before exiting
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print("Final save completed.")
        sys.exit(0)

if __name__ == "__main__":
    filepath = "../data/txyz-papers.json"
    
    print("Starting page scraping for dates...")
    updates_made = update_json_with_dates(filepath)
    
    if updates_made:
        print("\nUpdates completed and saved.")
    else:
        print("\nNo new updates were needed.")