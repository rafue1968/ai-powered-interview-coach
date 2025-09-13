"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function InstructionsPopup() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <motion.button layoutId="popup" onClick={() => setIsOpen(true)} className="instructionsButton">
        Need Help? Click here for Instructions
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="instructionsInteface"
            >
                <h1 style={{fontSize: "30px", textAlign: "center"}}>Instructions</h1>
              <h1 style={{ fontSize: "20px" }}>1. Register / Login</h1>
              <ul>
                <li>Go to the <strong>Login</strong> or <strong>Register</strong> page.</li>
                <li>If you’re new, create an account with your email and password</li>
                <li>
                  Once logged in or registered, you’ll be redirected to the
                  <em>Interview Sessions</em> page.
                </li>
              </ul>

              <h1 style={{ fontSize: "20px" }}>2. Interview Sessions Interface</h1>
              <ul>
                <li>
                  On this page, this is where you can create interview sessions or select an existing session.
                </li>
                <li>
                  As a user, you can:
                  <ul>
                    <li>
                      <strong>Create an new interview session:</strong> Provide a session name and select an interview type (<em>Type job role manually or insert a resume</em>). Then click the <strong>'Create New Interview Session'</strong> button.
                    </li>
                    <li>
                      <strong>Select an existing session:</strong> Continue from where you left off.
                    </li>
                  </ul>
                </li>
              </ul>

              <h1 style={{ fontSize: "20px" }}>
                3. Entering a Job Role or Insert a PDF Resume file
              </h1>
              <p>Depending on the <em>interview session type</em> you chose:</p>
              <ul>
                <li>
                  <strong>Resume Mode:</strong>
                  <ul>
                    <li>Upload your PDF resume file (<em>Please note this system can only accept PDF files unfortunately.</em>).</li>
                    <li>The system will generate a summary of your resume to use during the interview.</li>
                  </ul>
                </li>
                <li>
                  <strong>Job Role Mode:</strong>
                  <ul>
                    <li>Enter the job role you want to practice for (<em>e.g., Software Engineer, Project Manager, Economist</em>).</li>
                    <li>The system will use this role to generate AI responses that align with this job role.</li>
                  </ul>
                </li>
              </ul>

              <h1 style={{ fontSize: "20px" }}>4. Chat Interface</h1>
              <p>Once your resume or job role is set:</p>
              <ul>
                <li>You'll enter the <strong>Interview Chat</strong> page.</li>
                <li>
                  Here you can:
                  <ul>
                    <li>Chat with the AI Interviewer in real-time (<em>Please note: some responses may experience delays.</em>)</li>
                    <li>Answer interview messages from the AI and receive responses.</li>
                    <li>
                      Optionally use voice input (if enabled) and play <strong>audio output</strong> for a more natural experience (<em>Please note: the voice input may not catch every word you say correctly</em>)
                    </li>
                  </ul>
                </li>
              </ul>

              <h1 style={{ fontSize: "20px" }}>5. Return to Interview Sessions Interface</h1>
              <ul>
                <li>
                  At any time, you can return to the <strong>Interview Sessions page</strong> by clicking
                  <strong>"Return to Interview Sessions page"</strong> button.
                </li>
                <li>
                  This lets you start new sessions, review old ones, or continue where you left off.
                </li>
              </ul>

              <h2 style={{ fontSize: "18px" }}>6. What the AI does:</h2>
                <ul>
                    <li>Provides detailed <strong>STAR feedback</strong> (Situation, Task, Action, Result) on your answers.</li>
                    <li>Gives <strong>role-specific guidance</strong> based on your <em>job role</em> or <em>resume</em>.</li>
                    <li>Asks <strong>follow-up questions</strong> to keep the conversation flowing naturally.</li>
                    <li>Adjusts its <strong>tone</strong> based on your emotional state: Motivator, Strategist, or Interviewer.</li>
                    <li>Encourages a realistic, dialogic interview experience, helping you practice for real job interviews.</li>
                </ul>

              <button className="closeInstructionPopup" onClick={() => setIsOpen(false) }>Close</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
