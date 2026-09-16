import os
import uuid

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.services.media_service import get_media_duration
from app.services.transcription import transcribe_audio
from app.services.ai_service import generate_summary

from app.database.database import get_db
from app.models.meeting import Meeting
from app.schemas.meeting import MeetingCreate, MeetingResponse
from app.dependencies.auth import get_current_user


router = APIRouter(
    prefix="/api/meetings",
    tags=["Meetings"]
)


# =========================================================
# CREATE MEETING
# =========================================================

@router.post("/", response_model=MeetingResponse)
def create_meeting(
    meeting_data: MeetingCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    meeting = Meeting(
        user_id=current_user["user_id"],
        title=meeting_data.title,
        description=meeting_data.description,
        meeting_date=meeting_data.meeting_date
    )

    db.add(meeting)
    db.commit()
    db.refresh(meeting)

    return meeting


# =========================================================
# GET ALL MEETINGS
# =========================================================

@router.get("/", response_model=list[MeetingResponse])
def get_meetings(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    meetings = db.query(Meeting).filter(
        Meeting.user_id == current_user["user_id"]
    ).all()

    return meetings


# =========================================================
# GET SINGLE MEETING
# =========================================================

@router.get("/{meeting_id}", response_model=MeetingResponse)
def get_meeting(
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

    return meeting


# =========================================================
# UPDATE MEETING
# =========================================================

@router.put("/{meeting_id}", response_model=MeetingResponse)
def update_meeting(
    meeting_id: int,
    meeting_data: MeetingCreate,
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

    meeting.title = meeting_data.title
    meeting.description = meeting_data.description
    meeting.meeting_date = meeting_data.meeting_date

    db.commit()
    db.refresh(meeting)

    return meeting


# =========================================================
# DELETE MEETING
# =========================================================

@router.delete("/{meeting_id}")
def delete_meeting(
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

    db.delete(meeting)
    db.commit()

    return {
        "message": "Meeting deleted successfully"
    }


# =========================================================
# UPLOAD + DURATION + TRANSCRIPTION + AI SUMMARY
# =========================================================

@router.post("/{meeting_id}/upload")
def upload_meeting_file(
    meeting_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    # =====================================================
    # FIND MEETING
    # =====================================================

    meeting = db.query(Meeting).filter(
        Meeting.id == meeting_id,
        Meeting.user_id == current_user["user_id"]
    ).first()

    if not meeting:
        raise HTTPException(
            status_code=404,
            detail="Meeting not found"
        )


    # =====================================================
    # CHECK FILE TYPE
    # =====================================================

    allowed_types = [
        "audio/mpeg",
        "audio/wav",
        "audio/x-wav",
        "audio/mp4",
        "video/mp4",
        "video/mpeg"
    ]

    if file.content_type not in allowed_types:

        raise HTTPException(
            status_code=400,
            detail="Only audio or video files are allowed"
        )


    # =====================================================
    # CREATE UPLOAD DIRECTORY
    # =====================================================

    upload_directory = "uploads"

    if not os.path.exists(upload_directory):
        os.makedirs(upload_directory)


    # =====================================================
    # CREATE UNIQUE FILE NAME
    # =====================================================

    original_filename = file.filename

    file_extension = os.path.splitext(
        original_filename
    )[1]

    unique_filename = (
        str(uuid.uuid4()) +
        file_extension
    )

    file_path = os.path.join(
        upload_directory,
        unique_filename
    )


    # =====================================================
    # SAVE UPLOADED FILE
    # =====================================================

    try:

        with open(file_path, "wb") as buffer:

            buffer.write(
                file.file.read()
            )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Could not save uploaded file: {str(e)}"
        )


    # =====================================================
    # SAVE FILE INFORMATION
    # =====================================================

    meeting.file_name = original_filename
    meeting.file_type = file.content_type
    meeting.file_path = file_path
    meeting.status = "processing"

    db.commit()
    db.refresh(meeting)


    # =====================================================
    # CALCULATE MEDIA DURATION
    # =====================================================

    duration = get_media_duration(file_path)

    meeting.duration = duration

    db.commit()
    db.refresh(meeting)


    # =====================================================
    # AI PROCESSING
    # =====================================================

    try:

        # -------------------------------------------------
        # STEP 1: TRANSCRIBE AUDIO
        # -------------------------------------------------

        transcription = transcribe_audio(
            file_path
        )

        meeting.transcription = transcription

        db.commit()
        db.refresh(meeting)


        # -------------------------------------------------
        # STEP 2: GENERATE AI SUMMARY
        # -------------------------------------------------

        summary = generate_summary(
            transcription
        )

        meeting.summary = summary


        # -------------------------------------------------
        # STEP 3: MARK AS COMPLETED
        # -------------------------------------------------

        meeting.status = "completed"

        db.commit()
        db.refresh(meeting)


    except Exception as e:

        # Do NOT delete the duration here.
        # The duration may have been calculated
        # successfully even if transcription fails.

        meeting.status = "failed"

        db.commit()

        raise HTTPException(
            status_code=500,
            detail=f"Meeting processing failed: {str(e)}"
        )


    # =====================================================
    # RETURN RESULT
    # =====================================================

    return {

        "message":
            "Meeting uploaded, transcribed and summarized successfully",

        "meeting_id":
            meeting.id,

        "file_name":
            meeting.file_name,

        "duration":
            meeting.duration,

        "status":
            meeting.status,

        "transcription":
            meeting.transcription,

        "summary":
            meeting.summary
    }