import mysql.connector as database
import os

username = "backend"
password = "bb11a381f2c1bd26e64a1ba76c32b4ea" # TODO: Make this use .env file

datastore = database.connect(
    user=username,
    password=password,
    host="localhost",
    database="f11ap16"
)

cursor = datastore.cursor()

def add_clos(course_code, remember, understand, apply, analyse, evaluate, create):
    try:
        # Create table if not exists, course codes are always 4 numbers and 4 letters.
        cursor.execute("CREATE TABLE IF NOT EXISTS clos (course_code VARCHAR(8) PRIMARY KEY, remember INT, understand INT, apply INT, analyse INT, evaluate INT, `create` INT)")
        datastore.commit()

        # Check if course_code already exists
        cursor.execute("SELECT course_code FROM clos WHERE course_code = %s", (course_code,))
        existing_course = cursor.fetchone()

        if existing_course:
            # Course code already exists, handle as needed (update or ignore)
            print(f"Course code {course_code} already exists.")
            return False

        # Insert data
        statement = "INSERT INTO clos (course_code, remember, understand, apply, analyse, evaluate, `create`) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        values = (course_code, remember, understand, apply, analyse, evaluate, create)
        cursor.execute(statement, values)
        datastore.commit()

        return True
    
    except Exception as e:
        print(e)
        return False
    
def get_clos(course_code):
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

def upload_pdf(course_code, file):
    try:
        # Convert FileStorage object to binary data
        file_data = file.read()

        # Create table if not exists, course codes are always 4 numbers and 4 letters.
        cursor.execute("CREATE TABLE IF NOT EXISTS course_files (course_code VARCHAR(8) PRIMARY KEY, file_data LONGBLOB)")
        datastore.commit()

        # Insert into database
        statement = "INSERT INTO course_files (course_code, file_data) VALUES (%s, %s)"
        values = (course_code, file_data)
        cursor.execute(statement, values)
        datastore.commit()

        return True
    
    except Exception as e:
        print(e)
        return False
    
def get_pdf(course_code):
    try:
        # Get file from database
        statement = "SELECT file_data FROM course_files WHERE course_code = %s"
        cursor.execute(statement, (course_code,))
        result = cursor.fetchone()
        print(result)
        if result:
            return result[0]
        else:
            return None

    except Exception as e:
        print(e)
        return None