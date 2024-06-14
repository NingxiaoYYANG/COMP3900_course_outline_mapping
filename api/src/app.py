#  imported libs
from apiflask import APIFlask
from flask import Flask, request, jsonify
import os

# imported files
from classification_controller import classify_clos_from_pdf

app = APIFlask(__name__, title='Successful Outcomes F11A', version = '0.1')


@app.get('/')
def index():
    return {'message': 'hello'}

@app.route('/api/classify_clos', methods=['POST'])
def classify_learning_outcome_route():
    # check if url provided
    data = request.json
    url = data.get('url')
    if not url:
        # check if file provided
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

        return jsonify({'blooms_labels': blooms_count})

    # TO-DO: url part

if __name__ == '__main__':
    app.run(debug=True)