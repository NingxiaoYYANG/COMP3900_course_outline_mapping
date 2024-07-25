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

def export_blooms_taxonomy_to_json(file_path):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM blooms_taxonomy")
        result = cursor.fetchall()

        blooms_taxonomy = {row[0]: json.loads(row[1]) for row in result}

        with open(file_path, 'w') as file:
            json.dump(blooms_taxonomy, file, indent=4)

        print(f"Data exported to {file_path} successfully.")
    
    except Exception as e:
        print(e)
    
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    # Get the directory of the current script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    export_file_path = os.path.join(script_dir, 'blooms_taxonomy_export.json')
    
    export_blooms_taxonomy_to_json(export_file_path)
