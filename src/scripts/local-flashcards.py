import os
import json
import re
from pathlib import Path

def extract_frontmatter(content):
    """Extract frontmatter from markdown content."""
    match = re.match(r'^---\s*(.*?)\s*---\s*', content, re.DOTALL)
    if not match:
        return None
    
    frontmatter = {}
    yaml_text = match.group(1)
    
    # Simple line-by-line parsing
    for line in yaml_text.split('\n'):
        line = line.strip()
        if line and ':' in line:
            key, value = line.split(':', 1)
            frontmatter[key.strip()] = value.strip()
    
    return frontmatter

def load_years(years_file):
    """Load years data from JSON file."""
    try:
        with open(years_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading years file: {e}")
        return {}

def create_flashcards(articles_dir, years_file, output_file):
    """Create flashcards JSON file from articles directory and years data."""
    flashcards = []
    skipped_files = []
    error_files = []
    total_files = 0
    
    # Load years data
    years_data = load_years(years_file)
    
    for root, _, files in os.walk(articles_dir):
        for file in files:
            if file.endswith('.md'):
                total_files += 1
                file_path = os.path.join(root, file)
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    frontmatter = extract_frontmatter(content)
                    
                    if frontmatter and 'title' in frontmatter:
                        # Get the slug from frontmatter or filename
                        slug = frontmatter.get('slug', file[:-3])
                        year = years_data.get(slug, 0)
                        
                        flashcard = {
                            "title": frontmatter['title'],
                            "definition": frontmatter.get('summary', ''),
                            "year": year,
                            "slug": slug
                        }
                        flashcards.append(flashcard)
                    else:
                        skipped_files.append(file)
                
                except Exception as e:
                    error_files.append((file, str(e)))
    
    # Create the output JSON structure
    output_data = {
        "flashCards": flashcards
    }
    
    # Ensure the output directory exists
    output_path = Path(output_file)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Write the JSON file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    # Print summary
    print(f"\nProcessing Summary:")
    print(f"Total files found: {total_files}")
    print(f"Successfully processed: {len(flashcards)}")
    print(f"Skipped files (no frontmatter/title): {len(skipped_files)}")
    print(f"Files with errors: {len(error_files)}")
    
    if skipped_files:
        print("\nSkipped files:")
        for file in skipped_files:
            print(f"- {file}")
    
    if error_files:
        print("\nFiles with errors:")
        for file, error in error_files:
            print(f"- {file}: {error}")

if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    articles_dir = os.path.join(script_dir, "..", "content", "articles")
    years_file = os.path.join(script_dir, "..", "data", "years.json")
    output_file = os.path.join(script_dir, "..", "data", "flashcards.json")
    
    create_flashcards(articles_dir, years_file, output_file)