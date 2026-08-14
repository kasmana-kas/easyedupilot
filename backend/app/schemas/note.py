from datetime import datetime

from pydantic import BaseModel


# ==========================================
# AI MATERIAL GENERATION REQUEST
# ==========================================

class NoteGenerateRequest(BaseModel):

    topic: str

    material_type: str

    difficulty: str = "beginner"


# ==========================================
# NOTE RESPONSE
# ==========================================

class NoteResponse(BaseModel):

    id: int

    share_code: str

    title: str

    content: str | None

    note_type: str

    created_by: int

    created_at: datetime

    class Config:
        from_attributes = True