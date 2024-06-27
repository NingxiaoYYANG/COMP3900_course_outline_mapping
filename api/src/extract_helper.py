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

def course_details_from_pdf(file_data):
    '''
    Extracts the course code from a generated course outline pdf file.
    Inputs
    ------
    file_data : course outline file in pdf form
    Outputs
    -------
    dict in the form of:
    {
        "courseCode": string,
        "courseName": string,
        "courseLevel": string,
        "courseTerm": int
    }
    '''

    course_details = {
        "courseCode": "",
        "courseName": "",
        "courseLevel": "",
        "courseTerm": 0
    }

    reader = PdfReader(BytesIO(file_data))
    num_pages = len(reader.pages)

    # Course details are found on the title page
    page_text = reader.pages[0].extract_text()

    course_code = re.search("Course Code : .+", page_text)
    if course_code:
        # We want to extract the course code by itself.
        course_code = course_code.group(0)[len("Course Code :"):].strip()
        course_details["courseCode"] = course_code

    # The format of the header is as follows:
    # ===
    # UNSW Course Outline
    # {courseCode} {courseName} - {year}
    # Published on the {publishDate}
    # ...
    # ---
    # The title can span multiple lines, so we need to process this all as one line.
    # We start reading directly after "UNSW Course Outline {courseCode}"
    # Then stop reading at "Published on the"
    # And finally remove the hyphen and year at the end.
    page_line = page_text.replace('\n', ' ')
    # Remove duplicate whitespaces
    page_line = re.sub(' +', ' ', page_line)
    if page_line.startswith(f"UNSW Course Outline {course_code} "):
        course_name = page_line[len(f"UNSW Course Outline {course_code} "):]
        # We want everything before "Published on the"
        course_name = course_name.split(" Published on the")[0]
        # Remove the hyphen and year at the end.
        course_name = course_name[:-len(" - 2024")]
        course_details["courseName"] = course_name

    course_level = re.search("Study Level : .+", page_text)
    if course_level:
        course_level = course_level.group(0)[len("Study Level :"):].strip()
        if "Undergraduate" in course_level:
            course_details["courseLevel"] = "UG"
        elif "Postgraduate" in course_level:
            course_details["courseLevel"] = "PG"

    term = re.search("Term : .+", page_text)
    if term:
        term = term.group(0)[len("Term :"):].strip()
        # The term number would be the last character of the text.
        if "Term" in term:
            term = int(term[-1])
            course_details["courseTerm"] = term

    return course_details


if __name__ == "__main__":
    # Can replace with any pdf file for testing
    course_outline = "C:\\Users\\mbmas\\Desktop\\COMP3900\\capstone-project-3900f11adroptablestudents\\api\\tests\\testFiles\\ACCT2511-2024T1.pdf"
    # course_outline = "C:/Users/20991/Downloads/CO_COMP6771_1_2024_Term2_T2_Multimodal_Standard_Kensington.pdf"

    with open(course_outline, "rb") as f:
        print(course_details_from_pdf(f.read()))
