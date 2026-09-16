import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import {
getMeetings,
deleteMeeting
} from "../services/api";

function Meetings() {


const [meetings, setMeetings] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
    loadMeetings();
}, []);

async function loadMeetings() {

    try {

        const data = await getMeetings();

        setMeetings(data);

    } catch (err) {

        setError(err.message);

    } finally {

        setLoading(false);

    }
}

async function handleDelete(id) {

    const confirmed = window.confirm(
        "Are you sure you want to permanently delete this meeting?"
    );

    if (!confirmed) {
        return;
    }

    try {

        await deleteMeeting(id);

        setMeetings(
            meetings.filter(
                (meeting) => meeting.id !== id
            )
        );

    } catch (err) {

        alert(
            err.message || "Failed to delete meeting."
        );

    }
}

function getStatus(status) {

    if (!status) {
        return "created";
    }

    return status.toLowerCase();
}

return (

    <Layout
        title="My Meetings"
        subtitle="View, manage and analyze your meetings"
    >

        <div className="page-toolbar">

            <div>

                <h2>
                    All Meetings
                </h2>

                <p>
                    {meetings.length} meeting
                    {meetings.length !== 1 ? "s" : ""}
                    {" "}in your workspace
                </p>

            </div>

            <Link
                to="/meetings/create"
                className="primary-btn"
            >
                + New Meeting
            </Link>

        </div>


        {loading && (

            <div className="empty-card">

                <div className="loading-spinner"></div>

                <h3>
                    Loading meetings
                </h3>

                <p>
                    Please wait while we retrieve your meetings.
                </p>

            </div>

        )}


        {error && (

            <div className="error-card">

                <strong>
                    Unable to load meetings
                </strong>

                <p>
                    {error}
                </p>

            </div>

        )}


        {!loading &&
            !error &&
            meetings.length === 0 && (

                <div className="empty-card">

                    <div className="empty-icon">
                        +
                    </div>

                    <h3>
                        No meetings yet
                    </h3>

                    <p>
                        Create your first meeting and upload
                        a recording to generate its transcript
                        and AI insights.
                    </p>

                    <Link
                        to="/meetings/create"
                        className="primary-btn"
                    >
                        Create Your First Meeting
                    </Link>

                </div>

            )}


        {!loading &&
            !error &&
            meetings.length > 0 && (

                <div className="meetings-grid">

                    {meetings.map((meeting) => (

                        <div
                            className="full-meeting-card"
                            key={meeting.id}
                        >

                            <div className="full-meeting-top">

                                <div className="large-meeting-icon">
                                    🎙
                                </div>

                                <span
                                    className={`status-badge ${getStatus(
                                        meeting.status
                                    )}`}
                                >
                                    {meeting.status || "created"}
                                </span>

                            </div>


                            <h3>
                                {meeting.title}
                            </h3>


                            <p className="meeting-description">

                                {meeting.description ||
                                    "No description provided."}

                            </p>


                            <div className="meeting-meta">

                                <span>
                                    📅{" "}
                                    {meeting.meeting_date
                                        ? new Date(
                                            meeting.meeting_date
                                        ).toLocaleString()
                                        : "No date specified"}
                                </span>


                                {meeting.file_name && (

                                    <span>
                                        🎵{" "}
                                        {meeting.file_name}
                                    </span>

                                )}


                                {meeting.transcription && (

                                    <span className="transcript-indicator">
                                        ✓ Transcript available
                                    </span>

                                )}


                                {meeting.summary && (

                                    <span className="summary-indicator">
                                        ✦ AI summary available
                                    </span>

                                )}

                            </div>


                            <div className="card-actions">

                                <Link
                                    to={`/meetings/${meeting.id}`}
                                    className="view-btn"
                                >
                                    View Details
                                </Link>


                                <Link
                                    to={`/meetings/${meeting.id}/upload`}
                                    className="upload-btn"
                                >
                                    Upload Recording
                                </Link>


                                <button
                                    type="button"
                                    className="delete-btn"
                                    onClick={() =>
                                        handleDelete(
                                            meeting.id
                                        )
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

    </Layout>
);


}

export default Meetings;
