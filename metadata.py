import os
import re

def extract_summary(md_content):
    # Use a regular expression to find the first level-2 header
    match = re.search(r"^## (.+)$", md_content, re.MULTILINE)
    if match:
        return match.group(1).strip()
    return "No summary found"

def add_frontmatter(md_file):
    with open(md_file, 'r+', encoding='utf-8') as file:
        content = file.read()
        title = os.path.splitext(os.path.basename(md_file))[0]
        summary = extract_summary(content)
        frontmatter = f"---\ntitle: \"{title}\"\nsummary: \"{summary}\"\n---\n\n"
        file.seek(0, 0)
        file.write(frontmatter + content)

def process_markdown_files(directory):
    for filename in os.listdir(directory):
        if filename.endswith('.md'):
            add_frontmatter(os.path.join(directory, filename))

# Change 'path_to_directory' to the path of your directory containing the .md files
path_to_directory = '.'
process_markdown_files(path_to_directory)