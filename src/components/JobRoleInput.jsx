"use client";

import { useEffect, useState } from "react";

export default function JobRoleInput({onComplete, skipIfExists}){
    
    useEffect(() => {
        if (skipIfExists) {
            onComplete(skipIfExists);
        }
    }, [skipIfExists, onComplete]);
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const input = e.target.elements.jobRole.value.trim();
        if(!input) return;
        onComplete(input);
    };

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
                        placeholder="e.g. Software Engineer, Project Manager, Scientist etc."
                    />
                    <button type="submit" className="jobrole-button">
                        Start
                    </button>
                </form>
            </div>
        </div>
    );
}