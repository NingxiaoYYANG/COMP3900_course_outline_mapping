from pypdf import PdfReader
import re
import spacy

# Load the spaCy English model
nlp = spacy.load("en_core_web_sm")

def extract_clos_from_pdf(course_outline_file):
    '''
    Extracts CLOs from a generated course outline pdf file.

    Inputs
    ------
    course_outline_file : course outline file in pdf form

    Outputs
    -------
    clos : list containing every CLO stored as a string.
    '''
    
    reader = PdfReader(course_outline_file)
    num_pages = len(reader.pages)

    clo_pages = []
    for page_num in range(num_pages):
        page_text = reader.pages[page_num].extract_text()
        # We are only interested in pages with
        # the header "Course Learning Outcomes"
        if page_text.startswith("Course Learning Outcomes"):
            clo_pages.append(page_num)

    clo_numbers_found = set([])
    clos = []
    for page_num in clo_pages:
        page_text = reader.pages[page_num].extract_text()
        
        # Every CLO starts with "CLOx : ", where x is the CLO number
        lines = page_text.split("CLO")
        for line in lines:
            if re.search("[0-9]+ : ", line):
                # After splitting the lines by the string "CLO",
                # the line should start with the CLO number
                clo_number = line.split()[0]
                
                # Ensuring that we only save each CLO once
                if clo_number not in clo_numbers_found:
                    clo_numbers_found.add(clo_number)
                    
                    # Dot point indicates the end of the CLO text
                    # as it means a new dot point is starting
                    clo = line.split("•")[0]
                    clo = clo.replace('\n', '')
                    
                    # Remove number and colon from beginning
                    clo = " ".join(clo.split()[2:]) 
                    clos.append(clo)

    return clos

def extract_clos_from_url(url):
    #TO-DO
    return

if __name__ == "__main__":
    # Can replace with any pdf file for testing
    # course_outline = "C:/Users/mbmas/Downloads/CO_ACCT3202_1_2024_Term1_T1_InPerson_Standard_Kensington.pdf"
    course_outline = "C:/Users/20991/Downloads/CO_COMP6771_1_2024_Term2_T2_Multimodal_Standard_Kensington.pdf"

    clos = extract_clos_from_pdf(course_outline)
