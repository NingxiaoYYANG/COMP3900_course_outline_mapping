import extract_helper
import tests.helper as test_helper
import requests
import json

class TestExtractCLOsFromPdf:
    def test_can_extract_clo_from_pdf(self):
        expected_clos = test_helper.extract_test_clos()
        
        pdf_binaries = test_helper.get_pdf_binaries()
        for i in range(len(test_helper.VALID_PDFS)):
            extracted_clos = extract_helper.extract_clos_from_pdf(pdf_binaries[i])
            assert extracted_clos == expected_clos[i]


class TestExtractCourseDetailsFromPdf:
    def test_can_extract_course_details_from_pdf(self):
        pdf_binaries = test_helper.get_pdf_binaries()
        course_details = extract_helper.course_details_from_pdf(pdf_binaries[0])
        
        assert course_details['course_code'] == 'ACCT2511'
        assert course_details['course_name'] == 'Financial Accounting Fundamentals'
        assert course_details['course_level'] == 'UG'
        assert course_details['course_term'] == '24T1'
        assert course_details['faculty'] == 'UNSW Business School'
        assert course_details['delivery_mode'] == 'In Person'
        assert course_details['delivery_format'] == 'Standard'
        assert course_details['delivery_location'] == 'Kensington'
        assert course_details['campus'] == 'Sydney'


class TestGetCoIDFromCourseCode:
    def test_can_get_coID_from_code(self):
        coID = extract_helper.get_coID_from_code("acct2511")
        
        url = f"https://courseoutlines.unsw.edu.au/v1/publicsitecourseoutlines/detail?coId={coID}"
        
        r = requests.get(url)
        data = json.loads(r.text)
        
        assert data["integrat_coursename"] == 'Financial Accounting Fundamentals'


class TestExtractCLOsFromCoID:
    def test_can_extract_clos_from_coID(self):
        coID = extract_helper.get_coID_from_code("acct2511")
        extracted_clos = extract_helper.extract_clos_from_coID(coID)
        expected_clos = test_helper.extract_test_clos()[0]
        
        assert extracted_clos == expected_clos


class TestExtractCourseDetailsFromCoID:
    def test_can_extract_course_details_from_coID(self):
        coID = extract_helper.get_coID_from_code("acct2511")
        course_details = extract_helper.course_details_from_coID(coID)
        
        assert course_details['course_code'] == 'ACCT2511'
        assert course_details['course_name'] == 'Financial Accounting Fundamentals'
        assert course_details['course_level'] == 'UG'
        assert course_details['course_term'] # Newest course outline is pulled, so this can change value depending on time tested.
        assert course_details['faculty'] == 'UNSW Business School'
        assert course_details['delivery_mode'] == 'In Person'
        assert course_details['delivery_format'] == 'Standard'
        assert course_details['delivery_location'] == 'Kensington'
        assert course_details['campus'] == 'Sydney'
