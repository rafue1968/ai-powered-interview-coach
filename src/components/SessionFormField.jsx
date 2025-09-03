"use client";

import { useState } from "react";

export default function SessionFormField({createSession}){
    const [sessionName, setSessionName] = useState("");
    const [mode, setMode] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!sessionName.trim() && !mode) return;
        createSession(sessionName, mode)
        setSessionName("");
        setMode("");
    }
    
    return (
        <form className="session-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="form-label">Interview Session Name:</label>
                <input 
                    type="text" 
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    placeholder="Enter Interview Session Name"
                    className="form-input"
                    required
                />
            </div>

            <div className="form-group">
                <label className="form-label">Please select input type you would like to start with:</label>
                <select value={mode} onChange={(e) => setMode(e.target.value)} className="form-select" required>
                    <option value="">Select Interview Mode</option>
                    <option value="jobrole">Type Job Role Manually</option>
                    <option value="resume">Upload Resume</option>
                </select>
            </div>

            <button type="submit" className="form-button">Create New Interview Session</button>
        </form>
    )
}