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
    # #region agent log
    import json as json_lib
    log_data = {'location': 'app.py:30', 'message': 'upload_course_code endpoint called', 'data': {'hasForm': 'form' in dir(request), 'formKeys': list(request.form.keys()) if 'form' in dir(request) else []}, 'timestamp': __import__('time').time() * 1000, 'sessionId': 'debug-session', 'runId': 'run1', 'hypothesisId': 'A'}
    with open(r'x:\Uni\COMP3900\capstone-project-3900f11adroptablestudents\.cursor\debug.log', 'a', encoding='utf-8') as f: f.write(json_lib.dumps(log_data) + '\n')
    # #endregion
    try:
        code = request.form['course_code']
        # #region agent log
        log_data = {'location': 'app.py:33', 'message': 'course_code extracted', 'data': {'code': code}, 'timestamp': __import__('time').time() * 1000, 'sessionId': 'debug-session', 'runId': 'run1', 'hypothesisId': 'A'}
        with open(r'x:\Uni\COMP3900\capstone-project-3900f11adroptablestudents\.cursor\debug.log', 'a', encoding='utf-8') as f: f.write(json_lib.dumps(log_data) + '\n')
        # #endregion
    except KeyError as e:
        # #region agent log
        log_data = {'location': 'app.py:35', 'message': 'KeyError getting course_code', 'data': {'error': str(e)}, 'timestamp': __import__('time').time() * 1000, 'sessionId': 'debug-session', 'runId': 'run1', 'hypothesisId': 'A'}
        with open(r'x:\Uni\COMP3900\capstone-project-3900f11adroptablestudents\.cursor\debug.log', 'a', encoding='utf-8') as f: f.write(json_lib.dumps(log_data) + '\n')
        # #endregion
        return jsonify({'error': 'course_code not found in request'}), 400

    if not check_code_format(code):
        return "Invalid course code format", 400
    else:
        try:
            coID = get_coID_from_code(code)
            # #region agent log
            log_data = {'location': 'app.py:40', 'message': 'coID retrieved', 'data': {'coID': coID}, 'timestamp': __import__('time').time() * 1000, 'sessionId': 'debug-session', 'runId': 'run1', 'hypothesisId': 'A'}
            with open(r'x:\Uni\COMP3900\capstone-project-3900f11adroptablestudents\.cursor\debug.log', 'a', encoding='utf-8') as f: f.write(json_lib.dumps(log_data) + '\n')
            # #endregion

            clos = extract_clos_from_coID(coID)
            # #region agent log
            log_data = {'location': 'app.py:60', 'message': 'CLOs extracted from coID', 'data': {'coID': coID, 'closCount': len(clos) if clos else 0, 'closIsEmpty': not clos or len(clos) == 0}, 'timestamp': __import__('time').time() * 1000, 'sessionId': 'debug-session', 'runId': 'run1', 'hypothesisId': 'A'}
            with open(r'x:\Uni\COMP3900\capstone-project-3900f11adroptablestudents\.cursor\debug.log', 'a', encoding='utf-8') as f: f.write(json_lib.dumps(log_data) + '\n')
            # #endregion
            blooms_count, word_to_blooms = match_clos(clos)
            # #region agent log
            log_data = {'location': 'app.py:64', 'message': 'match_clos completed', 'data': {'bloomsCount': blooms_count, 'wordToBloomsCount': len(word_to_blooms)}, 'timestamp': __import__('time').time() * 1000, 'sessionId': 'debug-session', 'runId': 'run1', 'hypothesisId': 'A'}
            with open(r'x:\Uni\COMP3900\capstone-project-3900f11adroptablestudents\.cursor\debug.log', 'a', encoding='utf-8') as f: f.write(json_lib.dumps(log_data) + '\n')
            # #endregion

            course_details = course_details_from_coID(coID)

            # Add extracted_clos and word_to_blooms to course_details
            course_details["course_clos"] = clos
            course_details["word_to_blooms"] = word_to_blooms

            try:
                if add_clos(course_details["course_code"], blooms_count) and add_course_detail(course_details):
                    # #region agent log
                    log_data = {'location': 'app.py:52', 'message': 'Successfully added course', 'data': {'course_code': course_details["course_code"]}, 'timestamp': __import__('time').time() * 1000, 'sessionId': 'debug-session', 'runId': 'run1', 'hypothesisId': 'A'}
                    with open(r'x:\Uni\COMP3900\capstone-project-3900f11adroptablestudents\.cursor\debug.log', 'a', encoding='utf-8') as f: f.write(json_lib.dumps(log_data) + '\n')
                    # #endregion
                    return jsonify({'course_details': course_details}), 200
                else:
                    # #region agent log
                    log_data = {'location': 'app.py:55', 'message': 'Database Error', 'data': {}, 'timestamp': __import__('time').time() * 1000, 'sessionId': 'debug-session', 'runId': 'run1', 'hypothesisId': 'A'}
                    with open(r'x:\Uni\COMP3900\capstone-project-3900f11adroptablestudents\.cursor\debug.log', 'a', encoding='utf-8') as f: f.write(json_lib.dumps(log_data) + '\n')
                    # #endregion
                    return jsonify({'message': 'Database Error!'}), 400
            except Exception as e:
                # #region agent log
                log_data = {'location': 'app.py:58', 'message': 'Exception in database operation', 'data': {'error': str(e), 'errorType': type(e).__name__}, 'timestamp': __import__('time').time() * 1000, 'sessionId': 'debug-session', 'runId': 'run1', 'hypothesisId': 'A'}
                with open(r'x:\Uni\COMP3900\capstone-project-3900f11adroptablestudents\.cursor\debug.log', 'a', encoding='utf-8') as f: f.write(json_lib.dumps(log_data) + '\n')
                # #endregion
                print(e)
                return jsonify({'error': str(e)}), 409
        except Exception as e:
            # #region agent log
            log_data = {'location': 'app.py:62', 'message': 'Exception in processing course code', 'data': {'error': str(e), 'errorType': type(e).__name__}, 'timestamp': __import__('time').time() * 1000, 'sessionId': 'debug-session', 'runId': 'run1', 'hypothesisId': 'A'}
            with open(r'x:\Uni\COMP3900\capstone-project-3900f11adroptablestudents\.cursor\debug.log', 'a', encoding='utf-8') as f: f.write(json_lib.dumps(log_data) + '\n')
            # #endregion
            print(e)
            return jsonify({'error': str(e)}), 500 
    

