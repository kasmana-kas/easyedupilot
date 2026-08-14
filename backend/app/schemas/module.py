from pydantic import BaseModel


class ModuleCreate(BaseModel):
    name: str
    department_id: int


class ModuleResponse(BaseModel):
    id: int
    name: str
    department_id: int

    class Config:
        from_attributes = True