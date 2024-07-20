#  imported libs
import re
from apiflask import APIFlask
from flask import request, jsonify
from flask_cors import CORS  # Import CORS from flask_cors
import json

# imported files
from classification_controller import classify_clos_from_pdf, mergeBloomsCount, check_code_format, match_clos, initialize_classifier
from database import add_clos, get_clos, add_course_detail, get_all_course_details, get_course_detail, delete_course  
from blooms_levels import BLOOMS_TAXONOMY
from extract_helper import course_details_from_pdf, get_coID_from_code, extract_clos_from_coID, course_details_from_coID

app = APIFlask(__name__, title='Successful Outcomes F11A', version = '0.1')
CORS(app)  # Apply CORS to your app

classifier_initialized = False

@app.before_request
def setup():
    global classifier_initialized
    if not classifier_initialized:
        initialize_classifier()
        classifier_initialized = True

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
        # print(coID)
        clos = extract_clos_from_coID(coID)
        # print(clos)
        blooms_count, word_to_blooms = match_clos(clos)
        # print(blooms_count)
        course_details = course_details_from_coID(coID)

        # Add extracted_clos and word_to_blooms to course_details
        course_details["course_clos"] = clos
        course_details["word_to_blooms"] = word_to_blooms
        # print(course_details)
        try:
            if add_clos(course_details["course_code"], blooms_count) and add_course_detail(course_details):
                return jsonify({'message': 'Success!'}), 200
            else:
                return jsonify({'message': 'Database Error!'}), 400
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
    
    blooms_count, extracted_clos, word_to_blooms = classify_clos_from_pdf(file)
    course_details = course_details_from_pdf(file)

    # Add extracted_clos and word_to_blooms to course_details
    course_details["course_clos"] = extracted_clos
    course_details["word_to_blooms"] = word_to_blooms

    try:
        if add_clos(course_details["course_code"], blooms_count) and add_course_detail(course_details):
                return jsonify({'message': 'Success!'}), 200
        else:
            return jsonify({'message': 'Database Error!'}), 400
    except Exception as e:
        print(e)
        return jsonify({'error': e}), 400

@app.route('/api/upload_exam', methods=['POST'])
def upload_exam():
    exam_contents = request.form['exam_contents']

    # Split exam contents into individual questions based on numbering
    pattern = r'\d+\.\s+'
    exam_questions = re.split(pattern, exam_contents)
    
    # Filter out any empty strings resulting from the split
    exam_questions = [q for q in exam_questions if q.strip()]

    blooms_count, word_to_blooms = match_clos(exam_questions)
    
    return jsonify({'blooms_count': blooms_count, 'word_to_blooms': word_to_blooms}), 200


### classify_results = {
###     "blooms_count": {}
###     "courses_info":
###         {
###               "COMP3900": {
###                     "clos": ["clo1", "clo2"], 
###                     "word_to_blooms": {"verb1": "Remember", "verb2": "Create"}
###               },
###               "COMP6080": {
###                     "clos": ["clo1", "clo2"], 
###                     "word_to_blooms": {"verb1": "Remember", "verb2": "Create"}
###               }  
###         }            
### }
@app.route('/api/classify_clos', methods=['POST'])
def classify_learning_outcome_route():
    data = request.form
    # Python is treating array passed from frontend as string object
    course_codes_raw = data.get('course_codes')
    # Convert to python list
    course_codes = json.loads(course_codes_raw)
    
    result = {
        "blooms_count": {level: 0 for level in BLOOMS_TAXONOMY},
        "courses_info": {
            course_code: {"clos":[], "word_to_blooms": {}} for course_code in course_codes
        }
    }    

    blooms_count_sum = {level: 0 for level in BLOOMS_TAXONOMY}
    for course_code in course_codes:
        blooms_count_additive = get_clos(course_code)
        course_detail = get_course_detail(course_code)

        # Add clos and word_to_blooms into courses_info
        result["courses_info"][course_code]["clos"] = course_detail["course_clos"]
        result["courses_info"][course_code]["word_to_blooms"] = course_detail["word_to_blooms"]

        # print(blooms_count_additive)
        if blooms_count_additive:
            blooms_count_sum = mergeBloomsCount(blooms_count_sum, blooms_count_additive)
        else:
            return jsonify({'error': 'No related data, please upload pdf'}), 400
    
    # Add blooms_count_sum to result
    result["blooms_count"] = blooms_count_sum

    # print(result)
    
    return jsonify({'classify_results': result})

@app.route('/api/courses', methods=['GET'])
def get_courses():
    course_details = get_all_course_details()
    # print(course_details)

    return jsonify({'course_details': course_details})

@app.route('/api/delete_course', methods=['DELETE'])
def delete_course_api():
    data = request.get_json()
    course_code = data.get('course_code')
    print(course_code)

    if not course_code or not check_code_format(course_code):
        return jsonify({'error': 'Invalid course code format'}), 400

    try:
        if delete_course(course_code):
            return jsonify({'message': 'Course deleted successfully'}), 200
        else:
            return jsonify({'error': 'Failed to delete course'}), 400
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500
    

if __name__ == '__main__':
    app.run(port=5000, debug=True)