@app.route('/api/upload_pdf', methods=["POST"])
def upload_course_outline_pdf():
    # #region agent log
    import json as json_lib
    log_data = {'location': 'app.py:58', 'message': 'upload_pdf endpoint called', 'data': {'hasFiles': 'files' in dir(request), 'fileKeys': list(request.files.keys()) if 'files' in dir(request) else []}, 'timestamp': __import__('time').time() * 1000, 'sessionId': 'debug-session', 'runId': 'run1', 'hypothesisId': 'B'}
    with open(r'x:\Uni\COMP3900\capstone-project-3900f11adroptablestudents\.cursor\debug.log', 'a', encoding='utf-8') as f: f.write(json_lib.dumps(log_data) + '\n')
    # #endregion
    if 'file' not in request.files:
        # #region agent log
        log_data = {'location': 'app.py:60', 'message': 'No file in request', 'data': {}, 'timestamp': __import__('time').time() * 1000, 'sessionId': 'debug-session', 'runId': 'run1', 'hypothesisId': 'B'}
        with open(r'x:\Uni\COMP3900\capstone-project-3900f11adroptablestudents\.cursor\debug.log', 'a', encoding='utf-8') as f: f.write(json_lib.dumps(log_data) + '\n')
        # #endregion
        return jsonify({'error': 'No file or url provided'}), 400
    file = request.files['file']
    # #region agent log
    log_data = {'location': 'app.py:63', 'message': 'File extracted', 'data': {'filename': file.filename if file else None}, 'timestamp': __import__('time').time() * 1000, 'sessionId': 'debug-session', 'runId': 'run1', 'hypothesisId': 'B'}
    with open(r'x:\Uni\COMP3900\capstone-project-3900f11adroptablestudents\.cursor\debug.log', 'a', encoding='utf-8') as f: f.write(json_lib.dumps(log_data) + '\n')
    # #endregion

    # check if selected
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    #check file format
    if not (file and file.filename.endswith('.pdf')):
        return jsonify({'error': 'Invalid file format'}), 400
    
    try:
        blooms_count, extracted_clos, word_to_blooms = classify_clos_from_pdf(file)
        course_details = course_details_from_pdf(file)

        # Add extracted_clos and word_to_blooms to course_details
        course_details["course_clos"] = extracted_clos
        course_details["word_to_blooms"] = word_to_blooms

        try:
            if add_clos(course_details["course_code"], blooms_count) and add_course_detail(course_details):
                # #region agent log
                log_data = {'location': 'app.py:81', 'message': 'Successfully added course from PDF', 'data': {'course_code': course_details.get("course_code")}, 'timestamp': __import__('time').time() * 1000, 'sessionId': 'debug-session', 'runId': 'run1', 'hypothesisId': 'B'}
                with open(r'x:\Uni\COMP3900\capstone-project-3900f11adroptablestudents\.cursor\debug.log', 'a', encoding='utf-8') as f: f.write(json_lib.dumps(log_data) + '\n')
                # #endregion
                return jsonify({'course_details': course_details}), 200
            else:
                # #region agent log
                log_data = {'location': 'app.py:84', 'message': 'Database Error in PDF upload', 'data': {}, 'timestamp': __import__('time').time() * 1000, 'sessionId': 'debug-session', 'runId': 'run1', 'hypothesisId': 'B'}
                with open(r'x:\Uni\COMP3900\capstone-project-3900f11adroptablestudents\.cursor\debug.log', 'a', encoding='utf-8') as f: f.write(json_lib.dumps(log_data) + '\n')
                # #endregion
                return jsonify({'message': 'Database Error!'}), 400
        except Exception as e:
            # #region agent log
            log_data = {'location': 'app.py:87', 'message': 'Exception in database operation PDF', 'data': {'error': str(e), 'errorType': type(e).__name__}, 'timestamp': __import__('time').time() * 1000, 'sessionId': 'debug-session', 'runId': 'run1', 'hypothesisId': 'B'}
            with open(r'x:\Uni\COMP3900\capstone-project-3900f11adroptablestudents\.cursor\debug.log', 'a', encoding='utf-8') as f: f.write(json_lib.dumps(log_data) + '\n')
            # #endregion
            print(e)
            return jsonify({'error': str(e), 'course_code': course_details.get("course_code")}), 409
    except Exception as e:
        # #region agent log
        log_data = {'location': 'app.py:90', 'message': 'Exception in PDF processing', 'data': {'error': str(e), 'errorType': type(e).__name__}, 'timestamp': __import__('time').time() * 1000, 'sessionId': 'debug-session', 'runId': 'run1', 'hypothesisId': 'B'}
        with open(r'x:\Uni\COMP3900\capstone-project-3900f11adroptablestudents\.cursor\debug.log', 'a', encoding='utf-8') as f: f.write(json_lib.dumps(log_data) + '\n')
        # #endregion
        print(e)
        return jsonify({'error': str(e)}), 500 

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
###                     "blooms_count": {}
###               },
###               "COMP6080": {
###                     "clos": ["clo1", "clo2"], 
###                     "word_to_blooms": {"verb1": "Remember", "verb2": "Create"}
###                     "blooms_count": {}
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
            course_code: {"clos":[], "word_to_blooms": {}, "blooms_count": {}} for course_code in course_codes
        }
    }    

    blooms_count_sum = {level: 0 for level in BLOOMS_TAXONOMY}
    for course_code in course_codes:
        blooms_count_additive = get_clos(course_code)
        course_detail = get_course_detail(course_code)

        # Add clos and word_to_blooms into courses_info
        result["courses_info"][course_code]["clos"] = course_detail["course_clos"]
        result["courses_info"][course_code]["word_to_blooms"] = course_detail["word_to_blooms"]
        result["courses_info"][course_code]["blooms_count"] = blooms_count_additive


        if blooms_count_additive:
            blooms_count_sum = mergeBloomsCount(blooms_count_sum, blooms_count_additive)
        else:
            return jsonify({'error': 'No related data, please upload pdf'}), 400
    
    # Add blooms_count_sum to result
    result["blooms_count"] = blooms_count_sum
    
    return jsonify({'classify_results': result})

@app.route('/api/courses', methods=['GET'])
def get_courses():
    course_details = get_all_course_details()

    return jsonify({'course_details': course_details})

@app.route('/api/delete_course', methods=['DELETE'])
def delete_course_api():
    data = request.get_json()
    course_code = data.get('course_code')

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
    import os
    # Use port 5000 for Docker, 5001 for local development
    port = int(os.getenv('PORT', '5000'))
    app.run(host="0.0.0.0", port=port, debug=True)