import pytest
import json
from tests.helper import extract_test_clos, get_pdf_binaries, VALID_PDFS, BLOOMS_LEVELS

client = 'localhost:5000'

def test_import_course_outline:
    response = client.post(
        "/api/import_course_outline",
        data=json.dumps({"course_outline": extract_test_clos()}),
    )