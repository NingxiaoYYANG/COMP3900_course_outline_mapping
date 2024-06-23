import mariadb
import sys
from acessDB import *
from defineDB import *


#Make a new coures
def new_courses(conn):

    cur = conn.cursor()

    courses = ['COMP3900', 'ARTS1660', 'MMAN3200']

    with open("testPDF.pdf", 'rb') as file:
        pdf_file = file.read()

    for i in courses:
        new_course(conn, i, pdf_file)

    # cur.execute("SELECT name FROM Courses")
    # print_command(cur)

#Give a list of 
def new_clos(conn):
    cur = conn.cursor()

    new_CLO(conn, get_course_id(conn, "COMP3900"), "CLO1","Define Hellow World")
    new_CLO(conn, get_course_id(conn, "COMP3900"), "CLO2", "Bye World")
    new_CLO(conn, get_course_id(conn, "COMP3900"), "CLOS3","Sup World")

    new_CLO(conn, get_course_id(conn, "ARTS1660"), "CLO1","Define ABC World")
    new_CLO(conn, get_course_id(conn, "ARTS1660"), "CLO2", "EDG World")
    new_CLO(conn, get_course_id(conn, "ARTS1660"), "CLOS3","HIJ World")

def inilise_verbs_test(conn):
    inilise_verbs(conn)

def link_verb_test(conn):
    cur = conn.cursor()
    cur.execute("SELECT * FROM verb_association")
    print_command(cur)
    #print(get_clo_id(conn, "CLO1", get_course_id(conn, "COMP3900")))
    link_verbs(conn, get_clo_id(conn, "CLO1", get_course_id(conn, "ARTS1660")), get_verb_id(conn, "define"))
    link_verbs(conn, get_clo_id(conn, "CLO1", get_course_id(conn, "COMP3900")), get_verb_id(conn, "define"))
    link_verbs(conn, get_clo_id(conn, "CLO1", get_course_id(conn, "COMP3900")), get_verb_id(conn, "identify"))
    link_verbs(conn, get_clo_id(conn, "CLO1", get_course_id(conn, "COMP3900")), get_verb_id(conn, "discuss"))
    cur.execute("SELECT * FROM verb_association")
    print_command(cur)
    

def get_course_outline_test(conn):
    pdf_data = get_course_outline(conn, get_course_id(conn, "COMP3900"))
    with open("savedPDF.pdf", 'wb') as file:
        file.write(pdf_data)

def get_clo_verbs(conn):
    print(get_verbs_for_clo(conn, get_course_id(conn, "COMP3900")))

def main():
    conn = connect_to_database()
    cur = conn.cursor()
    
    resetDB()
    new_courses(conn)
    inilise_verbs(conn)
    new_clos(conn)
    link_verb_test(conn)
    get_course_outline_test(conn)
    get_clo_verbs(conn)




if __name__ == "__main__":
    main()
