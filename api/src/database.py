import mysql.connector as database
import os
import json
from dotenv import load_dotenv

from blooms_levels import BLOOMS_TAXONOMY

# Load environment variables from .env file
load_dotenv()

username = os.getenv('MARIADB_USER', 'backend')
password = os.getenv('MARIADB_PASSWORD', 'bb11a381f2c1bd26e64a1ba76c32b4ea')
host = os.getenv('MARIADB_HOST', 'localhost')
database_name = os.getenv('MARIADB_DATABASE', 'f11ap16')

def get_db_connection():
    return database.connect(
        user=username,
        password=password,
        host=host,
        database=database_name
    )

def initialize_blooms_taxonomy():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Create the blooms_taxonomy table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS blooms_taxonomy (
            level VARCHAR(50) PRIMARY KEY,
            words TEXT
        )
        """)
        conn.commit()

        # Initialize with default values if the table is empty
        cursor.execute("SELECT COUNT(*) FROM blooms_taxonomy")
        if cursor.fetchone()[0] == 0:
            blooms_taxonomy = BLOOMS_TAXONOMY
            for level, words in blooms_taxonomy.items():
                cursor.execute("INSERT INTO blooms_taxonomy (level, words) VALUES (%s, %s)", (level, json.dumps(words)))
            conn.commit()

        print("Blooms taxonomy initialized successfully.")
    
    except Exception as e:
        print(e)
    
    finally:
        cursor.close()
        conn.close()

def update_blooms_taxonomy_db(new_entries):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        for level, examples in new_entries.items():
            cursor.execute("SELECT words FROM blooms_taxonomy WHERE level = %s", (level,))
            words = cursor.fetchone()[0]
            words_list = json.loads(words) if words else []
            for example in examples:
                if example not in words_list:
                    words_list.append(example)
            cursor.execute("UPDATE blooms_taxonomy SET words = %s WHERE level = %s", (json.dumps(words_list), level))
        conn.commit()
    
    except Exception as e:
        print(e)
    
    finally:
        cursor.close()
        conn.close()

def get_blooms_taxonomy():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM blooms_taxonomy")
        result = cursor.fetchall()
        blooms_taxonomy = {row[0]: json.loads(row[1]) for row in result}
        return blooms_taxonomy
    
    except Exception as e:
        print(e)
        return {}

    finally:
        cursor.close()
        conn.close()


def add_clos(course_code, blooms_count):
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
        values = (course_code, blooms_count["Remember"], blooms_count["Understand"], blooms_count["Apply"], blooms_count["Analyse"], blooms_count["Evaluate"], blooms_count["Create"])
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
        course_clos = json.dumps(course_details.get("course_clos", []))  # Convert list to JSON string
        word_to_blooms = json.dumps(course_details.get("word_to_blooms", {}))  # Convert dictionary to JSON string
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("CREATE TABLE IF NOT EXISTS course_details (course_code VARCHAR(8) PRIMARY KEY, course_name VARCHAR(255), course_level VARCHAR(5), course_term VARCHAR(4), faculty VARCHAR(255), delivery_mode VARCHAR(255), delivery_format VARCHAR(255), delivery_location VARCHAR(255), campus VARCHAR(255), course_clos TEXT, word_to_blooms TEXT)")
        conn.commit()

        cursor.execute("SELECT course_code FROM course_details WHERE course_code = %s", (course_code,))
        existing_course = cursor.fetchone()

        if existing_course:
            print(f"Course code {course_code} already exists.")
            return False

        statement = "INSERT INTO course_details (course_code, course_name, course_level, course_term, faculty, delivery_mode, delivery_format, delivery_location, campus, course_clos, word_to_blooms) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        values = (course_code, course_name, course_level, course_term, faculty, delivery_mode, delivery_format, delivery_location, campus, course_clos, word_to_blooms)
        print(values)
        cursor.execute(statement, values)
        conn.commit()

        return True
    
    except Exception as e:
        print(e)
        return False
    
    finally:
        cursor.close()
        conn.close()

def get_course_detail(course_code):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        statement = "SELECT * FROM course_details WHERE course_code = %s"
        values = (course_code,)
        cursor.execute(statement, values)
        result = cursor.fetchall()
        
        if result:
            return {
                "course_code": result[0][0],
                "course_name": result[0][1],
                "course_level": result[0][2],
                "course_term": result[0][3],
                "faculty": result[0][4],
                "delivery_mode": result[0][5],
                "delivery_format": result[0][6],
                "delivery_location": result[0][7],
                "campus": result[0][8],
                "course_clos": json.loads(result[0][9]),  # Convert JSON string back to list
                "word_to_blooms": json.loads(result[0][10])  # Convert JSON string back to dictionary
            }
        else:
            print("No course detail for " + course_code)
            return False
    
    except Exception as e:
        print(e)
        return []

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
        
        course_details = []
        for row in result:
            course_details.append({
                "course_code": row[0],
                "course_name": row[1],
                "course_level": row[2],
                "course_term": row[3],
                "faculty": row[4],
                "delivery_mode": row[5],
                "delivery_format": row[6],
                "delivery_location": row[7],
                "campus": row[8],
                "course_clos": json.loads(row[9]),  # Convert JSON string back to list
                "word_to_blooms": json.loads(row[10])  # Convert JSON string back to dictionary
            })

        return course_details
    
    except Exception as e:
        print(e)
        return []

    finally:
        cursor.close()
        conn.close()

def delete_course(course_code):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Delete from both tables
        cursor.execute("DELETE FROM clos WHERE course_code = %s", (course_code,))
        cursor.execute("DELETE FROM course_details WHERE course_code = %s", (course_code,))
        conn.commit()

        return True
    
    except Exception as e:
        print(e)
        return False
    
    finally:
        cursor.close()
        conn.close()


# debug only
def clear_database():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("DROP TABLE IF EXISTS clos")
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
    # initialize_blooms_taxonomy()
