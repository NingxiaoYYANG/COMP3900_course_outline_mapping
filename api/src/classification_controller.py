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
    # Define the Bloom's taxonomy levels
    bloom_levels = list(get_blooms_taxonomy().keys())
    blooms_count = {level: 0 for level in bloom_levels}
    word_to_blooms = {}  # Initialize dictionary to store word to Bloom's level mapping
    new_entries = {level: [] for level in bloom_levels}  # To store new words for updating BLOOMS_TAXONOMY

    for clo in clos:
        verb_set = set()  # Initialize a set to store unique verbs for the current CLO
        tokens = word_tokenize(clo)
        tagged = pos_tag(tokens)
        for word, tag in tagged:
            is_verb = check_is_verb(word.lower(), tag)
            if is_verb:  # Checks if the word is a verb
                verb_set.add(word.lower())  # Add the verb to the set
        for word in verb_set:
            # Check each Bloom's level
            matched_by_dict = False
            for level, keywords in get_blooms_taxonomy().items():
                if word in keywords:  # match by dict
                    blooms_count[level] += 1
                    word_to_blooms[word] = level  # Add to word_to_blooms
                    matched_by_dict = True
                    break

            if not matched_by_dict:
                # match by AI
                if classifier is None:
                    initialize_classifier()
                if bloom_levels is None:
                    raise Exception('Bloom levels not initialized')
                if word is None:
                    raise Exception('Word is None')
                result = classifier(word, bloom_levels)
                best_match = result['labels'][0]
                blooms_count[best_match] += 1
                word_to_blooms[word] = best_match  # Add to word_to_blooms
                new_entries[best_match].append(word)  # Collect new entries

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
