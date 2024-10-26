#!/usr/bin/env python3
import os
import frontmatter
import argparse
from pathlib import Path
from typing import Optional, List

def update_slug_in_file(file_path: Path, dry_run: bool = False) -> Optional[str]:
    """
    Update the slug in a markdown file's frontmatter to match the filename.
    
    Args:
        file_path (Path): Path to the markdown file
        dry_run (bool): If True, don't actually modify files
    
    Returns:
        Optional[str]: Message about what changed, or None if no change needed
    """
    try:
        # Read the file
        post = frontmatter.load(file_path)
        
        # Get the desired slug from filename (remove .md extension)
        desired_slug = file_path.stem
        
        # Check if there's already a slug that matches
        current_slug = post.metadata.get('slug')
        if current_slug == desired_slug:
            return None
            
        # Store old slug for reporting
        old_slug = current_slug if current_slug else "None"
        
        if not dry_run:
            # Update the slug
            post.metadata['slug'] = desired_slug
            
            # Write the changes back to the file
            with open(file_path, 'wb') as f:
                frontmatter.dump(post, f)
        
        return f"Updated {file_path.name}: slug changed from '{old_slug}' to '{desired_slug}'"
        
    except Exception as e:
        return f"Error processing {file_path.name}: {str(e)}"

def process_directory(directory: Path, dry_run: bool = False) -> List[str]:
    """
    Process all markdown files in a directory.
    
    Args:
        directory (Path): Directory containing markdown files
        dry_run (bool): If True, don't actually modify files
    
    Returns:
        List[str]: List of messages about what changed
    """
    messages = []
    
    # Find all .md files in the directory
    md_files = directory.glob('*.md')
    
    for file_path in md_files:
        message = update_slug_in_file(file_path, dry_run)
        if message:
            messages.append(message)
    
    return messages

def main():
    # Set up argument parser
    parser = argparse.ArgumentParser(
        description='Update frontmatter slugs in markdown files to match filenames'
    )
    parser.add_argument(
        'directory',
        help='Directory containing markdown files'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Show what would be changed without actually modifying files'
    )
    
    args = parser.parse_args()
    directory = Path(args.directory)
    
    # Verify directory exists
    if not directory.is_dir():
        print(f"Error: '{directory}' is not a valid directory")
        return 1
    
    # Process the files
    messages = process_directory(directory, args.dry_run)
    
    # Print results
    if not messages:
        print("No changes needed - all slugs match their filenames")
    else:
        print("\n".join(messages))
        if args.dry_run:
            print("\nThis was a dry run. No files were modified.")
    
    return 0

if __name__ == '__main__':
    exit(main())