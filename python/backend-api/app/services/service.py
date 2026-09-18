import os
import pyodbc
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

def get_db_connection():
    server = os.getenv("DB_SERVER")
    database = os.getenv("DB_NAME")
    conn = pyodbc.connect(
        f"DRIVER={{ODBC Driver 17 for SQL Server}};"
        f"SERVER={server};"
        f"DATABASE={database};"
        f"Trusted_Connection=yes;"
    )
    return conn

def load_students():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, email, age, course, image_url, phone, roll_no FROM student")
        rows = cursor.fetchall()
        
        students = []
        for row in rows:
            students.append({
                "id": row[0],
                "name": row[1],
                "email": row[2],
                "age": row[3],
                "course": row[4],
                "image_url": row[5],
                "phone": row[6],
                "roll_no": row[7]
            })
        cursor.close()
        conn.close()
        return students
    except Exception as e:
        print("Database load error:", e)
        return []

def save_student_to_db(student_data):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Safely convert id and age to integer if possible to prevent type mismatch
        s_id = int(student_data.get("id")) if student_data.get("id") is not None else None
        s_age = int(student_data.get("age")) if student_data.get("age") is not None else None

        cursor.execute(
            "INSERT INTO student (id, name, email, age, course, image_url, phone, roll_no) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (
                s_id, 
                student_data.get("name"), 
                student_data.get("email"), 
                s_age, 
                student_data.get("course"), 
                student_data.get("image_url"), 
                student_data.get("phone"), 
                student_data.get("roll_no")
            )
        )
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print("Database save error:", e)
        return False

def update_student_in_db(student_id, student_data):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        s_age = int(student_data.get("age")) if student_data.get("age") is not None else None

        cursor.execute(
            """
            UPDATE student 
            SET name = ?, email = ?, age = ?, course = ?, image_url = ?, phone = ?, roll_no = ? 
            WHERE id = ?
            """,
            (
                student_data.get("name"),
                student_data.get("email"),
                s_age,
                student_data.get("course"),
                student_data.get("image_url"),
                student_data.get("phone"),
                student_data.get("roll_no"),
                int(student_id)
            )
        )
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print("Database update error:", e)
        return False

def delete_student_from_db(student_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM student WHERE id = ?", (int(student_id),))
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print("Database delete error:", e)
        return False

def upload_student_image(file_path):
    try:
        result = cloudinary.uploader.upload(file_path, folder="students_data")
        return result.get("secure_url")
    except Exception as e:
        print("Cloudinary upload error:", e)
        return None