from apiflask import APIFlask

app = APIFlask(__name__, title='Successful Outcomes F11A', version = '0.1')


@app.get('/')
def index():
    return {'message': 'hello'}