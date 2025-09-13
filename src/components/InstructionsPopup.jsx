"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function InstructionsPopup() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <motion.button
        layoutId="popup"
        onClick={() => setIsOpen(true)}
        className="instructionsButton"
      >
        Need Help? Click here for Detailed Instructions
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
              <h1 style={{ fontSize: "28px", textAlign: "center", marginBottom: "1rem" }}>
                Welcome to AI Interview Coach
              </h1>
              <p style={{ fontSize: "16px", marginBottom: "1rem" }}>
                AI Interview Coach is designed to help jobseekers practice and improve their interview skills. 
                You can simulate realistic interview sessions by entering a job role or uploading your resume. 
                The AI provides personalized guidance, follow-up questions, and feedback to help you prepare 
                confidently for real interviews.
              </p>
              <p style={{ fontSize: "16px", marginBottom: "2rem" }}>
                The AI also evaluates the emotional tone of your responses using sentiment analysis and adapts 
                its feedback accordingly, helping you reflect and improve your communication skills.
              </p>

              <h1 style={{ fontSize: "24px", textAlign: "center", marginBottom: "1rem" }}>Instructions</h1>

              <h2 style={{ fontSize: "20px" }}>1. Register / Login</h2>
              <p>This step ensures you have a personal space to save and manage your interview sessions.</p>
              <ul>
                <li>Go to the <strong>Login</strong> or <strong>Register</strong> page.</li>
                <li>If new, create an account with your email and password.</li>
                <li>Once logged in or registered, you'll be redirected to the <em>Interview Sessions</em> page.</li>
              </ul>

              <h2 style={{ fontSize: "20px" }}>2. Interview Sessions Interface</h2>
              <p>Here, you can start new sessions or continue existing ones.</p>
              <ul>
                <li>
                  <strong>Create a new interview session:</strong> Provide a session name and select an interview type 
                  (<em>Job Role or Resume</em>). Then click <strong>'Create New Interview Session'</strong>.
                </li>
                <li>
                  <strong>Select an existing session:</strong> Continue where you left off.
                </li>
              </ul>

              <h2 style={{ fontSize: "20px" }}>3. Enter Job Role or Upload Resume</h2>
              <p>Depending on the session type:</p>
              <ul>
                <li>
                  <strong>Resume Mode:</strong> Upload your PDF resume (only PDF files supported). 
                  The system will summarize your resume for interview use.
                </li>
                <li>
                  <strong>Job Role Mode:</strong> Enter your target job role (e.g., Software Engineer). 
                  AI responses will align with this role.
                </li>
              </ul>

              <h2 style={{ fontSize: "20px" }}>4. Interview Chat</h2>
              <p>Once your role or resume is set, you enter the chat interface:</p>
              <ul>
                <li>Chat with the AI interviewer in real-time (<em>some responses may be delayed).</em></li>
                <li>Receive feedback, role-specific guidance, and follow-up questions.</li>
                <li>Optionally use voice input and audio output (voice input may not capture all words correctly).</li>
              </ul>

              <h2 style={{ fontSize: "20px" }}>5. Returning to Interview Sessions</h2>
              <ul>
                <li>Return to the <strong>Interview Sessions page</strong> anytime using the button provided.</li>
                <li>This allows you to start new sessions, review old ones, or continue an ongoing session.</li>
              </ul>

              <h2 style={{ fontSize: "20px" }}>6. AI Features</h2>
              <ul>
                <li>Provides detailed <strong>STAR feedback</strong> (Situation, Task, Action, Result).</li>
                <li>Offers <strong>role-specific guidance</strong> based on your job role or resume.</li>
                <li>Generates follow-up questions to simulate a realistic interview.</li>
                <li>Adapts tone according to your emotional state detected via sentiment analysis.</li>
                <li>Encourages dialogic, interactive practice to boost confidence and communication skills.</li>
              </ul>

              <button 
                className="closeInstructionPopup" 
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
