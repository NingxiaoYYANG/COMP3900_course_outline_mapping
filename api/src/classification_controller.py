import re
from nltk import pos_tag
from nltk.tokenize import word_tokenize
from transformers import pipeline

from extract_helper import extract_clos_from_pdf
from blooms_levels import BLOOMS_TAXONOMY
from known_verbs import KNOWN_VERBS

# Define a global variable for the classifier
classifier = None

def initialize_classifier():
    global classifier
    if classifier is None:
        classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

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

    # print(blooms_count)

    return blooms_count, extracted_clos, word_to_blooms

def match_clos(clos):
    # Define the Bloom's taxonomy levels
    bloom_levels = [level for level in BLOOMS_TAXONOMY]
    blooms_count = {level: 0 for level in BLOOMS_TAXONOMY}
    word_to_blooms = {}  # Initialize dictionary to store word to Bloom's level mapping

    for clo in clos:
        tokens = word_tokenize(clo)
        tagged = pos_tag(tokens)
        for word, tag in tagged:
            is_verb = check_is_verb(word, tag)
            if is_verb:  # Checks if the word is a verb
                # Turn word to lowercase for consistency
                word = word.lower()

                # Check each Bloom's level
                matched_by_dict = False
                for level, keywords in BLOOMS_TAXONOMY.items():
                    # If the verb is in the keywords list, increment the count for the level
                    if word in keywords:  # match by dict
                        blooms_count[level] += 1
                        word_to_blooms[word] = level  # Add to word_to_blooms
                        matched_by_dict = True
                        break

                if not matched_by_dict:
                    # match by AI
                    result = classifier(word, bloom_levels)
                    best_match = result['labels'][0]
                    blooms_count[best_match] += 1
                    word_to_blooms[word] = best_match  # Add to word_to_blooms
    
    return blooms_count, word_to_blooms

# legacy version, use as backup in case match_clos fails
def match_clos_by_dict(clos):
    '''
    Matches extracted verbs to Bloom's Taxonomy levels.

    Inputs
    ------
    verbs : list of strings representing the extracted verbs.

    Outputs
    -------
    blooms_count : dictionary where keys are Bloom's levels and values are counts of matched verbs.
    '''
    # Initialise a dictionary to count matches for each Bloom's level
    blooms_count = {level: 0 for level in BLOOMS_TAXONOMY}

    # Iterate through the clos
    for clo in clos:
        # split to words
        words = extract_words_from_clo(clo)
        for word in words:
            # Check each Bloom's level
            for level, keywords in BLOOMS_TAXONOMY.items():
                # If the verb is in the keywords list, increment the count for the level
                if word in keywords:
                    blooms_count[level] += 1
                    # print("LEVEL: " + level + ", WORD: " + word + ", CLO: " + clo)
        
    return blooms_count

def check_is_verb(word, tag):
    # Correct the POS tag if the word is in the known verbs list
    if (word.lower() in KNOWN_VERBS) or tag.startswith('VB'):
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


# sentence = "Explain how you would design a new system to solve this problem and evaluate its effectiveness."
# result = match_clos([sentence])
# print(result)

if __name__ == "__main__":
    classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")