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