import os
import json
import yaml
from pathlib import Path

def extract_and_remove_generality():
    # Define paths
    articles_dir = Path("../content/articles")
    output_file = Path("../data/years.json")
    
    # Dictionary to store year data
    year_data = {}
    
    # Iterate through markdown files
    for file in articles_dir.glob("*.md"):
        try:
            # Read file content
            with open(file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract YAML front matter
            if content.startswith('---'):
                before_fm, fm, after_content = content.split('---', 2)
                # Parse YAML
                data = yaml.safe_load(fm)
                
                # Get and remove year_origin data
                year = data.pop('year_origin', None)
                slug = data.get('slug')
                
                if year and slug:
                    year_data[slug] = year
                    
                    # Convert updated frontmatter back to YAML
                    updated_fm = yaml.dump(data, sort_keys=False, allow_unicode=True)
                    
                    # Write updated content back to file
                    updated_content = f"---\n{updated_fm}---{after_content}"
                    with open(file, 'w', encoding='utf-8') as f:
                        f.write(updated_content)
                    print(f"Removed year_origin from {file}")
                    
        except Exception as e:
            print(f"Error processing {file}: {e}")
    
    # Create directory if it doesn't exist
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    # Write to JSON file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(year_data, f, indent=2)
    
    print(f"Year data exported to {output_file}")

if __name__ == "__main__":
    extract_and_remove_generality()