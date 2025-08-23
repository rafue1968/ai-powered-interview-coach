"use client";

import SessionFormField from "./SessionFormField"


export default function SessionsList({sessions = [], createSession, selectSessionID}){
    
    if (sessions.length === 0){
        return (
            <div>
                <p>No sessions recorded.</p>
                <SessionFormField createSession={createSession} />
            </div>
        )
    }
    
    
    return (
        <>
            <div>
                <h3>Do you wish to start a new session?</h3>
                <SessionFormField createSession={createSession} />

                <h3>Or choose the sessions you have already done below?</h3>
                <ul>
                    {sessions.map((session)=> (
                        <li key={session.id}>
                            <button style={{marginBottom: "20px"}} onClick={() => selectSessionID(session.id, session.interviewType)}>
                                {session.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}