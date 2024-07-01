import extract_helper
import tests.helper as test_helper

def test_can_extract_clo_from_pdf():
    expected_clos = test_helper.extract_test_clos()
    
    pdf_binaries = test_helper.get_pdf_binaries()
    for i in range(len(test_helper.VALID_PDFS)):
        extracted_clos = extract_helper.extract_clos_from_pdf(pdf_binaries[i])
        assert extracted_clos == expected_clos[i]


def test_can_extract_course_details_from_pdf():
    pdf_binaries = test_helper.get_pdf_binaries()
    course_details = extract_helper.course_details_from_pdf(pdf_binaries[0])
    
    assert course_details['course_code'] == 'ACCT2511'
    assert course_details['course_name'] == 'Financial Accounting Fundamentals'
    assert course_details['course_level'] == 'UG'
    assert course_details['course_term'] == '24T1'
