import classification_controller as classifier
from tests.helper import get_pdf_binaries, extract_test_clos, get_exam_questions, CLOS_FILES, VALID_PDFS, BLOOMS_LEVELS

class TestClassifyCLOsFromPdf:
    @classmethod
    def setup_class(cls):
        classifier.initialize_classifier()
    
    def test_can_classify_clos_from_pdf(self):
        pdf_binaries = get_pdf_binaries()
        for i in range(len(VALID_PDFS)):
            blooms_count, extracted_clos, word_to_blooms = classifier.classify_clos_from_pdf(pdf_binaries[i])
            
            # We can't be for sure what the correct classification is.
            # Just check that the classification is valid and not empty.
            assert set(blooms_count.keys()) == set(BLOOMS_LEVELS)
            assert any(blooms_count.values())

            # Can imporve test logic here with exact clos from each PDF
            assert any(extracted_clos)
            assert any(word_to_blooms)


class TestMatchCLOs:
    def test_can_match_clos(self):
        expected_clos = extract_test_clos()
        for i in range(len(CLOS_FILES)):
            classification = classifier.match_clos(expected_clos[i])
            
            # We can't be for sure what the correct classification is.
            # Just check that the classification is valid and not empty.
            assert set(classification.keys()) == set(BLOOMS_LEVELS)
            assert any(classification.values())


class TestCheckVerbs:
    def test_can_identify_verbs(self):
        assert classifier.check_is_verb("identify", "VB")
    
    def test_can_identify_known_verbs(self):
        assert classifier.check_is_verb("construct", "NULL")
        assert classifier.check_is_verb("analyze", "NULL")
        assert classifier.check_is_verb("create", "NULL")
    
    def test_can_identify_nonverbs(self):
        assert not classifier.check_is_verb("fakeverb", "NULL")


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


class TestMergeBloomsCount:
    def test_can_merge_blooms_count(self):
        count1 = {"Analyse": 1, "Apply": 2, "Create": 4, "Evaluate": 3, "Remember": 3, "Understand": 6}
        count2 = {"Analyse": 5, "Apply": 4, "Create": 1, "Evaluate": 1, "Remember": 2, "Understand": 0}
        merged1 = {"Analyse": 6, "Apply": 6, "Create": 5, "Evaluate": 4, "Remember": 5, "Understand": 6}
        
        assert classifier.mergeBloomsCount(count1, count2) == merged1
        
        count3 = {"Analyse": 0, "Apply": 0, "Create": 0, "Evaluate": 0, "Remember": 0, "Understand": 0}
        count4 = {"Analyse": 0, "Apply": 0, "Create": 0, "Evaluate": 0, "Remember": 0, "Understand": 0}
        merged2 = {"Analyse": 0, "Apply": 0, "Create": 0, "Evaluate": 0, "Remember": 0, "Understand": 0}
        
        assert classifier.mergeBloomsCount(count3, count4) == merged2


class TestCheckCodeFormat:
    def test_can_check_correct_formats(self):
        assert classifier.check_code_format('COMP3900')
        assert classifier.check_code_format('comp3900')
        assert classifier.check_code_format('aBcD0000')
        assert classifier.check_code_format('ZZZZ9999')
        assert classifier.check_code_format('aaaa0909')
    
    def test_can_check_incorrect_formats(self):
        assert not classifier.check_code_format('COMP3900!')
        assert not classifier.check_code_format('COMP390')
        assert not classifier.check_code_format('COMP.3900')
        assert not classifier.check_code_format('abc1234')
        assert not classifier.check_code_format('COMP39000')
        assert not classifier.check_code_format('abcde3900')
        assert not classifier.check_code_format('!COMP3900')
