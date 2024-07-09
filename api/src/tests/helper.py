import io

VALID_PDFS = [
    "./src/tests/testFiles/ACCT2511-2024T1.pdf",
    "./src/tests/testFiles/CDEV2000-2024summer.pdf",
    "./src/tests/testFiles/COMP1521-2024T2.pdf",
]

CLOS_FILES = [
    "./src/tests/testFiles/ACCT2511-2024T1-clos.txt",
    "./src/tests/testFiles/CDEV2000-2024summer-clos.txt",
    "./src/tests/testFiles/COMP1521-2024T2-clos.txt",
]

COURSE_CODES = [
    "ACCT2511",
    "CDEV2000",
    "COMP1521",
]

INVALID_PDFS = [
    "./src/tests/testFiles/invalid.pdf",
]

BLOOMS_LEVELS = [
    "Remember",
    "Understand",
    "Apply",
    "Analyse",
    "Evaluate",
    "Create",
]


def extract_test_clos():
    """
    Extracts CLOs from the CLO test files.
    """
    clo_list = []
    for clo_file in CLOS_FILES:
        with open(clo_file) as f:
            clos = [line.rstrip() for line in f.readlines()]
            clo_list.append(clos)
    
    return clo_list

def get_pdf_binaries():
    """
    Returns the binary of each test pdf.
    """
    pdfs = []
    for pdf_path in VALID_PDFS:
        with open(pdf_path, mode='rb') as f:
            pdfs.append(io.BytesIO(f.read()))
    return pdfs
