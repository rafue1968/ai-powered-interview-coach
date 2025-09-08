"use client";

import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function JobRoleInput({setJobRole, onComplete, sessionsRef, selectedSessionID, skipIfExists}){
    
    useEffect(() => {
        if (skipIfExists) {
            onComplete();
        }
    }, [skipIfExists])
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const input = e.target.elements.jobRole.value.trim();
        
        if(!input) return;
        
        setJobRole(input);

        const sessionDocRef = doc(sessionsRef, selectedSessionID);
        await updateDoc(sessionDocRef, {
            jobRole: input,
            step: "ready"
        })

        onComplete();
        
    }

    return (
        <div className="center-screen">
            <div className="jobrole-container">
                <form onSubmit={handleSubmit} className="jobrole-form">
                    <label htmlFor="jobRole" className="jobrole-label">
                        Enter your job role:
                    </label>
                    <input 
                        type="text"
                        name="jobRole"
                        required
                        className="jobrole-input"
                        placeholder="e.g., Software Engineer"
                    />
                    <button type="submit" className="jobrole-button">
                        Start
                    </button>
                </form>
            </div>
        </div>
    );
}