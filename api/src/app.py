#  imported libs
from apiflask import APIFlask
from flask import Flask, request, jsonify

# imported files
from classification_controller import classify_learning_outcome

app = APIFlask(__name__, title='Successful Outcomes F11A', version = '0.1')


@app.get('/')
def index():
    return {'message': 'hello'}

@app.route('/api/classify-learning-outcome', methods=['POST'])
def classify_learning_outcome_route():
    data = request.json
    learning_outcome = data.get('learning_outcome')
    # print(learning_outcome)

    if not learning_outcome:
        return jsonify({'error': 'Missing learning outcome'}), 400

    predicted_label = classify_learning_outcome(learning_outcome)
    print(predicted_label)
    return jsonify({'predicted_label': predicted_label}), 200

if __name__ == '__main__':
    app.run(debug=True)