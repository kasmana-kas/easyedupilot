from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user

from app.services.ai_materials import generate_learning_material

from app.crud.note import create_note

from app.schemas.note import NoteGenerateRequest


router = APIRouter(
    prefix="/ai/materials",
    tags=["AI Learning Materials"]
)


@router.post("/generate")
def generate_material(
    request: NoteGenerateRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    # ==========================================
    # CHECK USER ROLE
    # ==========================================

    if current_user.role != "teacher":
        raise HTTPException(
            status_code=403,
            detail="Only teachers can generate learning material."
        )

    # ==========================================
    # VALIDATE TOPIC
    # ==========================================

    if not request.topic.strip():
        raise HTTPException(
            status_code=400,
            detail="Topic is required."
        )

    # ==========================================
    # VALIDATE MATERIAL TYPE
    # ==========================================

    allowed_types = [
        "notes",
        "summary",
        "flashcards",
        "study_guide",
        "explanation"
    ]

    if request.material_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Invalid material type."
        )

    # ==========================================
    # GENERATE AI MATERIAL
    # ==========================================

    try:

        material = generate_learning_material(
            topic=request.topic,
            material_type=request.material_type,
            difficulty=request.difficulty
        )

    except Exception as e:

        print("AI MATERIAL ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to generate learning material."
        )

    # ==========================================
    # SAVE AI MATERIAL AS A NOTE
    # ==========================================

    try:

        note = create_note(
            db=db,
            title=request.topic,
            content=material,
            note_type=request.material_type,
            created_by=current_user.id
        )

    except Exception as e:

        print("NOTE SAVE ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail="AI material was generated but could not be saved."
        )

    # ==========================================
    # RETURN SAVED NOTE
    # ==========================================

    return {
        "success": True,
        "message": "Learning material generated and saved successfully.",

        # IMPORTANT
        "note_id": note.share_code,

        "title": note.title,

        "topic": request.topic,

        "material_type": note.note_type,

        "note_type": note.note_type,

        "difficulty": request.difficulty,

        "content": note.content,

        "created_by": current_user.id,

        "created_at": note.created_at
    }