import re
from nltk import pos_tag
from nltk.tokenize import word_tokenize
from transformers import pipeline

from extract_helper import extract_clos_from_pdf
from blooms_levels import BLOOMS_TAXONOMY

# Load a pre-trained model for text classification
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
    blooms_count = match_clos(extracted_clos)

    print(blooms_count)

    return blooms_count


def match_clos(clos):
    for clo in clos:
        tokens = word_tokenize(clo)
        tagged = pos_tag(tokens)
        
        # Define the Bloom's taxonomy levels
        bloom_levels = [level for level in BLOOMS_TAXONOMY]
        bloom_count = {level: 0 for level in BLOOMS_TAXONOMY}

        for word, tag in tagged:
            if tag.startswith('VB'):  # Checks if the word is a verb
                # Turn word to lowercase for consistency
                word = word.lower()

                # Check each Bloom's level
                matched_by_dict = False
                for level, keywords in BLOOMS_TAXONOMY.items():
                    # If the verb is in the keywords list, increment the count for the level
                    if word in keywords: # match by dict
                        bloom_count[level] += 1
                        matched_by_dict = True
                
                if not matched_by_dict:
                    # match by AI
                    result = classifier(word, bloom_levels)
                    best_match = result['labels'][0]
                    # print(word, best_match)
                    bloom_count[best_match] += 1
        
    return bloom_count

# legacy version, use as backup in case match_clos fails
def match_clos_by_dict(clos):
    '''
    Matches extracted verbs to Bloom's Taxonomy levels.

    Inputs
    ------
    verbs : list of strings representing the extracted verbs.

    Outputs
    -------
    bloom_count : dictionary where keys are Bloom's levels and values are counts of matched verbs.
    '''
    # Initialise a dictionary to count matches for each Bloom's level
    bloom_count = {level: 0 for level in BLOOMS_TAXONOMY}

    # Iterate through the clos
    for clo in clos:
        # split to words
        words = extract_words_from_clo(clo)
        for word in words:
            # Check each Bloom's level
            for level, keywords in BLOOMS_TAXONOMY.items():
                # If the verb is in the keywords list, increment the count for the level
                if word in keywords:
                    bloom_count[level] += 1
                    # print("LEVEL: " + level + ", WORD: " + word + ", CLO: " + clo)
        
    return bloom_count

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