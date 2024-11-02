import json
import os

# Load terms hierarchy
with open('../data/ai_terms_hierarchy.json', 'r') as f:
    terms = json.load(f)

# Try to load years.json, create empty dict if it doesn't exist
try:
    with open('../data/years.json', 'r') as f:
        years = json.load(f)
except (FileNotFoundError, json.JSONDecodeError):
    years = {}

def extract_years(data):
    """Recursively extract slug and year from the hierarchy"""
    results = {}
    
    # Handle list case
    if isinstance(data, list):
        for item in data:
            results.update(extract_years(item))
        return results
    
    # Handle dictionary case
    if isinstance(data, dict):
        # Only add if year exists and is not null
        if data.get('year') is not None:
            results[data['slug']] = data['year']
        
        # Recursively process children
        for child in data.get('children', []):
            # If child is a dictionary with nested data (not just similarity reference)
            if isinstance(child, dict) and 'children' in child:
                results.update(extract_years(child))
    
    return results

# Extract all years from the terms hierarchy
new_years = extract_years(terms)

# Merge with existing years, new_years take precedence
years.update(new_years)

# Write back to years.json
with open('../data/years.json', 'w') as f:
    json.dump(years, f, sort_keys=True, indent=2)