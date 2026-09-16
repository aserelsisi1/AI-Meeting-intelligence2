
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from pydantic import BaseModel

from app.database.database import get_db
from app.models.action_item import ActionItem
from app.models.meeting import Meeting
from app.dependencies.auth import get_current_user


router = APIRouter(
    prefix="/api/meetings",
    tags=["Action Items"]
)


# =========================================================
# REQUEST SCHEMA
# =========================================================

class ActionItemCreate(BaseModel):

    task: str
    assigned_to: str | None = None
    deadline: str | None = None
    status: str = "pending"


# =========================================================
# GET ACTION ITEMS
# =========================================================

@router.get("/{meeting_id}/action-items")
def get_action_items(
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

    items = db.query(ActionItem).filter(
        ActionItem.meeting_id == meeting_id
    ).all()

    return [
        {
            "id": item.id,
            "meeting_id": item.meeting_id,
            "task": item.task,
            "assigned_to": item.assigned_to,
            "deadline": item.deadline,
            "status": item.status
        }
        for item in items
    ]


# =========================================================
# ADD ACTION ITEM
# =========================================================

@router.post("/{meeting_id}/action-items")
def add_action_item(
    meeting_id: int,
    item_data: ActionItemCreate,
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

    item = ActionItem(
        meeting_id=meeting_id,
        task=item_data.task,
        assigned_to=item_data.assigned_to,
        status=item_data.status
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return {
        "message": "Action item added successfully",
        "action_item": {
            "id": item.id,
            "task": item.task,
            "assigned_to": item.assigned_to,
            "deadline": item.deadline,
            "status": item.status
        }
    }


# =========================================================
# UPDATE ACTION ITEM STATUS
# =========================================================

@router.put("/{meeting_id}/action-items/{item_id}")
def update_action_item(
    meeting_id: int,
    item_id: int,
    status: str,
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

    item = db.query(ActionItem).filter(
        ActionItem.id == item_id,
        ActionItem.meeting_id == meeting_id
    ).first()

    if not item:

        raise HTTPException(
            status_code=404,
            detail="Action item not found"
        )

    item.status = status

    db.commit()
    db.refresh(item)

    return {
        "message": "Action item updated successfully",
        "action_item": {
            "id": item.id,
            "task": item.task,
            "assigned_to": item.assigned_to,
            "deadline": item.deadline,
            "status": item.status
        }
    }


# =========================================================
# DELETE ACTION ITEM
# =========================================================

@router.delete("/{meeting_id}/action-items/{item_id}")
def delete_action_item(
    meeting_id: int,
    item_id: int,
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

    item = db.query(ActionItem).filter(
        ActionItem.id == item_id,
        ActionItem.meeting_id == meeting_id
    ).first()

    if not item:

        raise HTTPException(
            status_code=404,
            detail="Action item not found"
        )

    db.delete(item)
    db.commit()

    return {
        "message": "Action item deleted successfully"
    }

