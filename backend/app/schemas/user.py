from pydantic import BaseModel, EmailStr
from typing import Literal

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    role: Literal["student", "teacher"]

class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    role: str

    model_config = {
        "from_attributes": True
    }