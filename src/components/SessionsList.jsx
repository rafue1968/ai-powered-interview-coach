"use client";

import SessionFormField from "./SessionFormField";

export default function SessionsList({ sessions = [], createSession, selectSessionID }) {
  if (sessions.length === 0) {
    return (
      <div className="sessions-container">
        <p className="sessions-empty">No sessions recorded.</p>
        <SessionFormField createSession={createSession} />
      </div>
    );
  }

  return (
    <div className="sessions-container">
      <div className="sessions-section">
        <h3 className="sessions-heading">Do you wish to start a new interview session?</h3>
        <SessionFormField createSession={createSession} />
      </div>

      <div className="sessions-section">
        <h3 className="sessions-heading">Or choose from your previous sessions:</h3>
        <ul className="sessions-list">
          {sessions.map((session) => (
            <li key={session.id} className="sessions-item">
              <button
                  className="session-button"
                  onClick={() => selectSessionID(session.id)}
              >
                {session.name} ({session.interviewType})
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
