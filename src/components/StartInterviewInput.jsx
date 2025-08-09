"use client";

export default function StartInterviewInput({setMode}){
    return (
        <div>
            <p>Hey there! I'm your friendly AI interview buddy. Want to practice with your resume or a job role?</p>
            <button onClick={() => setMode("resume")}>Upload Resume</button>
            <button onClick={() => setMode("jobrole")}>Type Job Role</button>
        </div>
    )
}