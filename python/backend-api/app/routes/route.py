import os
from fastapi import APIRouter, HTTPException, Query, File, UploadFile
from app.services.service import (
    load_students, 
    save_student_to_db, 
    update_student_in_db, 
    delete_student_from_db, 
    upload_student_image
)
from pydantic import BaseModel
from typing import Optional, Union

router = APIRouter(prefix="", tags=["Students"])

class Student(BaseModel):
    id: Union[int, str]
    name: str
    email: str 
    age: Union[int, str]
    course: str
    image_url: Optional[str] = None
    phone: Optional[str] = None
    roll_no: Optional[str] = None

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    age: Union[int, str, None] = None
    course: Optional[str] = None
    image_url: Optional[str] = None
    phone: Optional[str] = None
    roll_no: Optional[str] = None

@router.get("/students", response_model=dict)
@router.get("/students/", response_model=dict)
def get_all_students():
    return {"students": load_students()}

@router.get("/students/search")
def search_students(query: str = Query(..., description="Search by name or email")):
    students = load_students()
    filtered = [
        s for s in students 
        if query.lower() in s.get("name", "").lower() or query.lower() in s.get("email", "").lower()
    ]
    return {"results": filtered}

@router.get("/students/{student_id}")
def get_student_by_id(student_id: int):
    students = load_students()
    for student in students:
        if student["id"] == student_id:
            return {"student": student}
    raise HTTPException(status_code=404, detail="Student not found")

@router.post("/students/upload-image")
@router.post("/students/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    temp_file_path = f"temp_{file.filename}"
    with open(temp_file_path, "wb") as buffer:
        buffer.write(await file.read())
    
    image_url = upload_student_image(temp_file_path)
    
    if os.path.exists(temp_file_path):
        os.remove(temp_file_path)
        
    if not image_url:
        raise HTTPException(status_code=500, detail="Image upload failed")
        
    return {"message": "Image uploaded successfully", "image_url": image_url}

@router.post("/students")
@router.post("/students/")
def add_student(student: Student):
    try:
        students = load_students()
        if any(s["id"] == student.id for s in students):
            raise HTTPException(status_code=400, detail="Student ID already exists")
        
        success = save_student_to_db(student.dict())
        if not success:
            raise HTTPException(status_code=500, detail="Failed to save student to database")
            
        return {"message": "Student added successfully", "student": student}
    except Exception as e:
        print("Add Student Error:", e)
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/students/{student_id}")
def put_student(student_id: int, updated_data: StudentUpdate):
    try:
        students = load_students()
        target_student = None
        for student in students:
            if student["id"] == student_id:
                target_student = student
                break
                
        if not target_student:
            raise HTTPException(status_code=404, detail="Student not found")
            
        updated_dict = {
            "name": updated_data.name if updated_data.name is not None else target_student.get("name"),
            "email": updated_data.email if updated_data.email is not None else target_student.get("email"),
            "age": updated_data.age if updated_data.age is not None else target_student.get("age"),
            "course": updated_data.course if updated_data.course is not None else target_student.get("course"),
            "image_url": updated_data.image_url if updated_data.image_url is not None else target_student.get("image_url"),
            "phone": updated_data.phone if updated_data.phone is not None else target_student.get("phone"),
            "roll_no": updated_data.roll_no if updated_data.roll_no is not None else target_student.get("roll_no")
        }
        
        success = update_student_in_db(student_id, updated_dict)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to update student in database")
            
        return {"message": "Student updated completely", "student": updated_dict}
    except Exception as e:
        print("PUT Error:", e)
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/students/{student_id}")
def patch_student(student_id: int, updated_data: StudentUpdate):
    try:
        students = load_students()
        target_student = None
        for student in students:
            if student["id"] == student_id:
                target_student = student
                break
                
        if not target_student:
            raise HTTPException(status_code=404, detail="Student not found")
            
        updated_dict = {
            "name": updated_data.name if updated_data.name is not None else target_student.get("name"),
            "email": updated_data.email if updated_data.email is not None else target_student.get("email"),
            "age": updated_data.age if updated_data.age is not None else target_student.get("age"),
            "course": updated_data.course if updated_data.course is not None else target_student.get("course"),
            "image_url": updated_data.image_url if updated_data.image_url is not None else target_student.get("image_url"),
            "phone": updated_data.phone if updated_data.phone is not None else target_student.get("phone"),
            "roll_no": updated_data.roll_no if updated_data.roll_no is not None else target_student.get("roll_no")
        }
        
        success = update_student_in_db(student_id, updated_dict)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to patch student in database")
            
        return {"message": "Student updated partially", "student": updated_dict}
    except Exception as e:
        print("PATCH Error:", e)
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/students/{student_id}")
def remove_student(student_id: int):
    try:
        students = load_students()
        if not any(s["id"] == student_id for s in students):
            raise HTTPException(status_code=404, detail="Student not found")
            
        success = delete_student_from_db(student_id)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to delete student from database")
            
        return {"message": f"Student with ID {student_id} removed successfully"}
    except Exception as e:
        print("Delete Error:", e)
        raise HTTPException(status_code=500, detail=str(e))