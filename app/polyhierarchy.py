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

    for filename in os.listdir(directory):
        if filename.lower().endswith(".md"):
            total_files += 1
            file_path = os.path.join(directory, filename)
            logging.info(f"Processing file: {file_path}")
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    title_match = re.search(r'title:\s*(.+)', content, re.MULTILINE)
                    summary_match = re.search(r'summary:\s*(.+(?:\n.+)*)', content, re.MULTILINE | re.DOTALL)
                    if title_match and summary_match:
                        title = title_match.group(1).strip().strip('"')
                        summary = summary_match.group(1).strip().strip('"')
                        summary = re.sub(r'\s+', ' ', summary)  # Replace multiple whitespace with single space
                        terms[title] = summary
                        logging.info(f"Successfully parsed {filename}")
                        successful_files += 1
                    else:
                        logging.warning(f"Failed to extract title or summary from {filename}")
                        failed_files += 1
                        if title_match:
                            logging.info(f"Title found: {title_match.group(1)}")
                        if summary_match:
                            logging.info(f"Summary found: {summary_match.group(1)}")
            except Exception as e:
                logging.error(f"Error processing {filename}: {str(e)}")
                failed_files += 1

    logging.info(f"Total files processed: {total_files}")
    logging.info(f"Successfully parsed files: {successful_files}")
    logging.info(f"Failed files: {failed_files}")
    logging.info(f"Total terms parsed: {len(terms)}")
    return terms

def calculate_similarity(terms):
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(terms.values())
    return cosine_similarity(tfidf_matrix)

def create_graph(terms, similarity_matrix, threshold=0.3):
    G = nx.Graph()
    term_list = list(terms.keys())
    for term in term_list:
        G.add_node(term)
    
    # Add edges based on similarity threshold
    for i in range(len(terms)):
        for j in range(i+1, len(terms)):
            if similarity_matrix[i][j] > threshold:
                G.add_edge(term_list[i], term_list[j])
    
    # Connect isolated nodes to their nearest neighbor
    isolated_nodes = list(nx.isolates(G))
    for node in isolated_nodes:
        i = term_list.index(node)
        nearest_neighbor = max(range(len(terms)), key=lambda j: similarity_matrix[i][j] if i != j else 0)
        G.add_edge(node, term_list[nearest_neighbor])
    
    # Ensure the graph is fully connected
    if not nx.is_connected(G):
        components = list(nx.connected_components(G))
        for i in range(len(components) - 1):
            node1 = next(iter(components[i]))
            node2 = next(iter(components[i+1]))
            G.add_edge(node1, node2)
    
    return G

def create_hierarchy(G):
    hierarchy = defaultdict(list)
    for node in G.nodes():
        neighbors = list(G.neighbors(node))
        if len(neighbors) > 0:
            hierarchy[node] = neighbors
    return hierarchy

def assign_ids(hierarchy):
    id_mapping = {}
    current_id = 1
    
    for term in hierarchy.keys():
        if term not in id_mapping:
            id_mapping[term] = current_id
            current_id += 1
        
        for child in hierarchy[term]:
            if child not in id_mapping:
                id_mapping[child] = current_id
                current_id += 1
    
    return id_mapping

def create_polyhierarchy(hierarchy, id_mapping):
    polyhierarchy = []
    for term, children in hierarchy.items():
        node = {
            "id": id_mapping[term],
            "name": term,
            "children": [id_mapping[child] for child in children]
        }
        polyhierarchy.append(node)
    
    # Add leaf nodes
    for term in id_mapping.keys():
        if term not in hierarchy:
            node = {
                "id": id_mapping[term],
                "name": term,
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
    id_mapping = assign_ids(hierarchy)
    
    logging.info("Creating polyhierarchy")
    polyhierarchy = create_polyhierarchy(hierarchy, id_mapping)
    
    output_file = 'ai_terms_hierarchy.json'
    logging.info(f"Writing results to {output_file}")
    with open(output_file, 'w') as f:
        json.dump(polyhierarchy, f, indent=2)
    
    logging.info("Processing completed successfully")

if __name__ == "__main__":
    main("../vocab/")
