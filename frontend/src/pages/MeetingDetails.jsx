
import { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import Layout from "../components/Layout";

import {
    getMeeting,
    getParticipants,
    addParticipant,
    deleteParticipant
} from "../services/api";


function MeetingDetails() {

    const { id } = useParams();

    const [meeting, setMeeting] = useState(null);
    const [participants, setParticipants] = useState([]);
    const navigate = useNavigate();  
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        loadMeeting();

        loadParticipants();

    }, [id]);


    async function loadMeeting() {

        try {

            const data = await getMeeting(id);

            setMeeting(data);

        } catch (err) {

            setError(err.message);

        }

    }


    async function loadParticipants() {

        try {

            const data = await getParticipants(id);

            setParticipants(data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    }


    async function handleAddParticipant(event) {

        event.preventDefault();

        if (!name.trim()) {
            return;
        }

        try {

            const participant = await addParticipant(
                id,
                name,
                email
            );

            setParticipants([
                ...participants,
                participant
            ]);

            setName("");
            setEmail("");

        } catch (err) {

            alert(err.message);

        }

    }


    async function handleDeleteParticipant(participantId) {

        const confirmed = window.confirm(
            "Delete this participant?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await deleteParticipant(participantId);

            setParticipants(
                participants.filter(
                    participant =>
                        participant.id !== participantId
                )
            );

        } catch (err) {

            alert(err.message);

        }

    }


    if (loading) {

        return (
            <Layout title="Meeting">
                <div className="empty-card">
                    Loading meeting...
                </div>
            </Layout>
        );

    }


    if (!meeting) {

        return (
            <Layout title="Meeting">
                <div className="error-card">
                    {error || "Meeting not found"}
                </div>
            </Layout>
        );

    }


    return (

        <Layout
            title={meeting.title}
            subtitle="AI-powered meeting analysis"
        >

            <div className="meeting-details-page">

                <div className="meeting-info-card">

                    <h2>
                        {meeting.title}
                    </h2>

                    <p>
                        {meeting.description ||
                            "No description provided."}
                    </p>

                    <div className="meeting-detail-meta">

                        <span>
                            📅{" "}
                            {meeting.meeting_date
                                ? new Date(
                                    meeting.meeting_date
                                ).toLocaleString()
                                : "No date"}
                        </span>

                        <span>
                            🤖{" "}
                            {meeting.status || "created"}
                        </span>
<div className="meeting-actions">

    <button
        className="primary-btn"
        onClick={() =>
            navigate(`/meetings/${id}/upload`)
        }
    >
        Upload Meeting Recording
    </button>

</div>
                    </div>

                </div>


                <div className="details-section">

                    <div className="section-heading">

                        <div>
                            <h2>Participants</h2>

                            <p>
                                People involved in this meeting
                            </p>
                        </div>

                    </div>


                    <div className="participants-list">

                        {participants.length === 0 && (

                            <div className="empty-small">
                                No participants added yet.
                            </div>

                        )}


                        {participants.map(
                            (participant) => (

                            <div
                                className="participant-row"
                                key={participant.id}
                            >

                                 <div className="participant-avatar">
                                     {(participant.name || "P").charAt(0).toUpperCase()}
                                 </div>

                                <div className="participant-info">

                                    <strong>
                                      {participant.name || "Unknown Participant"}
                                    </strong>

                                    <span>
                                        {participant.email ||
                                            "No email provided"}
                                    </span>

                                </div>

                                <button
                                    className="delete-btn"
                                    onClick={() =>
                                        handleDeleteParticipant(
                                            participant.id
                                        )
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        ))}

                    </div>


                    <form
                        className="participant-form"
                        onSubmit={handleAddParticipant}
                    >

                        <input
                            type="text"
                            placeholder="Participant name"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            required
                        />

                        <input
                            type="email"
                            placeholder="Email (optional)"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                        />

                        <button
                            type="submit"
                            className="primary-btn"
                        >
                            + Add Participant
                        </button>

                    </form>

                </div>
                



                
{/* =========================
    TRANSCRIPT
========================= */}

<div className="details-section">

    <div className="section-heading">

        <div>
            <h2>Transcript</h2>

            <p>
                Exact transcript of what was said in the meeting
            </p>
        </div>

    </div>

    <div className="transcription-box">

        {meeting.transcription
            ? meeting.transcription
            : "Transcript is not available yet."}

    </div>

</div>


{/* =========================
    EXECUTIVE SUMMARY
========================= */}

<div className="details-section">

    <div className="section-heading">

        <div>
            <h2>Executive Summary</h2>

            <p>
                AI-generated overview of the meeting
            </p>
        </div>

    </div>

    <div className="summary-card">

        {meeting.summary
            ? meeting.summary
            : "AI summary is not available yet."}

    </div>

</div>



              

            </div>
            

        </Layout>
          
    );
}


export default MeetingDetails;

