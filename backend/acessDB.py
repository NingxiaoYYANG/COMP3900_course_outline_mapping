import mariadb
import sys
from acessDB import *
from blooms_levels import BLOOMS_TAXONOMY

#TODO Setup Proper DB
def connect_to_database():
    try:
        conn = mariadb.connect(
            user="myuser",
            password="mypassword",
            host="localhost",
            port=3306,
            database="testDB"
        )
        return conn
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        sys.exit(1)

def get_course_id(conn, name):
    cur = conn.cursor()
    cur.execute("""
        SELECT id FROM Courses WHERE name = ?
    """, (name,))
    result = cur.fetchone()
    if result:
        return result[0]
    else:
        return None

def print_command(cur):
    for x in cur:
        print(x)

def get_level_id(conn, level):
    cur = conn.cursor()
    cur.execute("""
        SELECT id FROM level WHERE name = ?
    """, (level,))
    result = cur.fetchone()
    if result:
        return result[0]
    else:
        return None
    
def get_clo_id(conn, clo_name, course_id):
    cur = conn.cursor()
    cur.execute("""
        SELECT id FROM CLO WHERE name = ? AND course_id = ?
    """, (clo_name, course_id))
    result = cur.fetchone()
    if result:
        return result[0]
    else:
        return None

def get_verb_id(conn, verb):
    cur = conn.cursor()
    cur.execute("""
        SELECT id FROM Verb WHERE verb_text = ?
    """, (verb,))
    result = cur.fetchone()
    if result:
        return result[0]
    else:
        return None
    
def get_course_outline(conn, course_id):
    cur = conn.cursor()
    cur.execute("""
        SELECT pdf_file 
        FROM Courses 
        WHERE id = ?
    """, (course_id,))
    
    row = cur.fetchone()
    
    if row:
        pdf_data = row[0]
        return pdf_data
    else:
        print("No PDF found for the given course ID.")
    
    cur.close()

def new_course(conn, course_name, pdf_file):

    cur = conn.cursor()
    cur.execute("INSERT INTO Courses (name, pdf_file) VALUES (?, ?)", (course_name, pdf_file, ))
    conn.commit()

    cur.close()

def new_CLO(conn, course_id, clo_name, clo_description):
    cur = conn.cursor()
    cur.execute("INSERT INTO CLO (course_id, name, clo_text) VALUES (?, ?, ?)", (course_id, clo_name, clo_description,))
    conn.commit()


def new_verb(conn, verb_text, taxonomy_level_id):
    cur = conn.cursor()
    cur.execute("INSERT INTO Verb (verb_text, taxonomy_level_id) VALUES (?, ?)", (verb_text, taxonomy_level_id,))
    conn.commit()

def new_level(conn, name):
    cur = conn.cursor()
    cur.execute("INSERT INTO level (name) VALUES (?)", (name,))
    conn.commit()

def link_verbs(conn, CLOS_id, verb_id):
    cur = conn.cursor()
    cur.execute("INSERT INTO verb_association (clo_id, verb_id) VALUES (?, ?)", (CLOS_id, verb_id,))
    conn.commit()


def inilise_verbs(conn):
    for level, verbs in BLOOMS_TAXONOMY.items():
        #print(level, verbs)
        for verb in verbs:
            #print(verb)
            new_level(conn, level)
            new_verb(conn, verb, get_level_id(conn, level))



def get_verbs_for_clo(conn, clo_id):

    cur = conn.cursor()

    # Query to get the verb ids associated with the given clo_id
    query = """
        SELECT v.verb_text
        FROM Verb v
        JOIN verb_association va ON v.id = va.verb_id
        WHERE va.clo_id = ?
    """
    cur.execute(query, (clo_id,))
    verbs = cur.fetchall()

    
    cur.close()
    conn.close()

    return verbs