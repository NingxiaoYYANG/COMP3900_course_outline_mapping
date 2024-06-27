#  imported libs
from apiflask import APIFlask
from flask import request, jsonify
from flask_cors import CORS  # Import CORS from flask_cors
import json

# imported files
from classification_controller import classify_clos_from_pdf, addBloomsCount
from database import add_clos, get_clos
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

    # check if selected
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    #check file format
    if not (file and file.filename.endswith('.pdf')):
        return jsonify({'error': 'Invalid file format'}), 400
    
    blooms_count = classify_clos_from_pdf(file)

    try:
        add_clos(course_code, blooms_count["Remember"], blooms_count["Understand"], blooms_count["Apply"], blooms_count["Analyse"], blooms_count["Evaluate"], blooms_count["Create"])
        return jsonify({'message': 'Success!'}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': e}), 400

@app.route('/api/classify_clos', methods=['POST'])
def classify_learning_outcome_route():
    data = request.form
    course_codes_raw = data.get('course_codes')
    course_codes = json.loads(course_codes_raw)

    result = {level: 0 for level in BLOOMS_TAXONOMY}

    for course_code in course_codes:
        blooms_count_additive = get_clos(course_code)

        if blooms_count_additive:
            print(course_code)
            result = addBloomsCount(result, blooms_count_additive)
        else:
            return jsonify({'error': 'No related data, please upload pdf'}), 400
        
        result = addBloomsCount(result, blooms_count_additive)

    return jsonify({'blooms_count': result})

# @app.route('/api/courses', methods=['GET'])
# def get_courses():

#     course_info = 
#     return jsonify({'course_codes': course_codes})



if __name__ == '__main__':
    app.run(debug=True)