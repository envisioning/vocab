import os
import re
import json
import logging
from collections import defaultdict
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import networkx as nx

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def parse_markdown_files(directory):
    terms = {}
    total_files = 0
    successful_files = 0
    failed_files = 0
    failed_filenames = []
    duplicate_terms = []

    for filename in os.listdir(directory):
        if filename.lower().endswith(".md"):
            total_files += 1
            file_path = os.path.join(directory, filename)
            logging.info(f"Processing file: {file_path}")
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    frontmatter_match = re.search(r'---\s*(.*?)\s*---', content, re.MULTILINE | re.DOTALL)
                    if frontmatter_match:
                        frontmatter = frontmatter_match.group(1)
                        title_match = re.search(r'title:\s*"?([^"\n]+)"?', frontmatter)
                        summary_match = re.search(r'summary:\s*"?(.*?)(?:"|$|\n)', frontmatter)
                        slug_match = re.search(r'slug:\s*"?([^"\n]+)"?', frontmatter)
                        
                        # Add generality extraction
                        generality_match = re.search(r'generality:\s*\n((?:\s*-\s*\d+\.?\d*\s*\n*)+)', frontmatter)
                        
                        # Get the main content after frontmatter
                        main_content = content.split('---', 2)[-1].strip()
                        
                        if title_match and summary_match:
                            title = title_match.group(1).strip()
                            summary = summary_match.group(1).strip()
                            summary = re.sub(r'\s+', ' ', summary)
                            
                            slug = slug_match.group(1).strip() if slug_match else None
                            
                            if title in terms:
                                duplicate_terms.append((title, filename))
                                logging.warning(f"Duplicate term found: {title} in {filename}")
                            
                            # Extract and process generality scores
                            generality_scores = []
                            if generality_match:
                                scores_text = generality_match.group(1)
                                generality_scores = [float(score.strip()) for score in re.findall(r'-\s*(\d+\.?\d*)', scores_text)]
                                logging.debug(f"Extracted generality scores for {title}: {generality_scores}")
                            else:
                                logging.warning(f"No generality scores found for {title}")
                                generality_scores = []
                            
                            # Store all metadata and content
                            terms[title] = {
                                'summary': summary,
                                'slug': slug,
                                'content': main_content,
                                'generality_scores': generality_scores
                            }
                            
                            logging.info(f"Successfully parsed {filename}")
                            successful_files += 1
                        else:
                            logging.warning(f"Failed to extract required fields from {filename}")
                            failed_files += 1
                            failed_filenames.append(filename)
                    else:
                        logging.warning(f"No frontmatter found in {filename}")
                        failed_files += 1
                        failed_filenames.append(filename)
            except Exception as e:
                logging.error(f"Error processing {filename}: {str(e)}")
                failed_files += 1
                failed_filenames.append(filename)

    logging.info(f"Total files processed: {total_files}")
    logging.info(f"Successfully parsed files: {successful_files}")
    logging.info(f"Failed files: {failed_files}")
    if failed_filenames:
        logging.info(f"Failed files list: {', '.join(failed_filenames)}")
    logging.info(f"Total terms parsed: {len(terms)}")
    if duplicate_terms:
        logging.info(f"Duplicate terms found: {duplicate_terms}")
    return terms

def calculate_similarity(terms):
    # Combine title, summary, and main content for each term
    combined_texts = [
        f"{term} {term_data['summary']} {term_data['content']}" 
        for term, term_data in terms.items()
    ]
    
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(combined_texts)
    return cosine_similarity(tfidf_matrix)

def create_graph(terms, similarity_matrix, threshold=0.35):
    G = nx.Graph()
    term_list = list(terms.keys())
    for term in term_list:
        G.add_node(term)
    
    # Add edges based on similarity threshold with weights
    for i in range(len(terms)):
        for j in range(i+1, len(terms)):
            similarity = similarity_matrix[i][j]
            if similarity > threshold:
                G.add_edge(term_list[i], term_list[j], weight=float(similarity))
    
    # Connect isolated nodes to their nearest neighbor
    isolated_nodes = list(nx.isolates(G))
    for node in isolated_nodes:
        i = term_list.index(node)
        nearest_neighbor_idx = max(range(len(terms)), 
                                 key=lambda j: similarity_matrix[i][j] if i != j else 0)
        similarity = float(similarity_matrix[i][nearest_neighbor_idx])
        G.add_edge(node, term_list[nearest_neighbor_idx], weight=similarity)
    
    # Ensure the graph is fully connected
    if not nx.is_connected(G):
        components = list(nx.connected_components(G))
        for i in range(len(components) - 1):
            node1 = next(iter(components[i]))
            node2 = next(iter(components[i+1]))
            # Add a minimal weight for forced connections
            G.add_edge(node1, node2, weight=threshold)
    
    return G

