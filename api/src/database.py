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

    finally:
        cursor.close()
        conn.close()

def get_all_course_info():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        statement = "SELECT course_code FROM clos"
        cursor.execute(statement)
        result = cursor.fetchall()
        
        course_codes = [row[0] for row in result]
        return course_codes
    
    except Exception as e:
        print(e)
        return []

    finally:
        cursor.close()
        conn.close()