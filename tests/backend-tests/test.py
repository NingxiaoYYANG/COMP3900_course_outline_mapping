import pytest
import requests

def test_basic_endpoint():
    response = requests.post("http://localhost:5000")
    assert response.status_code == 200
    assert response.json() == {'message': 'hello'}

def test_upload_outline_pdf():
    response = requests.post("http://localhost:5000/api/upload_pdf", files={'file': open('tests/testFiles/COMP1521-2024T2.pdf', 'rb')})

    assert response.status_code == 200
    assert response.json() == {'message': 'Success!'}

def test_upload_outline_pdf_invalid():
    response = requests.post("http://localhost:5000/api/upload_pdf", files={'file': open('tests/testFiles/invalid.pdf', 'rb')})

    assert response.status_code == 400
    assert response.json() == {'error': 'Invalid file format'}

def test_upload_outline_pdf_no_file():
    response = requests.post("http://localhost:5000/api/upload_pdf")

    assert response.status_code == 400
    assert response.json() == {'error': 'No file or url provided'}

def test_upload_outline_pdf_no_selected_file():
    response = requests.post("http://localhost:5000/api/upload_pdf", files={'file': ''})

    assert response.status_code == 400
    assert response.json() == {'error': 'No selected file'}

def test_upload_incorrect_format():
    response = requests.post("http://localhost:5000/api/upload_pdf", files={'file': open('tests/testFiles/ACCT2511-2024T1.txt', 'rb')})

    assert response.status_code == 400
    assert response.json() == {'error': 'Invalid file format'}

def test_classify_clos():
    response = requests.post("http://localhost:5000/api/classify_clos", data={'course_codes': '["ACCT2511"]'})

    assert response.status_code == 200
    assert response.json() == {'blooms_count': {'Remember': 0, 'Understand': 0, 'Apply': 0, 'Analyse': 0, 'Evaluate': 0, 'Create': 0}}