#  imported libs
from apiflask import APIFlask
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS from flask_cors
import json
import mysql.connector as database

# imported files
from classification_controller import classify_clos_from_pdf, addBloomsCount
from database import upload_pdf, get_pdf, add_clos, get_clos
from blooms_levels import BLOOMS_TAXONOMY

app = APIFlask(__name__, title='Successful Outcomes F11A', version = '0.1')
CORS(app)  # Apply CORS to your app

@app.get('/')
def index():
    return {'message': 'hello'}

@app.route('/api/upload_pdf', methods=["POST"])
def upload_course_outline_pdf():
    data = request.form
    course_code = data.get('course_code')
    

    if 'file' not in request.files:
        return jsonify({'error': 'No file or url provided'}), 400
    file = request.files['file']
    print(file)

    # check if selected
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    #check file format
    if not (file and file.filename.endswith('.pdf')):
        return jsonify({'error': 'Invalid file format'}), 400
    
    if upload_pdf(course_code, file):
        return 'Success!', 200

@app.route('/api/classify_clos', methods=['POST'])
def classify_learning_outcome_route():
    data = request.form
    course_codes_raw = data.get('course_codes')
    course_codes = json.loads(course_codes_raw)

    result = {level: 0 for level in BLOOMS_TAXONOMY}

    for course_code in course_codes:
        # Try get it without proccessing pdf
        blooms_count_additive = get_clos(course_code)

        if blooms_count_additive:
            print(course_code)
            result = addBloomsCount(result, blooms_count_additive)
            continue

        # Processing pdf to classify clos
        file_data = get_pdf(course_code)

        if file_data == None:
            return jsonify({'error': 'No related data, please upload pdf'}), 400
        blooms_count_additive = classify_clos_from_pdf(file_data)

        try:
            add_clos(course_code, blooms_count_additive["Remember"], blooms_count_additive["Understand"], blooms_count_additive["Apply"], blooms_count_additive["Analyse"], blooms_count_additive["Evaluate"], blooms_count_additive["Create"])
        except Exception as e:
            print(e)
            return False
        
        result = addBloomsCount(result, blooms_count_additive)

    return jsonify({'blooms_count': result})

if __name__ == '__main__':
    app.run(debug=True)