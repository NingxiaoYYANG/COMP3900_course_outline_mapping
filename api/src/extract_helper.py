from pypdf import PdfReader
import re
import requests
import json

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
    Extracts course details from a generated course outline pdf file.
    
    Inputs
    ------
    file_data : course outline file in pdf form
    
    Outputs
    -------
    dict in the form of:
    {
        "course_code": string,
        "course_name": string,
        "course_level": string,
        "course_term": string,
        "faculty": string,
        "delivery_mode": string,
        "delivery_format": string,
        "delivery_location": string,
        "campus": string
    }
    '''

    course_details = {
        "course_code": "",
        "course_name": "",
        "course_level": "",
        "course_term": "",
        "faculty": "",
        "delivery_mode": "",
        "delivery_format": "",
        "delivery_location": "",
        "campus": ""
    }

    reader = PdfReader(file_data)

    # Course details are found on the title page
    page_text = reader.pages[0].extract_text()

    course_code = re.search("Course Code : .+", page_text)
    if course_code:
        # We want to extract the course code by itself.
        course_code = course_code.group(0)[len("Course Code :"):].strip()
        course_details["course_code"] = course_code

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
    year = ""
    if page_line.startswith(f"UNSW Course Outline {course_code} "):
        course_name = page_line[len(f"UNSW Course Outline {course_code} "):]
        # We want everything before "Published on the"
        course_name = course_name.split(" Published on the")[0]
        # Save the year in a variable for later.
        year = course_name[-2:]
        # Remove the hyphen and year at the end.
        course_name = course_name[:-len(" - 2024")]
        course_details["course_name"] = course_name

    course_level = re.search("Study Level : .+", page_text)
    if course_level:
        course_level = course_level.group(0)[len("Study Level :"):].strip()
        if "Undergraduate" in course_level:
            course_details["course_level"] = "UG"
        elif "Postgraduate" in course_level:
            course_details["course_level"] = "PG"

    term = re.search("Term : .+", page_text)
    if term:
        term = term.group(0)[len("Term :"):].strip()
        # The term number would be the last character of the text.
        # We also use the year that we saved from earlier.
        if "Term" in term and year:
            term = term[-1]
            course_details["course_term"] = f"{year}T{term}"

    faculty = re.search("Faculty : .+", page_text)
    if faculty:
        faculty = faculty.group(0)[len("Faculty :"):].strip()
        course_details["faculty"] = faculty

    delivery_mode = re.search("Delivery Mode : .+", page_text)
    if delivery_mode:
        delivery_mode = delivery_mode.group(0)[len("Delivery Mode :"):].strip()
        course_details["delivery_mode"] = delivery_mode

    delivery_format = re.search("Delivery Format : .+", page_text)
    if delivery_format:
        delivery_format = delivery_format.group(0)[len("Delivery Format :"):].strip()
        course_details["delivery_format"] = delivery_format

    delivery_location = re.search("Delivery Location : .+", page_text)
    if delivery_location:
        delivery_location = delivery_location.group(0)[len("Delivery Location :"):].strip()
        course_details["delivery_location"] = delivery_location

    campus = re.search("Campus : .+", page_text)
    if campus:
        campus = campus.group(0)[len("Campus :"):].strip()
        course_details["campus"] = campus

    return course_details

def get_coID_from_code(course_code):
    '''
    Gets the coID of the newest course outline of a course, 
    specified by its course code.
    
    Each individual course outline has its own coID. This is needed
    to get the information from the course outline later.

    Inputs
    ------
    course_code : course code as a string.

    Outputs
    -------
    coID : coID of the newest course outline as a string.
    '''
    TEACHING_PERIODS = ["U1", "T1", "T2", "T3", "Z1", "Z2", "KB", "KF", "KJ", "KN", "KR", "KV", "T1A", "T1B", "T1C", "T2A", "T2B", "T2C", "T3A", "T3B", "T3C", ]
    
    url = f"https://courseoutlines.unsw.edu.au/v1/publicsitecourseoutlines/search?year=2024&searchText={course_code}"
    
    r = requests.get(url)
    data = json.loads(r.text)["response"]["results"]
    
    latest_period = None
    coID = None
    
    # Only extract the coIDs which have a code that matches
    # exactly with the input course_code.
    for outline in data:
        if outline["integrat_coursecode"].lower() == course_code.lower():
            teaching_period = outline["integrat_teachingperiod"]
            outline_coID = outline["integrat_courseoutlineid"]
            if latest_period is None:
                latest_period = teaching_period
                coID = outline_coID
            # We want the newest coID, meaning the latest teaching period.
            elif TEACHING_PERIODS.index(teaching_period) > TEACHING_PERIODS.index(latest_period):
                latest_period = teaching_period
                coID = outline_coID
    
    return coID

def extract_clos_from_coID(coID):
    '''
    Extracts CLOs from a coID.

    Inputs
    ------
    coID : coID of the course outline as a string.

    Outputs
    -------
    clos : list containing every CLO stored as a string.
    '''
    
    url = f"https://courseoutlines.unsw.edu.au/v1/publicsitecourseoutlines/detail?coId={coID}"
    
    r = requests.get(url)
    data = json.loads(r.text)["integrat_CO_LearningOutcome"]

    clos = [clo["integrat_description"] for clo in data]
    
    return clos
 
def course_details_from_coID(coID):
    '''
    
    Extracts course details from a given coID.

    Inputs
    ------
    coID : coID of the course outline as a string.
    
    Outputs
    -------
    dict in the form of:
    {
        "course_code": string,
        "course_name": string,
        "course_level": string,
        "course_term": string,
        "faculty": string,
        "delivery_mode": string,
        "delivery_format": string,
        "delivery_location": string,
        "campus": string
    }
    '''
    
    url = f"https://courseoutlines.unsw.edu.au/v1/publicsitecourseoutlines/detail?coId={coID}"
    
    r = requests.get(url)
    data = json.loads(r.text)
    
    course_level = ""
    if data["integrat_career"] == "Undergraduate":
        course_level = "UG"
    elif data["integrat_career"] == "Postgraduate":
        course_level = "PG"
    
    course_details = {
        "course_code": data["integrat_coursecode"],
        "course_name": data["integrat_coursename"],
        "course_level": course_level,
        "course_term": "24"+data["integrat_teachingperiod"],
        "faculty": data["integrat_owningfaculty"],
        "delivery_mode": data["integrat_deliverymode"],
        "delivery_format": data["integrat_deliveryformat"],
        "delivery_location": data["integrat_location"],
        "campus": data["integrat_campus"]
    }
    
    return course_details


if __name__ == "__main__":
    # Can replace with any pdf file for testing
    course_outline = "C:\\Users\\mbmas\\Desktop\\COMP3900\\capstone-project-3900f11adroptablestudents\\api\\src\\tests\\testFiles\\ACCT2511-2024T1.pdf"
    # course_outline = "C:/Users/20991/Downloads/CO_COMP6771_1_2024_Term2_T2_Multimodal_Standard_Kensington.pdf"

    with open(course_outline, "rb") as f:
        print(course_details_from_pdf(f))
    
    psyc5001 = get_coID_from_code("psyc5001")
    print(psyc5001)
    
    print(extract_clos_from_coID(psyc5001))
    print(course_details_from_coID(psyc5001))
