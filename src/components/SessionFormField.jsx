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
        <form onSubmit={handleSubmit}>
            <label>Session Name:</label>
            <input 
                type="text" 
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="Enter session name"
             />

             <label>Please select input type:</label>
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="">Select Mode</option>
                <option value="jobrole">Type Job Role Manually</option>
                <option value="resume">Upload Resume</option>
            </select>

            <button type="submit">Create New Session</button>
        </form>
    )
}