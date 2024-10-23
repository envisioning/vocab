import requests
import argparse
import logging
from config import API_KEY

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Example configuration for CustomGPT API
API_ENDPOINT = "https://api.openai.com/v1/chat/completions"

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
            {"role": "user", "content": "3. A very brief historical overview, providing the year of first use and when the term gained popularity, with a succinct context."},
            {"role": "user", "content": "4. Information about key contributors to the development of the concept or term, acknowledging significant figures or groups in its evolution."},
            {"role": "user", "content": "Prioritize accuracy and clarity, directly addressing the query without digressions. Ensure your explanations are informative and tailored to those seeking a deeper understanding of AI."},
            {"role": "user", "content": "Don't number your paragraphs."},
            {"role": "user", "content": "Write for an AI expert audience, and always assume the term is related to AI."},
            {"role": "user", "content": "Acronyms should be like this: 'ML (Machine Learning)' "},
            {"role": "user", "content": "Always call Artificial Intelligence as AI and Machine Learning as ML."},
            {"role": "user", "content": "You will return the following markdown format using FrontMatter and rest in body. Make sure the summary does not include the term in the beginning. Follow exactly this structure (starting with ---):"},
            {"role": "user", "content": "---"},
            {"role": "user", "content": "title: ML (Machine Learning)"},
            {"role": "user", "content": "summary: Development of algorithms and statistical models that enable computers to perform tasks without being explicitly programmed for each one."},
            {"role": "user", "content": "---"},
            {"role": "user", "content": "Machine Learning represents a fundamental shift in how computers are programmed, ..."},
            {"role": "user", "content": "Historical overview: The concept of Machine Learning was formally introduced in 1959 by Arthur Samuel..."},
            {"role": "user", "content": "Key contributors: Alongside Arthur Samuel, other notable figures..."},
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

def main():
    parser = argparse.ArgumentParser(description='Fetch AI term definitions from CustomGPT.')
    parser.add_argument('term', type=str, help='The AI term to define')
    args = parser.parse_args()

    term = args.term
    logging.info(f"Processing term: {term}")
    
    definition = get_definition_from_gpt(term)
    if definition:
        filename = f"terms/{term}.md"
        logging.info(f"Writing definition to file: {filename}")
        with open(filename, "w") as file:
            file.write(f"{term}\n\n{definition}")
        logging.info(f"Definition for {term} successfully saved to {filename}")
    else:
        logging.warning(f"Skipping {term}, no definition found.")

if __name__ == "__main__":
    logging.info("Starting script execution")
    main()
    logging.info("Script execution completed")
