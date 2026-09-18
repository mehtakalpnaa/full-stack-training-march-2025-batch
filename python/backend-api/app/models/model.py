from pydantic import BaseModel
from typing import Optional

class Student(BaseModel):
    id: int
    name: str
    email: str  # EmailStr ki jagah sirf str rakho
    age: int
    course: str
    image_url: Optional[str] = None

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    age: Optional[int] = None
    course: Optional[str] = None
    image_url: Optional[str] = None