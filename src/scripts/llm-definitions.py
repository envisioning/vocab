import requests
import argparse
import logging
from config import API_KEY
import re
from unidecode import unidecode  # You'll need to pip install unidecode
import os
import sys  # Add this import at the top of the file
import time  # Add for timing measurements
import subprocess  # Add for terminal clearing

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# OpenAI API configuration
API_ENDPOINT = "https://api.openai.com/v1/chat/completions"

# Update the base directory path
ARTICLES_DIR = "../content/articles/"

# Add this list near the top of the file, after the imports
DEFAULT_AI_TERMS = [
    "data analysis",
    "data parallelism",
    "dense feature",
    "Discrete system",
    "Eager learning",
    "early stopping",
    "empirical cumulative distribution function",
    "empirical risk minimization",
    "Feature learning",
    "feature spec",
    "Forward chaining",
    "Frame problem",
    "golden dataset",
    "gradient clipping",
    "graph",
    "Graph traversal",
    "hinge loss",
    "historical bias",
    "host",
    "Hyper-heuristic",
    "in-group bias",
    "Incremental learning",
    "Inference engine",
    "Information integration",
    "input generator",
    "inter-rater agreement",
    "intersection over union",
    "Knowledge extraction",
    "labeled example",
    "landmarks",
    "least squares regression",
    "Local pooling",
    "log odds",
    "margin",
    "mean absolute error",
    "mean squared error",
    "Minimax",
    "minimax loss",
    "Naive semantics",
    "Negation problem",
    "Node",
    "non-response bias",
    "numerical data",
    "out-group homogeneity bias",
    "out-of-bag evaluation",
    "packed data",
    "participation bias",
    "Pattern recognition",
    "precision recall curve",
    "PCA (Principal component analysis)",
    "Principle of rationality",
    "Probabilistic programming",
    "probability density function",
    "Process reward model",
    "Production system",
    "Query language",
    "queue",
    "Radial basis function network",
    "Reasoning system",
    "reporting bias",
    "Reservoir computing",
    "root (in decision tree context)",
    "root mean squared error",
    "sampling bias",
    "Satisfiability",
    "Sensor fusion",
    "Separation logic",
    "Similarity learning",
    "Situated approach",
    "Statistical classification",
    "SRL (Statistical relational learning)",
    "step",
    "step size",
    "Stochastic optimization",
    "summary (in TensorFlow context)",
    "Systems neuroscience",
    "target",
    "Temporal difference learning",
    "temporal data",
    "test set",
    "time series analysis",
    "timestep",
    "training serving skew",
    "Transition system",
    "True quantified Boolean formula",
    "Type system",
    "upweighting",
    "validation set",
    "weighted sum",
    "wisdom of the crowd"
]

def file_exists(slug):
    """Check if a file with the given slug already exists."""
    filepath = os.path.join(ARTICLES_DIR, f"{slug}.md")
    return os.path.exists(filepath)

