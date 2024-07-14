import mysql.connector as database
import os
from dotenv import load_dotenv


# Load environment variables from .env file
load_dotenv()

username = os.getenv('MARIADB_USER')
password = os.getenv('MARIADB_PASSWORD')
host = "localhost"
database_name = os.getenv('MARIADB_DATABASE')

def get_db_connection():
    return database.connect(
        user=username,
        password=password,
        host=host,
        database=database_name
    )

def add_clos(course_code, remember, understand, apply, analyse, evaluate, create):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("CREATE TABLE IF NOT EXISTS clos (course_code VARCHAR(8) PRIMARY KEY, remember INT, understand INT, apply INT, analyse INT, evaluate INT, `create` INT)")
        conn.commit()

        cursor.execute("SELECT course_code FROM clos WHERE course_code = %s", (course_code,))
        existing_course = cursor.fetchone()

        if existing_course:
            print(f"Course code {course_code} already exists.")
            return False

        statement = "INSERT INTO clos (course_code, remember, understand, apply, analyse, evaluate, `create`) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        values = (course_code, remember, understand, apply, analyse, evaluate, create)
        cursor.execute(statement, values)
        conn.commit()

        return True
    
    except Exception as e:
        print(e)
        return False
    
    finally:
        cursor.close()
        conn.close()

def get_clos(course_code):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        statement = "SELECT * FROM clos WHERE course_code = %s"
        values = (course_code,)
        cursor.execute(statement, values)
        result = cursor.fetchall()

        if result:
            return {
                "Remember": result[0][1],
                "Understand": result[0][2],
                "Apply": result[0][3],
                "Analyse": result[0][4],
                "Evaluate": result[0][5],
                "Create": result[0][6]
            }
        else:
            print("No blooms counts for " + course_code)
            return False
        
    except Exception as e:
        print(e)
        return False

    finally:
        cursor.close()
        conn.close()

def add_course_detail(course_details):
    try:
        course_code = course_details["course_code"]
        course_name = course_details["course_name"]
        course_level = course_details["course_level"]
        course_term = course_details["course_term"]
        faculty = course_details["faculty"]
        delivery_mode = course_details["delivery_mode"]
        delivery_format = course_details["delivery_format"]
        delivery_location = course_details["delivery_location"]
        campus = course_details["campus"]
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("CREATE TABLE IF NOT EXISTS course_details (course_code VARCHAR(8) PRIMARY KEY, course_name VARCHAR(30), course_level VARCHAR(2), course_term VARCHAR(4), faculty VARCHAR(30), delivery_mode VARCHAR(30), delivery_format VARCHAR(30), delivery_location VARCHAR(30), campus VARCHAR(30))")
        conn.commit()

        cursor.execute("SELECT course_code FROM course_details WHERE course_code = %s", (course_code,))
        existing_course = cursor.fetchone()

        if existing_course:
            print(f"Course code {course_code} already exists.")
            return False

        statement = "INSERT INTO course_details (course_code, course_name, course_level, course_term, faculty, delivery_mode, delivery_format, delivery_location, campus) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
        values = (course_code, course_name, course_level, course_term, faculty, delivery_mode, delivery_format, delivery_location, campus)
        cursor.execute(statement, values)
        conn.commit()

        return True
    
    except Exception as e:
        print(e)
        return False
    
    finally:
        cursor.close()
        conn.close()

def get_all_course_details():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        statement = "SELECT * FROM course_details"
        cursor.execute(statement)
        result = cursor.fetchall()
        course_details = [row for row in result]
        return course_details
    
    except Exception as e:
        print(e)
        return []

    finally:
        cursor.close()
        conn.close()

# debug only
def clear_database():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("DROP TABLE IF EXISTS clos")
        cursor.execute("DROP TABLE IF EXISTS course_files")
        cursor.execute("DROP TABLE IF EXISTS course_details")
        conn.commit()

        return True

    except Exception as e:
        print(e)
        return False

    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    clear_database()