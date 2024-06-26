import unittest
from src.classification_controller import *
from tests.helper import *


class ClassifyCLOsFromPdfTestCase(unittest.TestCase):
    def testCanClassifyCLOsFromPdf(self):
        for i in range(len(VALID_PDFS)):
            classification = classify_clos_from_pdf(VALID_PDFS[i])
            
            # We can't be for sure what the correct classification is.
            # Just check that the classification is valid and not empty.
            self.assertCountEqual(classification.keys(), BLOOMS_LEVELS)
            self.assertTrue(any(classification.values()))

# TODO: Add test cases
class MatchVerbsByAITestCase(unittest.TestCase):
    def testMatchVerbsByAI(self):
        pass

class ExtractWordsFromCLOTestCase(unittest.TestCase):
    def testCanExtractWordsFromCLO(self):
        clo1 = "Test CLO"
        clo2 = "We,., Should:!@:# ###Ignore### )(*&^%$#@!Symbols!!!!!"
        clo3 = "    Ignore       Unnecessary   Whitespaces"
        
        clo1_expected = ["test", "clo"]
        clo2_expected = ["we", "should", "ignore", "symbols"]
        clo3_expected = ["ignore", "unnecessary", "whitespaces"]
        
        self.assertListEqual(clo1_expected, extract_words_from_clo(clo1))
        self.assertListEqual(clo2_expected, extract_words_from_clo(clo2))
        self.assertListEqual(clo3_expected, extract_words_from_clo(clo3))

class MatchCLOsByDictTestCase(unittest.TestCase):
    def testCanMatchCLOsByDict(self):
        expected_clos = extract_test_clos()
        for i in range(len(CLOS_FILES)):
            classification = match_clos_by_dict(expected_clos[i])
            
            # We can't be for sure what the correct classification is.
            # Just check that the classification is valid and not empty.
            self.assertCountEqual(classification.keys(), BLOOMS_LEVELS)
            self.assertTrue(any(classification.values()))
