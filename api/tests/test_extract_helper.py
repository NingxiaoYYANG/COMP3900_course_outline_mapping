import unittest
from src.extract_helper import *
from tests.helper import *


class ExtractCLOsFromPdfTestCase(unittest.TestCase):
    def testCanExtractCLOFromPdf(self):
        expected_clos = extract_test_clos()
        
        pdf_binaries = get_pdf_binaries()
        for i in range(len(VALID_PDFS)):
            extracted_clos = extract_clos_from_pdf(pdf_binaries[i])
            self.assertListEqual(extracted_clos, expected_clos[i])

class CourseDetailsFromPdfTestCase(unittest.TestCase):
    def testCanExtractCourseDetailsFromPdf(self):
        pdf_binaries = get_pdf_binaries()
        course_details = course_details_from_pdf(pdf_binaries[0])
        
        self.assertEqual(course_details['courseCode'], 'ACCT2511')
        self.assertEqual(course_details['courseName'], 'Financial Accounting Fundamentals')
        self.assertEqual(course_details['courseLevel'], 'UG')
        self.assertEqual(course_details['courseTerm'], 1)