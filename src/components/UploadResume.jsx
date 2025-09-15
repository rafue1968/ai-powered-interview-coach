import axios from "axios";
import { useState, useRef, useEffect } from "react";


export default function UploadResume({ onComplete, skipIfExists}){
    const fileInputRef = useRef(null);
    const [error, setError] = useState("");
    const [file, setFile] = useState(null);
    const [summary, setSummary] = useState("");
    const [uploading, setUploading] = useState(false);


    useEffect(() => {
        if (skipIfExists) {
            onComplete(skipIfExists);
        }
    }, [skipIfExists, onComplete]);

    const handleFileUpload = async (e) => {
        e.preventDefault();
        setError("");
        setUploading(true);
        setSummary("");


        if (!file){ 
            setError("Please select a file first");
            setUploading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await axios.post("/api/summarise-resume", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });

            const data = res.data;
            setSummary(data.summary);
            onComplete(data.summary);
        } catch (err) {
            setError("Sorry. An Error occurred when processing your Resume.");
        } finally {
            setUploading(false);
        }

    };
    
    return (
        <div className="center-screen">
            <div className="upload-container">
                <h2 className="upload-title">Upload your Resume (PDF only)</h2>
                <form onSubmit={handleFileUpload} className="upload-form" >
                    <input
                        type="file"
                        accept=".pdf"
                        ref={fileInputRef}
                        onChange={(e) => {
                            const selectedFile = e.target.files[0];
                            if (selectedFile?.type !== "application/pdf"){
                                setError("Only PDF resumes are accepted.");
                                setFile(null);
                            } else {
                                setError("");
                                setFile(selectedFile);
                            }
                        }}
                        placeholder="Click here to Upload your PDF File"
                        required
                        className="upload-input"
                        style={{
                            color: "gray",
                        }}
                    />
                    <button type="submit" disabled={uploading} className="upload-button">
                        {uploading ? "Uploading" : "Upload and Summarise"}
                    </button>
                </form>

                {uploading && <p className="upload-status">Uploading and extracting text<span className="dots"></span></p>}
                {error && <p className="upload-error">{error}</p>}
                
            </div>
        </div>
    )

}