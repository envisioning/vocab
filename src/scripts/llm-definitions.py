import requests
import argparse
import logging
from config import API_KEY
import re
from unidecode import unidecode  # You'll need to pip install unidecode
import os
import sys  # Add this import at the top of the file

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Example configuration for CustomGPT API
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

# Function to get definition from CustomGPT API
def get_definition_from_gpt(term):
    logging.info(f"Fetching definition for term: {term}")
    headers = {
        'Authorization': f'Bearer {API_KEY}',  # If your API requires authentication
        'Content-Type': 'application/json'
    }
    data = {
        "model": "gpt-4o",
        "messages": [
            {"role": "system", "content": "Your role is to succinctly define AI-related terms. Follow a structured response format when a term is provided."},
            {"role": "user", "content": f"Here is an AI related term: {term}. Now please define it using the following instructions:"},
            {"role": "user", "content": "1. A one-sentence summary of the term, crafted to give a clear, immediate understanding of the concept."},
            {"role": "user", "content": "2. A detailed paragraph offering an expert-level explanation of the term's significance, applications, or theoretical background. This paragraph targets those with a deep interest or background in AI."},
            {"role": "user", "content": "3. A very brief , providing the year of first use and when the term gained popularity, with a succinct context."},
            {"role": "user", "content": "4. Information about key contributors to the development of the concept or term, acknowledging significant figures or groups in its evolution."},
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
    }
    
    try:
        logging.info("Sending request to CustomGPT API")
        response = requests.post(API_ENDPOINT, json=data, headers=headers)
        response.raise_for_status()
        logging.info("Successfully received response from API")
        content = response.json().get('choices')[0].get('message').get('content')
        logging.debug(f"Received content: {content[:100]}...")  # Log first 100 characters of content
        return content
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching definition for {term}: {e}")
        return None

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
        parser = argparse.ArgumentParser(description='Fetch AI term definitions from CustomGPT.')
        parser.add_argument('term', type=str, nargs='?', help='The AI term to define')
        args = parser.parse_args()

        terms_to_process = [args.term] if args.term else DEFAULT_AI_TERMS
        
        # Filter out terms that already have files
        filtered_terms = []
        for term in terms_to_process:
            temp_slug = slugify(term)
            if file_exists(temp_slug):
                logging.info(f"Article with slug '{temp_slug}' already exists. Skipping {term}.")
                continue
            filtered_terms.append(term)
        
        # Process only terms that don't have existing files
        for term in filtered_terms:
            logging.info(f"Processing term: {term}")
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
                
                if title:
                    # Create slugified filename from the full title
                    slug = slugify(title)
                    
                    # Check if file already exists
                    if file_exists(slug):
                        logging.info(f"Article with slug '{slug}' already exists. Skipping.")
                        continue
                    
                    filename = os.path.join(ARTICLES_DIR, f"{slug}.md")
                    
                    # Add slug to the metadata section with proper spacing
                    metadata = parts[1].strip()
                    definition = f"---\n{metadata}\nslug: {slug}\n---{parts[2]}"
                
                    # Ensure directory exists
                    os.makedirs(ARTICLES_DIR, exist_ok=True)
                    
                    logging.info(f"Writing definition to file: {filename}")
                    with open(filename, "w") as file:
                        file.write(definition)
                    logging.info(f"Definition for {term} successfully saved to {filename}")
                else:
                    logging.error("Could not find title in API response")
            else:
                logging.warning(f"Skipping {term}, no definition found.")

        logging.info("Script execution completed")
        
        # Execute _all.py after completion
        logging.info("Executing _all.py...")
        try:
            script_dir = os.path.dirname(os.path.abspath(__file__))
            all_script_path = os.path.join(script_dir, '_all.py')
            os.system(f'python3 "{all_script_path}"')
            logging.info("_all.py execution completed")
        except Exception as e:
            logging.error(f"Error executing _all.py: {e}")

    except KeyboardInterrupt:
        logging.info("Script interrupted by user. Exiting gracefully...")
        sys.exit(0)  # Exit the script with a success status

if __name__ == "__main__":
    logging.info("Starting script execution")
    main()
