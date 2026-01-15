import re
from nltk import pos_tag
from nltk.tokenize import word_tokenize
from transformers import pipeline
import torch

from extract_helper import extract_clos_from_pdf
from known_verbs import KNOWN_VERBS
from database import update_blooms_taxonomy_db, get_blooms_taxonomy  # Import the database functions

# Define a global variable for the classifier
classifier = None

def initialize_classifier():
    global classifier
    if classifier is None:
        if torch.cuda.is_available() & torch.backends.cudnn.is_available():
            device = torch.device('cuda')
            print(f'CUDA Acceleration enabled: {torch.cuda.get_device_name()}')
        elif torch.backends.mps.is_available():
            device = torch.device('mps')
            print('MacOS Metal Acceleration enabled')
        elif torch.xpu.is_available():
            device = torch.device('xpu')
            print('Intel GPU Acceleration enabled')
        else:
            device = torch.device('cpu')
            print('No GPU available, using CPU')
        classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli", device=device)

# Define the regular expression pattern
pattern = r'[^\w]+'

def classify_clos_from_pdf(file):
    '''
    Classify clos from client uploaded file.
    Will checks for the presence of a file in the request and file format.

    Inputs
    ------
    file : course outline file uploaded from client

    Returns
    -------
    blooms_labels : list of labels from Bloom's six levels that matches the clos in the file
    '''

    # Extract clos from the PDF
    extracted_clos = extract_clos_from_pdf(file)
    
    # Match clo to blooms by dict
    blooms_count, word_to_blooms = match_clos(extracted_clos)

    return blooms_count, extracted_clos, word_to_blooms

