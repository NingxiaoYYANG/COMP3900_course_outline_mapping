import unittest
from src.extract_helper import *
from tests.helper import *


class ExtractCLOsFromPdfTestCase(unittest.TestCase):
    def testCanExtractCLOFromPdf(self):
        expected_clos = extract_test_clos()
        
        for i in range(len(VALID_PDFS)):
            extracted_clos = extract_clos_from_pdf(VALID_PDFS[i])
            self.assertListEqual(extracted_clos, expected_clos[i])

class CourseCodeFromPdfTestCase(unittest.TestCase):
    def testCanExtractCourseCodeFromPdf(self):
        for i in range(len(VALID_PDFS)):
            course_code = course_code_from_pdf(VALID_PDFS[i])
            self.assertEqual(course_code, COURSE_CODES[i])

    def testThrowErrorForInvalidPdf(self):
        for i in range(len(INVALID_PDFS)):
            self.assertRaises(ValueError, course_code_from_pdf, INVALID_PDFS[i])

# TODO: Fix up test cases once function has been written.
class ExtractCLOsFromURLTestCase(unittest.TestCase):
    def testCanExtractCLOFromURL(self):
        expected_clos = extract_test_clos()
        
        for i in range(len(VALID_PDFS)):
            extracted_clos = extract_clos_from_url(COURSE_CODES[i])
            self.assertListEqual(extracted_clos, expected_clos[i])