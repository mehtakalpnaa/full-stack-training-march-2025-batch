import os
from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import credentials, auth
from app.routes.route import router

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
KEY_PATH = os.path.join(BASE_DIR, "student-management-f5ca6-firebase-adminsdk-fbsvc-9131accbae.json")

if not firebase_admin._apps:
    cred = credentials.Certificate(KEY_PATH)
    firebase_admin.initialize_app(cred)

app = FastAPI(
    title="Student Management API",
    description="CRUD API using FastAPI + Firebase Security",
    version="1.0.0"
)

security = HTTPBearer()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def verify_firebase_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token! Login blocked.")

@app.post("/api/verify-token/")
def verify_user_endpoint(user_data: dict = Depends(verify_firebase_token)):
    return {
        "message": "Token verified successfully!",
        "uid": user_data.get("uid"),
        "email": user_data.get("email")
    }

app.include_router(router)

@app.get("/")
def home():
    return {"message": "Welcome to Student Management API with Firebase Security"}