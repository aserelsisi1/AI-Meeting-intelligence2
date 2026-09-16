
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.participant import Participant
from app.models.meeting import Meeting
from app.dependencies.auth import get_current_user

from pydantic import BaseModel, EmailStr


router = APIRouter(
    prefix="/api/meetings",
    tags=["Participants"]
)


# =========================================================
# REQUEST SCHEMA
# =========================================================

class ParticipantCreate(BaseModel):

    name: str
    email: str | None = None


# =========================================================
# ADD PARTICIPANT
# =========================================================

@router.post("/{meeting_id}/participants")
def add_participant(
    meeting_id: int,
    participant_data: ParticipantCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    meeting = db.query(Meeting).filter(
        Meeting.id == meeting_id,
        Meeting.user_id == current_user["user_id"]
    ).first()

    if not meeting:

        raise HTTPException(
            status_code=404,
            detail="Meeting not found"
        )

    participant = Participant(
        meeting_id=meeting_id,
        name=participant_data.name,
        email=participant_data.email
    )

    db.add(participant)
    db.commit()
    db.refresh(participant)

    return {
        "message": "Participant added successfully",
        "participant": {
            "id": participant.id,
            "meeting_id": participant.meeting_id,
            "name": participant.name,
            "email": participant.email
        }
    }


# =========================================================
# GET PARTICIPANTS
# =========================================================

@router.get("/{meeting_id}/participants")
def get_participants(
    meeting_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    meeting = db.query(Meeting).filter(
        Meeting.id == meeting_id,
        Meeting.user_id == current_user["user_id"]
    ).first()

    if not meeting:

        raise HTTPException(
            status_code=404,
            detail="Meeting not found"
        )

    participants = db.query(Participant).filter(
        Participant.meeting_id == meeting_id
    ).all()

    return [
        {
            "id": participant.id,
            "meeting_id": participant.meeting_id,
            "name": participant.name,
            "email": participant.email
        }
        for participant in participants
    ]


# =========================================================
# DELETE PARTICIPANT
# =========================================================

@router.delete("/{meeting_id}/participants/{participant_id}")
def delete_participant(
    meeting_id: int,
    participant_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    meeting = db.query(Meeting).filter(
        Meeting.id == meeting_id,
        Meeting.user_id == current_user["user_id"]
    ).first()

    if not meeting:

        raise HTTPException(
            status_code=404,
            detail="Meeting not found"
        )

    participant = db.query(Participant).filter(
        Participant.id == participant_id,
        Participant.meeting_id == meeting_id
    ).first()

    if not participant:

        raise HTTPException(
            status_code=404,
            detail="Participant not found"
        )

    db.delete(participant)
    db.commit()

    return {
        "message": "Participant deleted successfully"
    }

