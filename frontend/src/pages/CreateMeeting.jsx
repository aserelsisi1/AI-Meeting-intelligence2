import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { createMeeting } from "../services/api";

function CreateMeeting() {


const navigate = useNavigate();

const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [meetingDate, setMeetingDate] = useState("");

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");


async function handleSubmit(event) {

    event.preventDefault();

    setError("");
    setLoading(true);

    try {

        const meeting = await createMeeting({
            title: title,
            description: description,
            meeting_date: meetingDate
        });

        navigate(
            `/meetings/${meeting.id}/upload`
        );

    } catch (err) {

        setError(
            err.message ||
            "Failed to create meeting."
        );

    } finally {

        setLoading(false);

    }
}


return (

    <Layout
        title="New Meeting"
        subtitle="Create a meeting before uploading its recording"
    >

        <div className="page-content">

            <div className="create-meeting-page">


                {/* PAGE INTRO */}

                <div className="create-meeting-intro">

                    <h2>
                        Create New Meeting
                    </h2>

                    <p>
                        Add a meeting to your workspace and
                        keep its recording, transcript and
                        AI-generated insights organized.
                    </p>

                </div>


                {/* MAIN FORM */}

                <div className="create-meeting-card">


                    {/* FORM HEADER */}

                    <div className="create-meeting-header">

                        <div className="create-meeting-header-icon">
                            +
                        </div>

                        <div>

                            <h3>
                                Meeting Information
                            </h3>

                            <p>
                                Enter the basic details about
                                your meeting.
                            </p>

                        </div>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="create-meeting-error">

                            {error}

                        </div>

                    )}


                    <form
                        onSubmit={handleSubmit}
                    >


                        {/* TITLE */}

                        <div className="meeting-form-group">

                            <label>
                                Meeting Title
                                <span>*</span>
                            </label>

                            <input
                                type="text"
                                placeholder="e.g. AI Project Discussion"
                                value={title}
                                onChange={(event) =>
                                    setTitle(
                                        event.target.value
                                    )
                                }
                                required
                            />

                            <small className="meeting-helper">
                                Give your meeting a clear
                                and recognizable name.
                            </small>

                        </div>


                        {/* DESCRIPTION */}

                        <div className="meeting-form-group">

                            <label>
                                Description
                            </label>

                            <textarea
                                placeholder="Briefly describe what this meeting is about..."
                                value={description}
                                onChange={(event) =>
                                    setDescription(
                                        event.target.value
                                    )
                                }
                            />

                            <small className="meeting-helper">
                                You can add the meeting topic,
                                purpose or any useful context.
                            </small>

                        </div>


                        {/* DATE */}

                        <div className="meeting-form-row">

                            <div className="meeting-form-group">

                                <label>
                                    Meeting Date & Time
                                    <span>*</span>
                                </label>

                                <input
                                    type="datetime-local"
                                    value={meetingDate}
                                    onChange={(event) =>
                                        setMeetingDate(
                                            event.target.value
                                        )
                                    }
                                    required
                                />

                                <small className="meeting-helper">
                                    Select when the meeting
                                    took place.
                                </small>

                            </div>

                        </div>


                        {/* ACTIONS */}

                        <div className="create-meeting-footer">

                            <button
                                type="button"
                                className="create-cancel-btn"
                                onClick={() =>
                                    navigate("/meetings")
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="create-meeting-btn"
                                disabled={loading}
                            >

                                {loading
                                    ? "Creating Meeting..."
                                    : "Create Meeting"}

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    </Layout>

);


}

export default CreateMeeting;
