# AI-Powered Interview Coach

AI-Powered Interview Coach is a web application that helps jobseekers practice and improve their interview skills through personalized AI-driven feedback. Users can simulate behavioral interviews by providing a job role or uploading their resume. The AI evaluates their responses, provides STAR feedback, role-specific tips, and generates follow-up questions.


---


## Features
- **Mock Behavioral Interviews**
    - Receive real-time AI feedback on answers.
    - STAR-based evaluation (Situation, Task, Action, Result).
- **Role-Specific Guidance**
    - Feedback is tailored to the user’s target job role or resume content.
- **Sentiment-Adaptive Feedback**
    - AI adjusts its tone based on the emotional sentiment of user responses.
- **Interview Session Management**
    - Create, track, and resume multiple interview sessions.
- **Voice Input and Audio Output**
    - Speak answers directly and receive AI responses via text-to-speech.
- **Resume Summarization**
    - Upload PDF resumes; AI extracts key information for interview preparation.

---


## Tech Stack
- **Frontend:** React, Next.js 13, Tailwind CSS, Framer Motion
- **Backend:** Next.js API Routes, Node.js
- **Database:** Firebase Firestore, Firebase Authentication
- **AI Services:**
    - Google Gemini API (Generative AI for responses)
    - Flask-Based Vader Sentiment Analysis API (for emotional tone analysis)
- **TTS:** Azure Text-to-Speech (TTS) API
- **PDF Parsing:** pdf-parse


---

## Getting Started

### Prerequisites
- Node.js >= 18
- Firebase project with Firestore and Authentication enabled
- Google Gemini API key
- Azure Text-To-Speech (TTS) API key

### Environment Variables
Create a ```.env``` file in your project root:
```bash
# Firebase Admin
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="your_private_key"
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_CERT_URL=your_client_cert_url

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key

# Azure TTS
AZURE_TTS_KEY=your_azure_tts_key
AZURE_TTS_REGION=your_azure_region
```

Note: Ensure FIREBASE_PRIVATE_KEY preserves newline characters. You may need .replace(/\\n/g, '\n') when loading in code.

### Install Dependencies
```bash
npm install
# or
yarn install
```

### Run Locally
```bash
npm run dev
# or
yarn dev
```

The app should now be available at ```http://localhost:3000```.

---

## Project Structure
- ```/components``` - Modular/Reusable React components (chat, dictaphone, session forms, etc.)
- ```/lib``` - Firebase client & admin SDK initialization
- ```/pages/api``` - API endpoints for Gemini, TTS, and resume summarization
- ```/utils``` - Utility functions (prompt construction, sentiment analysis)
- ```/app``` - Next.js pages and client-side logic


---


## Usage
1. **Sign Up / Login**
Create an account to store your sessions securely.
2. **Create Interview Session**
- Provide a session name.
- Choose input type: Job Role or Resume.
3. **Provide Input**
- Enter the job role manually or upload a PDF resume.
4. **Start Interview Chat**
- Type or speak your answers.
- Receive AI STAR feedback, role-specific tips, and follow-up questions.
5. **Return to Sessions**
- Resume any session at any time.
- Start new sessions for additional practice.

---

## AI Interaction Flow
1. User submits a message.
2. Sentiment analysis API evaluates emotional tone.
3. Gemini API generates a response using the custom STAR feedback prompt.
4. Response is stored in Firestore under the current interview session.
5. Audio TTS is generated if voice output is enabled.


---


## Limitations / Known Issues
- AI feedback may sometimes misinterpret context or nuances in responses.
- Voice recognition (voice input) accuracy depends on background noise and microphone quality.
- Resume parsing may miss formatting details in complex PDF layouts. On some deployments, resume processing may not work properly even if it works locally.
- Internet connection is required for all AI and Text-To-Speech services.
- Free API quotas may limit usage during extended testing.


---

## Contributing
1. Fork the repository
2. Create a feature branch (```git checkout -b feature/your-feature```).
3. Commit your changes (```git commit -m "Add feature"```).
4. Push to the branch (```git push origin feature/your-feature```).
5. Open a pull request.

---

## License
This project is licensed under the MIT License.
You are free to use, modify, and distribute it with attribution.