def match_clos(clos):
    # #region agent log
    import json as json_lib
    log_data = {'location': 'classification_controller.py:56', 'message': 'match_clos called', 'data': {'closCount': len(clos) if clos else 0, 'closIsEmpty': not clos or len(clos) == 0}, 'timestamp': __import__('time').time() * 1000, 'sessionId': 'debug-session', 'runId': 'run1', 'hypothesisId': 'C'}
    with open(r'x:\Uni\COMP3900\capstone-project-3900f11adroptablestudents\.cursor\debug.log', 'a', encoding='utf-8') as f: f.write(json_lib.dumps(log_data) + '\n')
    # #endregion
    # Handle empty CLOs list
    if not clos or len(clos) == 0:
        # #region agent log
        log_data = {'location': 'classification_controller.py:59', 'message': 'Empty CLOs list', 'data': {}, 'timestamp': __import__('time').time() * 1000, 'sessionId': 'debug-session', 'runId': 'run1', 'hypothesisId': 'C'}
        with open(r'x:\Uni\COMP3900\capstone-project-3900f11adroptablestudents\.cursor\debug.log', 'a', encoding='utf-8') as f: f.write(json_lib.dumps(log_data) + '\n')
        # #endregion
        taxonomy_dict = get_blooms_taxonomy()
        if not taxonomy_dict or len(taxonomy_dict) == 0:
            from blooms_levels import BLOOMS_TAXONOMY
            taxonomy_dict = BLOOMS_TAXONOMY
        bloom_levels = list(taxonomy_dict.keys())
        blooms_count = {level: 0 for level in bloom_levels}
        return blooms_count, {}
    
    # Define the Bloom's taxonomy levels
    blooms_taxonomy_dict = get_blooms_taxonomy()
    # #region agent log
    log_data = {'location': 'classification_controller.py:72', 'message': 'get_blooms_taxonomy result', 'data': {'taxonomyKeysCount': len(blooms_taxonomy_dict.keys()) if blooms_taxonomy_dict else 0, 'taxonomyIsEmpty': not blooms_taxonomy_dict or len(blooms_taxonomy_dict) == 0, 'keys': list(blooms_taxonomy_dict.keys()) if blooms_taxonomy_dict else []}, 'timestamp': __import__('time').time() * 1000, 'sessionId': 'debug-session', 'runId': 'run1', 'hypothesisId': 'C'}
    with open(r'x:\Uni\COMP3900\capstone-project-3900f11adroptablestudents\.cursor\debug.log', 'a', encoding='utf-8') as f: f.write(json_lib.dumps(log_data) + '\n')
    # #endregion
    if not blooms_taxonomy_dict or len(blooms_taxonomy_dict) == 0:
        # #region agent log
        log_data = {'location': 'classification_controller.py:76', 'message': 'Blooms taxonomy is empty, using fallback', 'data': {}, 'timestamp': __import__('time').time() * 1000, 'sessionId': 'debug-session', 'runId': 'run1', 'hypothesisId': 'C'}
        with open(r'x:\Uni\COMP3900\capstone-project-3900f11adroptablestudents\.cursor\debug.log', 'a', encoding='utf-8') as f: f.write(json_lib.dumps(log_data) + '\n')
        # #endregion
        # Fallback to default Bloom's taxonomy levels if database is empty
        from blooms_levels import BLOOMS_TAXONOMY
        blooms_taxonomy_dict = BLOOMS_TAXONOMY
    bloom_levels = list(blooms_taxonomy_dict.keys())
    if not bloom_levels or len(bloom_levels) == 0:
        raise Exception('Bloom levels not initialized or empty')
    blooms_count = {level: 0 for level in bloom_levels}
    word_to_blooms = {}  # Initialize dictionary to store word to Bloom's level mapping
    new_entries = {level: [] for level in bloom_levels}  # To store new words for updating BLOOMS_TAXONOMY

    for clo in clos:
        if not clo or not clo.strip():  # Skip empty CLOs
            continue
        verb_set = set()  # Initialize a set to store unique verbs for the current CLO
        tokens = word_tokenize(clo)
        tagged = pos_tag(tokens)
        for word, tag in tagged:
            is_verb = check_is_verb(word.lower(), tag)
            if is_verb:  # Checks if the word is a verb
                verb_set.add(word.lower())  # Add the verb to the set
        for word in verb_set:
            if not word or not word.strip():  # Skip empty words
                continue
            # Check each Bloom's level
            matched_by_dict = False
            taxonomy_dict = get_blooms_taxonomy()
            if not taxonomy_dict or len(taxonomy_dict) == 0:
                from blooms_levels import BLOOMS_TAXONOMY
                taxonomy_dict = BLOOMS_TAXONOMY
            for level, keywords in taxonomy_dict.items():
                if word in keywords:  # match by dict
                    blooms_count[level] += 1
                    word_to_blooms[word] = level  # Add to word_to_blooms
                    matched_by_dict = True
                    break

            if not matched_by_dict:
                # match by AI
                if classifier is None:
                    initialize_classifier()
                if word is None or not word.strip():
                    # #region agent log
                    log_data = {'location': 'classification_controller.py:95', 'message': 'Skipping empty word', 'data': {'word': word}, 'timestamp': __import__('time').time() * 1000, 'sessionId': 'debug-session', 'runId': 'run1', 'hypothesisId': 'C'}
                    with open(r'x:\Uni\COMP3900\capstone-project-3900f11adroptablestudents\.cursor\debug.log', 'a', encoding='utf-8') as f: f.write(json_lib.dumps(log_data) + '\n')
                    # #endregion
                    continue
                try:
                    result = classifier(word, bloom_levels)
                    best_match = result['labels'][0]
                    blooms_count[best_match] += 1
                    word_to_blooms[word] = best_match  # Add to word_to_blooms
                    new_entries[best_match].append(word)  # Collect new entries
                except Exception as e:
                    # #region agent log
                    log_data = {'location': 'classification_controller.py:104', 'message': 'Classifier error', 'data': {'error': str(e), 'word': word, 'bloomLevelsCount': len(bloom_levels)}, 'timestamp': __import__('time').time() * 1000, 'sessionId': 'debug-session', 'runId': 'run1', 'hypothesisId': 'C'}
                    with open(r'x:\Uni\COMP3900\capstone-project-3900f11adroptablestudents\.cursor\debug.log', 'a', encoding='utf-8') as f: f.write(json_lib.dumps(log_data) + '\n')
                    # #endregion
                    raise Exception(f'Error classifying word "{word}": {str(e)}')

    # Update BLOOMS_TAXONOMY with new entries
    update_blooms_taxonomy_db(new_entries)
    return blooms_count, word_to_blooms

def check_is_verb(word, tag):
    # Correct the POS tag if the word is in the known verbs list
    if (word.lower() in KNOWN_VERBS and KNOWN_VERBS[word.lower()].startswith('VB')) or tag.startswith('VB'):
        if word.lower() in KNOWN_VERBS and KNOWN_VERBS[word.lower()].startswith('NULL'):
            return False
        return True
    return False

def extract_words_from_clo(clo):
    # Split the sentence using the pattern
    words = re.split(pattern, clo)

    # Remove empty strings from the result
    words = [word.lower() for word in words if word]

    return words

def mergeBloomsCount(count1, count2):
    # Add blooms_count to result
    for level, count in count2.items():
        count1[level] += count
    return count1

def check_code_format(course_code):
    # Define the regex pattern
    pattern = r'^[A-Za-z]{4}\d{4}$'

    return re.match(pattern, course_code)

if __name__ == "__main__":
    initialize_classifier()
