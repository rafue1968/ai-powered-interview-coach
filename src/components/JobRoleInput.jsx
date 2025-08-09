"use client";

import { useState } from "react";

export default function JobRoleInput({setJobRole, onComplete}){
    const handleSubmit = (e) => {
        e.preventDefault();
        const input = e.target.elements.jobRole.value.trim();
        if (input){
            setJobRole(input);
            onComplete();
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Enter your job role:</label>
                <input 
                    type="text"
                    name="jobRole"
                    required
                />
                <button type="submit">Start</button>
            </form>
        </div>
    );
}