"use client";


export default function sessionStart({ onStart }) {
    return (
        <div>
            <h2>Welcome to AI Interview Coach</h2>
            <p>Ready to boost your confidence through practice?</p>
            <button onClick={onStart}>
                Start Mock Interview
            </button>
        </div>
    )
}