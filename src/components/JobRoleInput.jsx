"use client";

import { useState } from "react";

export default function JobRoleInput({setJobRole, onComplete}){
    const handleSubmit = (e) => {
        const input = e.target.elements.jobRole.value.trim();
        if (input){
            setJobRole(input);
            onComplete();
        }
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