# Function to get definition from OpenAI API
def get_definition_from_gpt(term):
    start_time = time.time()
    logging.info(f"Fetching definition for term: '{term}' from OpenAI API")
    logging.debug(f"Using model: gpt-5-mini")

    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }

    # Log request details
    request_size = len(str({
        "model": "gpt-5-mini",
        "messages": [
            {"role": "system", "content": "Your role is to succinctly define AI-related terms. Follow a structured response format when a term is provided. Ignore anything in parenthesis for the title, only consider it for context."},
            {"role": "user", "content": f"Here is an AI related term: {term}. Now please define it using the following instructions:"},
            {"role": "user", "content": "1. A one-sentence summary of the term, crafted to give a clear, immediate understanding of the concept."},
            {"role": "user", "content": "2. A detailed paragraph offering an expert-level explanation of the term's significance, applications, or theoretical background. This paragraph targets those with a deep interest or background in AI."},
            {"role": "user", "content": "3. A very brief , providing the year of first use and when the term gained popularity, with a succinct context."},
            {"role": "user", "content": "Prioritize accuracy and clarity, directly addressing the query without digressions. Ensure your explanations are informative and tailored to those seeking a deeper understanding of AI."},
            {"role": "user", "content": "Don't number your paragraphs."},
            {"role": "user", "content": "Write for an AI expert audience, and always assume the term is related to AI."},
            {"role": "user", "content": "Acronyms should be like this: 'ML (Machine Learning)' "},
            {"role": "user", "content": "Always call Artificial Intelligence as AI and Machine Learning as ML."},
            {"role": "user", "content": "You will return the following markdown format using FrontMatter and rest in body. Make sure the summary does not include the term in the beginning. Follow exactly this structure. The file should start with ---"},
            {"role": "user", "content": "---"},
            {"role": "user", "content": "title: [TERM_NAME] ([ACRONYM])"},
            {"role": "user", "content": "summary: [One-sentence definition that does not start with the term name]"},
            {"role": "user", "content": "---"},
            {"role": "user", "content": "[Detailed explanation paragraph...]"},
            {"role": "user", "content": "[History paragraph...]"},
            {"role": "user", "content": "[Contributors paragraph...]"},
        ]
    }).encode('utf-8'))

    try:
        logging.info(f"Sending POST request to OpenAI API endpoint: {API_ENDPOINT}")
        logging.debug(f"Request payload size: {request_size} bytes")

        response = requests.post(API_ENDPOINT, json={
            "model": "gpt-5-mini",
            "messages": [
                {"role": "system", "content": "Your role is to succinctly define AI-related terms. Follow a structured response format when a term is provided. Ignore anything in parenthesis for the title, only consider it for context."},
                {"role": "user", "content": f"Here is an AI related term: {term}. Now please define it using the following instructions:"},
                {"role": "user", "content": "1. A one-sentence summary of the term, crafted to give a clear, immediate understanding of the concept."},
                {"role": "user", "content": "2. A detailed paragraph offering an expert-level explanation of the term's significance, applications, or theoretical background. This paragraph targets those with a deep interest or background in AI."},
                {"role": "user", "content": "3. A very brief , providing the year of first use and when the term gained popularity, with a succinct context."},
                {"role": "user", "content": "Prioritize accuracy and clarity, directly addressing the query without digressions. Ensure your explanations are informative and tailored to those seeking a deeper understanding of AI."},
                {"role": "user", "content": "Don't number your paragraphs."},
                {"role": "user", "content": "Write for an AI expert audience, and always assume the term is related to AI."},
                {"role": "user", "content": "Acronyms should be like this: 'ML (Machine Learning)' "},
                {"role": "user", "content": "Always call Artificial Intelligence as AI and Machine Learning as ML."},
                {"role": "user", "content": "You will return the following markdown format using FrontMatter and rest in body. Make sure the summary does not include the term in the beginning. Follow exactly this structure. The file should start with ---"},
                {"role": "user", "content": "---"},
                {"role": "user", "content": "title: ML (Machine Learning)"},
                {"role": "user", "content": "summary: Development of algorithms and statistical models that enable computers to perform tasks without being explicitly programmed for each one."},
                {"role": "user", "content": "---"},
                {"role": "user", "content": "Machine Learning represents a fundamental shift in how computers are programmed, ..."},
                {"role": "user", "content": "The concept of Machine Learning was formally introduced in 1959 by Arthur Samuel..."},
                {"role": "user", "content": "Alongside Arthur Samuel, other notable figures..."},
            ]
        }, headers=headers)

        response_time = time.time() - start_time
        logging.info(f"Received response from OpenAI API in {response_time:.2f}s (Status: {response.status_code})")

        if response.status_code != 200:
            logging.error(f"API request failed with status code: {response.status_code}")
            logging.error(f"Response body: {response.text}")
            response.raise_for_status()

        response.raise_for_status()

        response_data = response.json()
        content = response_data.get('choices')[0].get('message').get('content')

        if content:
            content_length = len(content)
            logging.info(f"Successfully received response content ({content_length} characters)")
            logging.debug(f"Response content preview: {content[:200]}...")
        else:
            logging.warning("API returned empty content")
            content = None

        total_time = time.time() - start_time
        logging.info(f"Completed API call for '{term}' in {total_time:.2f}s")

        return content

    except requests.exceptions.Timeout as e:
        total_time = time.time() - start_time
        logging.error(f"Timeout error fetching definition for '{term}' after {total_time:.2f}s: {e}")
        return None
    except requests.exceptions.ConnectionError as e:
        total_time = time.time() - start_time
        logging.error(f"Connection error fetching definition for '{term}' after {total_time:.2f}s: {e}")
        return None
    except requests.exceptions.HTTPError as e:
        total_time = time.time() - start_time
        logging.error(f"HTTP error fetching definition for '{term}' after {total_time:.2f}s: {e}")
        return None
    except requests.exceptions.RequestException as e:
        total_time = time.time() - start_time
        logging.error(f"Request error fetching definition for '{term}' after {total_time:.2f}s: {e}")
        return None
    except Exception as e:
        total_time = time.time() - start_time
        logging.error(f"Unexpected error fetching definition for '{term}' after {total_time:.2f}s: {e}")
        return None

def clear_terminal():
    """Clear the terminal screen for better readability."""
    try:
        # For Unix/Linux/Mac
        if os.name == 'posix':
            os.system('clear')
        # For Windows
        elif os.name == 'nt':
            os.system('cls')
    except Exception as e:
        logging.debug(f"Could not clear terminal: {e}")


def slugify(text):
    """Convert text to URL-friendly slug."""
    # Convert to lowercase and replace accented characters
    text = unidecode(text).lower()
    # Replace any non-alphanumeric character with a hyphen
    text = re.sub(r'[^a-z0-9]+', '-', text)
    # Remove leading/trailing hyphens
    text = text.strip('-')
    return text