def create_hierarchy(G):
    hierarchy = defaultdict(dict)
    # Store both neighbors and their similarity scores
    for node in G.nodes():
        neighbors = list(G.neighbors(node))
        # Get edge data (similarity scores) for each neighbor
        neighbor_scores = {neighbor: G.get_edge_data(node, neighbor)['weight'] 
                         for neighbor in neighbors}
        if len(neighbors) > 0:
            hierarchy[node] = neighbor_scores
    return hierarchy

def assign_ids(hierarchy, terms):
    # Use slugs as IDs
    id_mapping = {}
    for term in hierarchy.keys():
        try:
            slug = terms[term]['slug']
            if not slug:
                raise KeyError(f"Missing slug for term: {term}")
            id_mapping[term] = slug
        except KeyError as e:
            logging.error(f"Error getting slug for {term}: {str(e)}")
            # Fallback: create a slug from the term name if missing
            id_mapping[term] = term.lower().replace(' ', '-')
    
    # Also map any terms that might be children but not in hierarchy keys
    for term in terms:
        if term not in id_mapping:
            try:
                slug = terms[term]['slug']
                if not slug:
                    raise KeyError(f"Missing slug for term: {term}")
                id_mapping[term] = slug
            except KeyError as e:
                logging.error(f"Error getting slug for {term}: {str(e)}")
                id_mapping[term] = term.lower().replace(' ', '-')
    
    return id_mapping

def create_polyhierarchy(hierarchy, id_mapping, terms):
    polyhierarchy = []
    for term, connections in hierarchy.items():
        try:
            generality_scores = terms[term]['generality_scores']
            generality_avg = round(sum(generality_scores) / len(generality_scores), 3) if generality_scores else None
            if generality_avg is None:
                logging.warning(f"Could not calculate generality for term: {term}")
        except (KeyError, ZeroDivisionError) as e:
            logging.error(f"Error calculating generality for {term}: {str(e)}")
            generality_avg = None

        node = {
            "slug": id_mapping[term], 
            "name": term,
            "summary": terms[term]['summary'],
            "generality": generality_avg,
            "children": [
                {
                    "slug": id_mapping[child],  
                    "similarity": float(score)
                } for child, score in connections.items()
            ]
        }
        polyhierarchy.append(node)

    # Handle leaf nodes
    for term in id_mapping.keys():
        if term not in hierarchy:
            try:
                generality_scores = terms[term]['generality_scores']
                generality_avg = round(sum(generality_scores) / len(generality_scores), 3) if generality_scores else None
                if generality_avg is None:
                    logging.warning(f"Could not calculate generality for leaf term: {term}")
            except (KeyError, ZeroDivisionError) as e:
                logging.error(f"Error calculating generality for leaf {term}: {str(e)}")
                generality_avg = None

            node = {
                "slug": id_mapping[term],  # Changed from "id" to "slug"
                "name": term,
                "summary": terms[term]['summary'],
                "generality": generality_avg,
                "children": []
            }
            polyhierarchy.append(node)
    
    return polyhierarchy

def main(directory):
    logging.info(f"Starting processing for directory: {directory}")
    terms = parse_markdown_files(directory)
    
    if not terms:
        logging.error("No terms were parsed. Exiting.")
        return

    logging.info("Calculating similarity matrix")
    similarity_matrix = calculate_similarity(terms)
    
    logging.info("Creating graph")
    G = create_graph(terms, similarity_matrix)
    
    logging.info("Creating hierarchy")
    hierarchy = create_hierarchy(G)
    
    logging.info("Assigning IDs")
    id_mapping = assign_ids(hierarchy, terms)  # Updated to pass terms
    
    logging.info("Creating polyhierarchy")
    polyhierarchy = create_polyhierarchy(hierarchy, id_mapping, terms)
    
    output_file = '../data/ai_terms_hierarchy.json'
    logging.info(f"Writing results to {output_file}")
    with open(output_file, 'w') as f:
        json.dump(polyhierarchy, f, indent=2)
    
    logging.info("Processing completed successfully")

if __name__ == "__main__":
    main("../content/articles")
