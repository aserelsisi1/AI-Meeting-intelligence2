
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from pydantic import BaseModel

from app.database.database import get_db
from app.models.decision import Decision
from app.models.meeting import Meeting
from app.dependencies.auth import get_current_user


router = APIRouter(
    prefix="/api/meetings",
    tags=["Decisions"]
)


class DecisionCreate(BaseModel):

    decision: str
    timestamp: float | None = None


# =========================================================
# GET DECISIONS
# =========================================================

@router.get("/{meeting_id}/decisions")
def get_decisions(
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

    decisions = db.query(Decision).filter(
        Decision.meeting_id == meeting_id
    ).all()

    return [
        {
            "id": decision.id,
            "meeting_id": decision.meeting_id,
            "decision": decision.decision,
            "timestamp": decision.timestamp
        }
        for decision in decisions
    ]


# =========================================================
# ADD DECISION
# =========================================================

@router.post("/{meeting_id}/decisions")
def add_decision(
    meeting_id: int,
    decision_data: DecisionCreate,
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

    decision = Decision(
        meeting_id=meeting_id,
        decision=decision_data.decision,
        timestamp=decision_data.timestamp
    )

    db.add(decision)
    db.commit()
    db.refresh(decision)

    return {
        "message": "Decision added successfully",
        "decision": {
            "id": decision.id,
            "decision": decision.decision,
            "timestamp": decision.timestamp
        }
    }


# =========================================================
# DELETE DECISION
# =========================================================

@router.delete("/{meeting_id}/decisions/{decision_id}")
def delete_decision(
    meeting_id: int,
    decision_id: int,
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

    decision = db.query(Decision).filter(
        Decision.id == decision_id,
        Decision.meeting_id == meeting_id
    ).first()

    if not decision:

        raise HTTPException(
            status_code=404,
            detail="Decision not found"
        )

    db.delete(decision)
    db.commit()

    return {
        "message": "Decision deleted successfully"
    }

