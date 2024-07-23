import mysql.connector as database
import json
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

def import_blooms_taxonomy_from_json(file_path):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        with open(file_path, 'r') as file:
            blooms_taxonomy = json.load(file)

        for level, words in blooms_taxonomy.items():
            cursor.execute("INSERT INTO blooms_taxonomy (level, words) VALUES (%s, %s) ON DUPLICATE KEY UPDATE words = %s", 
                           (level, json.dumps(words), json.dumps(words)))

        conn.commit()

        print(f"Data imported from {file_path} successfully.")
    
    except Exception as e:
        print(e)
    
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    # Get the directory of the current script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    import_file_path = os.path.join(script_dir, 'blooms_taxonomy_export.json')
    
    import_blooms_taxonomy_from_json(import_file_path)