def main():
    try:
        parser = argparse.ArgumentParser(description='Fetch AI term definitions from OpenAI API.')
        parser.add_argument('term', type=str, nargs='?', help='The AI term to define')
        args = parser.parse_args()

        # Clear terminal for better readability
        clear_terminal()

        terms_to_process = [args.term] if args.term else DEFAULT_AI_TERMS
        total_terms = len(terms_to_process)

        logging.info(f"Starting definition generation for {total_terms} terms")
        logging.info(f"Using OpenAI API endpoint: {API_ENDPOINT}")

        # Filter out terms that already have files
        filtered_terms = []
        skipped_count = 0
        for i, term in enumerate(terms_to_process, 1):
            logging.info(f"[{i}/{total_terms}] Checking if '{term}' already exists...")
            temp_slug = slugify(term)
            if file_exists(temp_slug):
                logging.info(f"[{i}/{total_terms}] Article with slug '{temp_slug}' already exists. Skipping '{term}'.")
                skipped_count += 1
                continue
            filtered_terms.append((term, i, total_terms))

        logging.info(f"Found {len(filtered_terms)} terms to process, skipped {skipped_count} existing terms")

        # Process only terms that don't have existing files
        processed_count = 0
        for term, index, total in filtered_terms:
            start_time = time.time()
            logging.info(f"[{index}/{total}] Processing term: '{term}' (term {processed_count + 1}/{len(filtered_terms)})")
            definition = get_definition_from_gpt(term)
            if definition:
                # Extract title from the frontmatter
                title = None
                if '---' in definition:
                    parts = definition.split('---', 2)
                    if len(parts) >= 2:
                        # Look for title in metadata
                        for line in parts[1].split('\n'):
                            if line.startswith('title:'):
                                title = line.replace('title:', '').strip()
                                break

                # Check if the title is valid (not a placeholder or example)
                invalid_titles = ['ML (Machine Learning)', '[TERM_NAME] ([ACRONYM])', '', 'ML', 'Machine Learning']

                if title and title not in invalid_titles:
                    # Use the title from API response
                    final_title = title
                    logging.info(f"[{index}/{total}] Using API-generated title: '{title}'")
                else:
                    # Fallback: generate title from term itself
                    logging.warning(f"[{index}/{total}] Invalid or missing title in API response for '{term}'. Using fallback title generation.")

                    # Clean the term for use as title
                    clean_term = term.strip()
                    if clean_term:
                        # Capitalize first letter of each word for title
                        final_title = clean_term.title()
                        logging.info(f"[{index}/{total}] Using fallback title: '{final_title}'")
                    else:
                        logging.error(f"[{index}/{total}] Cannot generate title from empty term. Skipping '{term}'.")
                        continue

                # Create slugified filename from the final title
                slug = slugify(final_title)

                # Check if file already exists
                if file_exists(slug):
                    logging.info(f"[{index}/{total}] Article with slug '{slug}' already exists. Skipping.")
                    continue

                filename = os.path.join(ARTICLES_DIR, f"{slug}.md")

                # Update the title in metadata if we used a fallback title
                if title != final_title:
                    # Replace the invalid title in the original definition with our fallback title
                    definition = definition.replace(f"title: {title}", f"title: {final_title}")

                # Add slug to the metadata section with proper spacing
                # Re-split to get updated parts if we modified the title
                if title != final_title:
                    parts = definition.split('---', 2)

                # Add slug to the metadata section
                metadata = parts[1].strip()
                definition = f"---\n{metadata}\nslug: {slug}\n---{parts[2]}"

                # Ensure directory exists
                os.makedirs(ARTICLES_DIR, exist_ok=True)

                logging.info(f"[{index}/{total}] Writing definition to file: {filename}")
                with open(filename, "w") as file:
                    file.write(definition)
                processing_time = time.time() - start_time
                logging.info(f"[{index}/{total}] Definition for '{term}' successfully saved to {filename} ({processing_time:.2f}s)")
                processed_count += 1
            else:
                logging.warning(f"[{index}/{total}] Skipping '{term}', no definition found.")

        logging.info(f"Script execution completed. Processed {processed_count}/{len(filtered_terms)} terms successfully using OpenAI API")

        # Commenting out the execution of _all.py
        # logging.info("Executing _all.py...")
        # try:
        #     script_dir = os.path.dirname(os.path.abspath(__file__))
        #     all_script_path = os.path.join(script_dir, '_all.py')
        #     os.system(f'python3 "{all_script_path}"')
        #     logging.info("_all.py execution completed")
        # except Exception as e:
        #     logging.error(f"Error executing _all.py: {e}")

    except KeyboardInterrupt:
        logging.info("Script interrupted by user. Exiting gracefully...")
        sys.exit(0)  # Exit the script with a success status

if __name__ == "__main__":
    logging.info("Starting AI term definition generation script using OpenAI API")
    logging.info(f"Script location: {os.path.abspath(__file__)}")
    main()
