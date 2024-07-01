import classification_controller as classifier
from tests.helper import *


class TestClassifyCLOsFromPdf:
    def test_can_classify_clos_from_pdf(self):
        pdf_binaries = get_pdf_binaries()
        for i in range(len(VALID_PDFS)):
            extracted_clos = classifier.classify_clos_from_pdf(pdf_binaries[i])
            
            # We can't be for sure what the correct classification is.
            # Just check that the classification is valid and not empty.
            assert set(extracted_clos.keys()) == set(BLOOMS_LEVELS)
            assert any(extracted_clos.values())

# TODO: Add test cases
class TestMatchVerbsByAI:
    def test_match_verbs_by_ai(self):
        pass

class TestExtractWordsFromCLO:
    def test_can_extract_words_from_clo(self):
        clo1 = "Test CLO"
        clo2 = "We,., Should:!@:# ###Ignore### )(*&^%$#@!Symbols!!!!!"
        clo3 = "    Ignore       Unnecessary   Whitespaces"
        
        clo1_expected = ["test", "clo"]
        clo2_expected = ["we", "should", "ignore", "symbols"]
        clo3_expected = ["ignore", "unnecessary", "whitespaces"]
        
        assert classifier.extract_words_from_clo(clo1) == clo1_expected
        assert classifier.extract_words_from_clo(clo2) == clo2_expected
        assert classifier.extract_words_from_clo(clo3) == clo3_expected

class TestMatchCLOsByDict:
    def test_can_match_clos_by_dict(self):
        expected_clos = extract_test_clos()
        for i in range(len(CLOS_FILES)):
            classification = classifier.match_clos_by_dict(expected_clos[i])
            
            # We can't be for sure what the correct classification is.
            # Just check that the classification is valid and not empty.
            assert set(classification.keys()) == set(BLOOMS_LEVELS)
            assert any(classification.values())
