import os
import re
import json
import logging
from collections import defaultdict
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import networkx as nx
import pathlib

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
                            
                            # Store all metadata and content
                            terms[title] = {
                                'summary': summary,
                                'slug': slug,
                                'content': main_content
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

def load_additional_data():
    """Load data from generality.json, years.json, names.json, impact.json, complexity.json, popularity.json, safety.json, and newness.json"""
    data = {
        'generality': {},
        'years': {},
        'names': {},
        'impact': {},
        'complexity': {},
        'popularity': {},
        'safety': {},
        'newness': {}  # Add newness
    }
    
    try:
        with open('../data/generality.json', 'r') as f:
            data['generality'] = json.load(f)
        logging.info("Successfully loaded generality.json")
    except Exception as e:
        logging.error(f"Error loading generality.json: {str(e)}")
        
    try:
        with open('../data/years.json', 'r') as f:
            data['years'] = json.load(f)
        logging.info("Successfully loaded years.json")
    except Exception as e:
        logging.error(f"Error loading years.json: {str(e)}")
        
    try:
        with open('../data/names.json', 'r') as f:
            data['names'] = json.load(f)
        logging.info("Successfully loaded names.json")
    except Exception as e:
        logging.error(f"Error loading names.json: {str(e)}")

    try:
        with open('../data/impact.json', 'r') as f:
            data['impact'] = json.load(f)
        logging.info("Successfully loaded impact.json")
    except Exception as e:
        logging.error(f"Error loading impact.json: {str(e)}")

    # Add new data files
    try:
        with open('../data/complexity.json', 'r') as f:
            data['complexity'] = json.load(f)
        logging.info("Successfully loaded complexity.json")
    except Exception as e:
        logging.error(f"Error loading complexity.json: {str(e)}")

    try:
        with open('../data/popularity.json', 'r') as f:
            data['popularity'] = json.load(f)
        logging.info("Successfully loaded popularity.json")
    except Exception as e:
        logging.error(f"Error loading popularity.json: {str(e)}")

    try:
        with open('../data/safety.json', 'r') as f:
            data['safety'] = json.load(f)
        logging.info("Successfully loaded safety.json")
    except Exception as e:
        logging.error(f"Error loading safety.json: {str(e)}")

    try:
        with open('../data/newness.json', 'r') as f:
            data['newness'] = json.load(f)
        logging.info("Successfully loaded newness.json")
    except Exception as e:
        logging.error(f"Error loading newness.json: {str(e)}")
    
    return data

def check_component_exists(slug):
    """Check if a component file exists for the given slug"""
    component_path = pathlib.Path(f"../components/articles/0/{slug}.tsx")
    return component_path.is_file()

def create_polyhierarchy(hierarchy, id_mapping, terms):
    additional_data = load_additional_data()
    polyhierarchy = []
    
    for term, connections in hierarchy.items():
        try:
            # Get generality from generality.json
            generality_avg = None
            if id_mapping[term] in additional_data['generality']:
                json_scores = additional_data['generality'][id_mapping[term]]
                generality_avg = round(sum(json_scores) / len(json_scores), 3)
            else:
                logging.warning(f"No generality found for term: {term}")

            # Get impact if available
            impact_avg = None
            if id_mapping[term] in additional_data['impact']:
                json_scores = additional_data['impact'][id_mapping[term]]
                impact_avg = round(sum(json_scores) / len(json_scores), 3)
            else:
                logging.warning(f"No impact found for term: {term}")

            # Get complexity if available
            complexity_avg = None
            if id_mapping[term] in additional_data['complexity']:
                json_scores = additional_data['complexity'][id_mapping[term]]
                complexity_avg = round(sum(json_scores) / len(json_scores), 3)
            else:
                logging.warning(f"No complexity found for term: {term}")

            # Get popularity if available
            popularity_avg = None
            if id_mapping[term] in additional_data['popularity']:
                json_scores = additional_data['popularity'][id_mapping[term]]
                popularity_avg = round(sum(json_scores) / len(json_scores), 3)
            else:
                logging.warning(f"No popularity found for term: {term}")

            # Get safety if available
            safety_avg = None
            if id_mapping[term] in additional_data['safety']:
                json_scores = additional_data['safety'][id_mapping[term]]
                safety_avg = round(sum(json_scores) / len(json_scores), 3)
            else:
                logging.warning(f"No safety found for term: {term}")

            # Get newness if available
            newness_avg = None
            if id_mapping[term] in additional_data['newness']:
                json_scores = additional_data['newness'][id_mapping[term]]
                newness_avg = round(sum(json_scores) / len(json_scores), 3)
            else:
                logging.warning(f"No newness found for term: {term}")

            # Get year if available
            year = additional_data['years'].get(id_mapping[term])

            # Check if component exists
            has_component = check_component_exists(id_mapping[term])

            node = {
                "slug": id_mapping[term],
                "name": term,
                "summary": terms[term]['summary'],
                "generality": generality_avg,
                "impact": impact_avg,
                "complexity": complexity_avg,
                "popularity": popularity_avg,
                "safety": safety_avg,
                "year": year,
                "newness": newness_avg,
                "component": has_component,
                "children": [
                    {
                        "slug": id_mapping[child],
                        "similarity": float(score)
                    } for child, score in connections.items()
                ]
            }
            polyhierarchy.append(node)

        except Exception as e:
            logging.error(f"Error processing term {term}: {str(e)}")

    # Handle leaf nodes with same updates
    for term in id_mapping.keys():
        if term not in hierarchy:
            try:
                # Get generality from generality.json
                generality_avg = None
                if id_mapping[term] in additional_data['generality']:
                    json_scores = additional_data['generality'][id_mapping[term]]
                    generality_avg = round(sum(json_scores) / len(json_scores), 3)
                else:
                    logging.warning(f"No generality found for leaf term: {term}")

                # Get impact if available
                impact_avg = None
                if id_mapping[term] in additional_data['impact']:
                    json_scores = additional_data['impact'][id_mapping[term]]
                    impact_avg = round(sum(json_scores) / len(json_scores), 3)
                else:
                    logging.warning(f"No impact found for leaf term: {term}")

                # Get complexity if available
                complexity_avg = None
                if id_mapping[term] in additional_data['complexity']:
                    json_scores = additional_data['complexity'][id_mapping[term]]
                    complexity_avg = round(sum(json_scores) / len(json_scores), 3)
                else:
                    logging.warning(f"No complexity found for leaf term: {term}")

                # Get popularity if available
                popularity_avg = None
                if id_mapping[term] in additional_data['popularity']:
                    json_scores = additional_data['popularity'][id_mapping[term]]
                    popularity_avg = round(sum(json_scores) / len(json_scores), 3)
                else:
                    logging.warning(f"No popularity found for leaf term: {term}")

                # Get safety if available
                safety_avg = None
                if id_mapping[term] in additional_data['safety']:
                    json_scores = additional_data['safety'][id_mapping[term]]
                    safety_avg = round(sum(json_scores) / len(json_scores), 3)
                else:
                    logging.warning(f"No safety found for leaf term: {term}")

                # Get newness if available
                newness_avg = None
                if id_mapping[term] in additional_data['newness']:
                    json_scores = additional_data['newness'][id_mapping[term]]
                    newness_avg = round(sum(json_scores) / len(json_scores), 3)
                else:
                    logging.warning(f"No newness found for leaf term: {term}")

                # Get year if available
                year = additional_data['years'].get(id_mapping[term])

                # Check if component exists for leaf nodes
                has_component = check_component_exists(id_mapping[term])

                node = {
                    "slug": id_mapping[term],
                    "name": term,
                    "summary": terms[term]['summary'],
                    "generality": generality_avg,
                    "impact": impact_avg,
                    "complexity": complexity_avg,
                    "popularity": popularity_avg,
                    "safety": safety_avg,
                    "year": year,
                    "newness": newness_avg,
                    "component": has_component,
                    "children": []
                }
                polyhierarchy.append(node)
            except Exception as e:
                logging.error(f"Error processing leaf term {term}: {str(e)}")
    
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
    
    output_file = '../data/polyhierarchy.json'
    logging.info(f"Writing results to {output_file}")
    with open(output_file, 'w') as f:
        json.dump(polyhierarchy, f, indent=2)
    
    logging.info("Processing completed successfully")

if __name__ == "__main__":
    main("../content/articles")
