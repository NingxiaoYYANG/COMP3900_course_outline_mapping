import openai
import re

from src.extract_helper import extract_clos_from_pdf
from src.blooms_levels import BLOOMS_TAXONOMY

# import from database.py
from src.database import add_clos, get_clos

# Set up OpenAI API key
openai.api_key = 'secret-key'

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
    blooms_count = match_clos_by_dict(extracted_clos)

    course_code = "COMP1521" # TO-DO fix this with a real function

    # TO-DO: in what case do we need to use match_verbs_by_ai

    try:
        add_clos(course_code, blooms_count["Remember"], blooms_count["Understand"], blooms_count["Apply"], blooms_count["Analyse"], blooms_count["Evaluate"], blooms_count["Create"])
    except Exception as e:
        print(e)
        return False

    return blooms_count

# TO-FIX
def match_verbs_by_ai(learning_outcome):
    # Prompt for GPT-3
    prompt = f"Classify the learning outcome: '{learning_outcome}' into one of the Bloom's Taxonomy levels: Remember, Understand, Apply, Analyse, Evaluate, Create. Answer in one word"

    # Call OpenAI's GPT-3 API to generate text based on the prompt
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",  # Choose GPT-3 model
        messages=[
            {
                "role": "user",
                "content": prompt,
            },
        ],
        max_tokens=50,  # Adjust based on the desired length of the generated text
    )
    print(response)

    # Extract and return the generated text as the predicted label
    predicted_label = response.choices[0].message.content
    return predicted_label

def extract_words_from_clo(clo):
    # Split the sentence using the pattern
    words = re.split(pattern, clo)

    # Remove empty strings from the result
    words = [word.lower() for word in words if word]

    return words

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

    # Iterate through the verbs
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

if __name__ == "__main__":
    # Can replace with any pdf file for testing
    # course_outline = "C:/Users/mbmas/Downloads/CO_ACCT3202_1_2024_Term1_T1_InPerson_Standard_Kensington.pdf"
    # course_outline_file_path = "/Users/rbxii3/Downloads/CO_COMP1521_1_2024_Term1_T1_Multimodal_Standard_Kensington.pdf"
    # course_outline_file_path = "C:/Users/Justin_Yang/Downloads/CO_COMP1521_1_2024_Term1_T1_Multimodal_Standard_Kensington.pdf"

    # blooms_count = classify_clos_from_pdf(course_outline_file_path)

    result = get_clos("COMP1521") # TO-DO fix this with a real value
    # print (blooms_count)
    print(result)