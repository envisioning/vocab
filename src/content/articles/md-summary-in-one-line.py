import os
import re
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def convert_summary_to_oneline(directory):
    # Find all .md files in the directory
    for filename in os.listdir(directory):
        if filename.endswith('.md'):
            filepath = os.path.join(directory, filename)
            logger.info(f"Processing file: {filename}")
            
            # Read the file content
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()
            
            logger.info(f"Original content:\n{content[:200]}...")  # Show first 200 chars
            
            # Regular expression to find summary in frontmatter
            pattern = r'(summary:\s*)([^\n]*(?:\n[ \t]+[^\n]+)*)'
            
            def replace_summary(match):
                # Get the full summary text and split into lines
                summary_text = match.group(2)
                logger.info(f"Found summary text: {summary_text}")
                
                # Remove leading/trailing whitespace from each line and join
                # Also remove any double spaces that might occur when joining lines
                summary_lines = [line.strip() for line in summary_text.split('\n')]
                summary_oneline = ' '.join(summary_lines).strip()
                summary_oneline = re.sub(r'\s+', ' ', summary_oneline)
                logger.info(f"Final oneline: {summary_oneline}")
                return f'{match.group(1)}{summary_oneline}'
            
            # Replace multi-line summaries with single line
            new_content = re.sub(pattern, replace_summary, content)
            
            # Write back to file if content changed
            if new_content != content:
                logger.info(f"Changes detected for {filename}")
                with open(filepath, 'w', encoding='utf-8') as file:
                    file.write(new_content)
            else:
                logger.info(f"No changes needed for {filename}")

# Run the script on the current directory
if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    logger.info(f"Starting conversion in directory: {current_dir}")
    convert_summary_to_oneline(current_dir)
