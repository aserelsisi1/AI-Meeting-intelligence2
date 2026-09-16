import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { getMeetings } from "../services/api";

function Dashboard() {


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


function formatDate(date) {

    if (!date) {
        return "No date";
    }

    return new Date(date).toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );
}


function formatDuration(seconds) {

    if (!seconds) {
        return "Duration not available";
    }

    const hours = Math.floor(seconds / 3600);

    const minutes = Math.floor(
        (seconds % 3600) / 60
    );

    const remainingSeconds =
        seconds % 60;


    if (hours > 0) {

        return `${hours}h ${minutes}m ${remainingSeconds}s`;

    }


    if (minutes > 0) {

        return `${minutes}m ${remainingSeconds}s`;

    }


    return `${remainingSeconds}s`;
}


return (

    <Layout
        title="Dashboard"
        subtitle="Overview of your AI-powered meetings"
    >

        <div className="dashboard-header">

            <div>
                <h2>My Meetings</h2>

                <p>
                    Manage and analyze your recorded meetings.
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
                Loading meetings...
            </div>

        )}


        {error && (

            <div className="error-card">
                {error}
            </div>

        )}


        {!loading && !error && meetings.length === 0 && (

            <div className="empty-card">

                <div className="empty-icon">
                    🎙
                </div>

                <h3>
                    No meetings yet
                </h3>

                <p>
                    Create your first meeting to start using
                    AI Meeting Intelligence.
                </p>

                <Link
                    to="/meetings/create"
                    className="primary-btn"
                >
                    Create Meeting
                </Link>

            </div>

        )}


        {!loading && !error && meetings.length > 0 && (

            <div className="dashboard-meetings">

                {meetings.map((meeting) => (

                    <div
                        className="dashboard-meeting-card"
                        key={meeting.id}
                    >

                        <div className="dashboard-card-header">

                            <div>

                                <h3>
                                    {meeting.title}
                                </h3>

                                <p>
                                    {meeting.description ||
                                        "No description provided."}
                                </p>

                            </div>


                            <span
                                className={`status-badge ${meeting.status || "created"}`}
                            >
                                {meeting.status || "Created"}
                            </span>

                        </div>


                        <div className="dashboard-meeting-info">

                            <div className="info-item">

                                <span className="info-label">
                                    📅 Date
                                </span>

                                <strong>
                                    {formatDate(
                                        meeting.meeting_date
                                    )}
                                </strong>

                            </div>


                            <div className="info-item">

                                <span className="info-label">
                                    ⏱ Duration
                                </span>

                                <strong>
                                    {formatDuration(
                                        meeting.duration
                                    )}
                                </strong>
                                
                            </div>


                            <div className="info-item">

                                <span className="info-label">
                                    👥 Participants
                                </span>

                                <strong>
                                    {meeting.participants
                                        ? meeting.participants.length
                                        : 0}
                                </strong>

                            </div>


                            <div className="info-item">

                                <span className="info-label">
                                    🤖 AI Analysis
                                </span>

                                <strong>
                                    {meeting.summary
                                        ? "Ready"
                                        : "Pending"}
                                </strong>

                            </div>

                        </div>


                        <div className="dashboard-card-footer">

                            <div className="meeting-file">

                                {meeting.file_name ? (

                                    <span>
                                        🎵 {meeting.file_name}
                                    </span>

                                ) : (

                                    <span>
                                        No recording uploaded
                                    </span>

                                )}

                            </div>


                            <Link
                                to={`/meetings/${meeting.id}`}
                                className="view-btn"
                            >
                                View Meeting
                            </Link>

                        </div>

                    </div>

                ))}

            </div>

        )}

    </Layout>
);


}

export default Dashboard;
