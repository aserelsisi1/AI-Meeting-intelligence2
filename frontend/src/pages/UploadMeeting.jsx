
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Layout from "../components/Layout";

import { uploadMeeting } from "../services/api";


function UploadMeeting() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    function handleFileChange(event) {

        const selectedFile = event.target.files[0];

        if (!selectedFile) {
            return;
        }

        setFile(selectedFile);

        setError("");

        setSuccess("");
    }


    async function handleUpload(event) {

        event.preventDefault();

        if (!file) {

            setError(
                "Please select an audio or video file."
            );

            return;
        }


        try {

            setLoading(true);

            setError("");

            setSuccess("");


            const data = await uploadMeeting(
                id,
                file
            );


            console.log(
                "UPLOAD RESPONSE:",
                data
            );


            setSuccess(
                "Meeting uploaded and processed successfully!"
            );


            setTimeout(() => {

                navigate(
                    `/meetings/${id}`
                );

            }, 1500);


        } catch (err) {

            console.error(
                "UPLOAD ERROR:",
                err
            );

            setError(
                err.message ||
                "Upload failed."
            );

        } finally {

            setLoading(false);

        }

    }


    return (

        <Layout
            title="Upload Meeting"
            subtitle="Upload your meeting recording for AI analysis"
        >

            <div className="upload-meeting-page">

                <div className="upload-card">

                    <div className="upload-card-header">

                        <div>

                            <h2>
                                Upload Meeting Recording
                            </h2>

                            <p>
                                Upload an audio or video recording.
                                The system will calculate the duration,
                                generate the transcript and create an
                                AI-powered summary.
                            </p>

                        </div>

                    </div>


                    <form
                        onSubmit={handleUpload}
                        className="upload-form"
                    >

                        <div className="upload-controls">

                            {/* FILE SELECTOR */}

                            <div className="file-input-container">

                                <label>
                                    Select Audio / Video File
                                </label>

                                <input
                                    type="file"
                                    accept="audio/*,video/mp4"
                                    onChange={handleFileChange}
                                />

                            </div>


                            {/* UPLOAD BUTTON */}

                            <button
                                type="submit"
                                className="primary-btn upload-process-btn"
                                disabled={loading}
                            >

                                {loading
                                    ? "Processing Meeting..."
                                    : "Upload & Process Meeting"
                                }

                            </button>

                        </div>


                        {/* SELECTED FILE */}

                        {file && (

                            <div className="selected-file">

                                <div className="selected-file-icon">
                                    🎵
                                </div>

                                <div className="selected-file-content">

                                    <strong>
                                        Selected file
                                    </strong>

                                    <span>
                                        {file.name}
                                    </span>

                                </div>

                            </div>

                        )}


                        {/* ERROR */}

                        {error && (

                            <div className="upload-error">

                                {error}

                            </div>

                        )}


                        {/* SUCCESS */}

                        {success && (

                            <div className="upload-success">

                                {success}

                            </div>

                        )}

                    </form>

                </div>

            </div>

        </Layout>

    );

}


export default UploadMeeting;

