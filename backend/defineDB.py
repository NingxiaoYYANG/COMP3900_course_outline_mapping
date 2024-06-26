import mariadb
import sys
from acessDB import *


def create_courses_table(conn):
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS Courses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(8) NOT NULL,
            pdf_file LONGBLOB
        )
    """)
    conn.commit()
    cur.close()

def create_CLO_table(conn):
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS CLO (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(10) NOT NULL,
            course_id INT,
            clo_text TEXT NOT NULL,
            FOREIGN KEY (course_id) REFERENCES Courses(id)
        )
    """)
    conn.commit()
    cur.close()

def create_verb_table(conn):
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS Verb (
            id INT AUTO_INCREMENT PRIMARY KEY,
            verb_text VARCHAR(100) NOT NULL,
            taxonomy_level_id INT,
            FOREIGN KEY (taxonomy_level_id) REFERENCES level(id)
        )
    """)
    conn.commit()
    cur.close()

def create_verb_association_table(conn):
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS verb_association (
            clo_id INT,
            verb_id INT,
            PRIMARY KEY (clo_id, verb_id),
            FOREIGN KEY (clo_id) REFERENCES CLO(id),
            FOREIGN KEY (verb_id) REFERENCES Verb(id)
        )
    """)
    conn.commit()
    cur.close()

def create_taxonomy_level(conn):
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS level (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(32) NOT NULL
        )
    """)
    conn.commit()
    cur.close()

def delete_tables(conn):
    cur = conn.cursor()
    
    # Disable foreign key checks
    cur.execute("SET FOREIGN_KEY_CHECKS = 0")
    
    # Get all table names
    cur.execute("SHOW TABLES")
    tables = cur.fetchall()
    
    for (table,) in tables:
        try:
            cur.execute(f"DROP TABLE {table}")
            print(f"Dropped table: {table}")
        except mariadb.Error as e:
            print(f"Error dropping table {table}: {e}")
    
    # Re-enable foreign key checks
    cur.execute("SET FOREIGN_KEY_CHECKS = 1")
    
    conn.commit()


def resetDB():
    conn = connect_to_database()
    cur = conn.cursor()

    delete_tables(conn)

    create_courses_table(conn)
    create_CLO_table(conn)
    create_taxonomy_level(conn)
    create_verb_table(conn)
    create_verb_association_table(conn)
    
    
    cur.close()
    


if __name__ == "__main__":
    resetDB()
