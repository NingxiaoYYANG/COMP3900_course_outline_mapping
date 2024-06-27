from pypdf import PdfReader
import re
from io import BytesIO

def extract_clos_from_pdf(file_data):
    '''
    Extracts CLOs from a generated course outline pdf file.

    Inputs
    ------
    file_data : binary data of the course outline file in pdf form

    Outputs
    -------
    clos : list containing every CLO stored as a string.
    '''
    
    reader = PdfReader(file_data)
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
                    
                    # Sometimes the CLO has the header of the next table
                    # which is always "Course Learning Outcomes"
                    # This shouldn't be part of the CLO text.
                    clo = clo.split("Course Learning Outcomes")[0]
                    
                    clo = clo.replace('\n', '')
                    
                    # Remove number and colon from beginning
                    clo = " ".join(clo.split()[2:]) 
                    clos.append(clo)

    return clos


if __name__ == "__main__":
    # Can replace with any pdf file for testing
    # course_outline = "C:/Users/mbmas/Downloads/CO_ACCT3202_1_2024_Term1_T1_InPerson_Standard_Kensington.pdf"
    course_outline = "C:/Users/20991/Downloads/CO_COMP6771_1_2024_Term2_T2_Multimodal_Standard_Kensington.pdf"

    clos = extract_clos_from_pdf(course_outline)
