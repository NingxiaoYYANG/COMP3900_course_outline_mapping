
import mysql.connector as database

username = "backend"
password = "bb11a381f2c1bd26e64a1ba76c32b4ea" # TODO: Make this use .env file

datastore = database.connect(
    user=username,
    password=password,
    host="localhost",
    database="f11ap16"
)

cursor = datastore.cursor()

def add_clos (course_code, remember, understand, apply, analyse, evaluate, create):
    try:
        # Create table if not exists, course codes are always 4 numbers and 4 letters.
        cursor.execute("CREATE TABLE IF NOT EXISTS clos (course_code VARCHAR(8) PRIMARY KEY, remember INT, understand INT, apply INT, analyse INT, evaluate INT, `create` INT)")
        datastore.commit()

        # Insert data
        statement = "INSERT INTO clos (course_code, remember, understand, apply, analyse, evaluate, `create`) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        values = (course_code, remember, understand, apply, analyse, evaluate, create)
        cursor.execute(statement, values)
        datastore.commit()

        return True
    
    except Exception as e:
        print(e)
        return False
    
def get_clos (course_code):
    try:
        statement = "SELECT * FROM clos WHERE course_code = %s"
        values = (course_code,)
        cursor.execute(statement, values)
        result = cursor.fetchall()

        return {
            "Remember": result[0][1],
            "Understand": result[0][2],
            "Apply": result[0][3],
            "Analyse": result[0][4],
            "Evaluate": result[0][5],
            "Create": result[0][6]
        }
    
    except Exception as e:
        print(e)
        return False