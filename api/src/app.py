#  imported libs
from apiflask import APIFlask
from flask import request, jsonify
from flask_cors import CORS  # Import CORS from flask_cors
import json

# imported files
from classification_controller import classify_clos_from_pdf, mergeBloomsCount, check_code_format, match_clos, initialize_classifier
from database import add_clos, get_clos, add_course_detail, get_all_course_details
from blooms_levels import BLOOMS_TAXONOMY
from extract_helper import course_details_from_pdf, get_coID_from_code, extract_clos_from_coID, course_details_from_coID

app = APIFlask(__name__, title='Successful Outcomes F11A', version = '0.1')
CORS(app)  # Apply CORS to your app

@app.before_request
def setup():
    initialize_classifier()

@app.get('/')
def index():
    return {'message': 'hello'}

@app.route('/api/upload_course_code', methods=["POST"])
def upload_course_outline_by_code():
    code = request.form['course_code']

    if not check_code_format(code):
        return "Invalid course code format", 400
    else:
        coID = get_coID_from_code(code)
        # print(coID + "!!!!!!!!!!!!!!!!!\n\n\n\n\n\n\n\n\n\n\n\n")
        clos = extract_clos_from_coID(coID)
        # print(clos)
        blooms_count = match_clos(clos)
        # print(blooms_count)
        course_details = course_details_from_coID(coID)
        # print(course_details)
        # return jsonify({'message': 'Success!'}), 200
        try:
            add_clos(course_details["course_code"], blooms_count["Remember"], blooms_count["Understand"], blooms_count["Apply"], blooms_count["Analyse"], blooms_count["Evaluate"], blooms_count["Create"])
            add_course_detail(course_details)
            return jsonify({'message': 'Success!'}), 200
        except Exception as e:
            print(e)
            return jsonify({'error': e}), 400
    

@app.route('/api/upload_pdf', methods=["POST"])
def upload_course_outline_pdf():
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
    course_details = course_details_from_pdf(file)

    try:
        add_clos(course_details["course_code"], blooms_count["Remember"], blooms_count["Understand"], blooms_count["Apply"], blooms_count["Analyse"], blooms_count["Evaluate"], blooms_count["Create"])
        add_course_detail(course_details)
        return jsonify({'message': 'Success!'}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': e}), 400

@app.route('/api/upload_exam', methods=['POST'])
def upload_exam():
    exam_contents = request.form['exam_contents']

    blooms_count = match_clos(exam_contents)
    
    #TO-DO
    return jsonify({'message': 'TODO!'}), 200

@app.route('/api/classify_clos', methods=['POST'])
def classify_learning_outcome_route():
    data = request.form
    # Python is treating array passed from frontend as string object
    course_codes_raw = data.get('course_codes')
    # Convert to python list
    course_codes = json.loads(course_codes_raw)
    
    result = {level: 0 for level in BLOOMS_TAXONOMY}

    for course_code in course_codes:
        blooms_count_additive = get_clos(course_code)
        print(blooms_count_additive)
        if blooms_count_additive:
            result = mergeBloomsCount(result, blooms_count_additive)
        else:
            return jsonify({'error': 'No related data, please upload pdf'}), 400
    print(result)
    return jsonify({'blooms_count': result})

@app.route('/api/courses', methods=['GET'])
def get_courses():
    course_details = get_all_course_details()
    print(course_details)

    # course_details format eg: [('COMP1521', 'Computer Systems Fundamentals', 'UG', '1')]
    return jsonify({'course_details': course_details})
    

if __name__ == '__main__':
    app.run(debug=True)