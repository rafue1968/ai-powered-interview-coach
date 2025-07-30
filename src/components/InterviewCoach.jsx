import axios from "axios";
import React, {useEffect, useRef, useState} from "react";
import Loading from "../components/Loading";
import { auth } from "../lib/firebaseClient.js";

export default function InterviewCoach(){
    const [jobRole, setJobRole] = useState('');
    const [initialQuestion, setInitialQuestion] = useState('');
    const [currentUserAnswer, setCurrentUserAnswer] = useState('');
    const [conversationHistory, setConversationHistory] = useState([])
    const [currentAIResponse, setCurrentAIResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);
    const [currentConversationId, setCurrentConversationId] = useState(null);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if(user) {
                setUserId(user.uid);
                console.log("Firebase Auth: User is logged in! UID:", user.uid);
            } else {
                setUserId(null);
                console.log("Firebase Auth: No user is logged in.");
                setConversationHistory([]);
                setCurrentConversationId(null);
                setInitialQuestion('');
                setCurrentUserAnswer('')
                setCurrentAIResponse('')
                setError('');
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [conversationHistory, currentAIResponse, loading]);

    const addMessageToHistory = (role, text) => {
        setConversationHistory(prevHistory => [
            ...prevHistory,
            { role, parts: [{text}] }
        ]);
    };

    const generateQuestion = async () => {
        setLoading(true);
        setError('');
        setInitialQuestion('');
        setCurrentUserAnswer('');
        setCurrentAIResponse('');
        setConversationHistory([]);

        if (!jobRole.trim()) {
            setError("Please enter a job role.");
            setLoading(false);
            return;
        }

        if (!userId) {
            setError("Please log in to start an interview session.");
            setLoading(false);
            return;
        }

        const newConversationId = `interview-${Date.now()}-${Math.random().toString(36).substring(2,9)}`;
        setCurrentConversationId(newConversationId);
        setConversationHistory([]);

        try {
            console.log("Calling Gemini API to generate question...")
            // const userPrompt = `Generate one behavioural interview question for a jobseeker applying to be a ${jobRole}.`;
            // const userPrompt = `Please generate a single behavioural interview question suitable for a job candidate applying to be a ${jobRole}. Format your output as plain text, no preamble or explanation.`;

            const userPrompt = `You are an AI interview coach for a ${jobRole}. Please generate one initial behavioral interview question for this role. Format it as a clear question, no preamble or explanation.`;

            const response = await axios.post("/api/gemini", { 
                messages: [],
                latestUserMessage: {role: "user", parts: [{text: userPrompt}]},
                latestRawUserMessage: {role: "user", parts: [{text: jobRole }]},
                type: "initial_question_generation",
                jobRole: jobRole,
                userId: userId,
                conversationId: newConversationId
            });

            const data = response.data;

            if (data?.question){
                console.log("Gemini Initial Question Response:", data.question);
                setInitialQuestion(data.question.trim());
                addMessageToHistory('model', data.question.trim());
            } else {
                console.error("No result in question response:", data);
                setError("Sorry, I couldn't generate an initial question right now. Please try again.");
                // setQuestion("Sorry, I couldn't generate a question right now.");
            }

        } catch (error) {
            console.error("Error calling Gemini API for initial question:", error.response?.data || error.message);
            setError(error.response?.data?.error || "An error occurred while generating the initial question.");
            // setQuestion("Sorry, I couldn't generate a question right now.");
        } finally {
            setLoading(false);
        }
    };

    const handleUserMessage = async (messageText, messageType) => {
        // setLoading(true);
        // const fakeFeedback = `Great enthusiasm! Try to back it up with a personal experience.`;
        // setFeedback(fakeFeedback);
        // setLoading(false);

        if (!userId || !currentConversationId) {
            setError("Please log in and start an interview session first.");
            console.warn("Blocked message send: missing userId or conversationId", { userId, currentConversationId });
            setLoading(false);
            return;
        }


        setLoading(true);
        setError('');
        setCurrentAIResponse('');

        if (!userId || !currentConversationId) {
            setError("Please log in and start an interview session first.");
            setLoading(false);
            return;
        }

        if (!messageText.trim()){
            setError("Please provide input.");
            setLoading(false);
            return;
        }

        const newUserMessage = { role: 'user', parts: [{ text: messageText }]};
        addMessageToHistory('user', messageText);

        // let promptForGemini = messageText;

        try {
            console.log("Calling API to submit answer for feedback...");
            
            // const feedbackPrompt = `You are an AI interview coach. A candidate is applying for the role of ${jobRole}. They were asked: "${question}" and they answered: "${answer}". Provide concise, constructive feedback to help them improve. Focus on clarity, relevance, structure (e.g., STAR method if applicable), and confidence.`;

            let userPrompt = messageText;

            if (messageType === "answer_submission"){
                userPrompt = `My answer to the question "${initialQuestion}" is: "${messageText}". Provide concise, constructive feedback on this answer for a ${jobRole} role, and if appropriate, ask a follow-up question.`;
            } else if (messageType === "follow_up_user_question"){
                userPrompt = `My follow-up question or comment is: "${messageText}". Please respond in the context of the interview.`;
            }

            const messageforGeminiHistory = {role: 'user', parts: [{text: userPrompt}]};
            const messageForFirestoreHistory = {role: 'user', parts: [{text: messageText}]};

            const response = await axios.post("/api/gemini", {
                messages: [...conversationHistory, newUserMessage],
                latestUserMessage: { role: 'user', parts: [{text: userPrompt}] }, //newUserMessage,
                latestRawUserMessage: {role: 'user', parts: [{text: messageText}]},
                type: messageType,
                jobRole: jobRole,
                userId: userId,
                conversationId: currentConversationId,

            });

            const data = response.data;

            if (data?.question) {
                console.log("Gemini Feedback Response:", data.question);
                setCurrentAIResponse(data.question.trim());
                addMessageToHistory('model', data.question.trim());
                setCurrentUserAnswer('');
            } else {
                console.error("No result in response:", data);
                setError("Sorry, I couldn't process your request right now.");
            }
        } catch (error) {
            console.error("Error calling API: ", error.response?.data || error.message);
            setError(error.response?.data?.error || "An error occurred while processing your request.");
            // setFeedback("Sorry, there was an error generating feedback");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>AI-Powered Interview Coach</h2>
            {/* <p>Logged In: (User ID: {userId})</p> */}

            <input 
                type="text"
                placeholder="Enter a job role (e.g. Software Engineer or Lawyer)"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}   
                disabled={loading}
            />

            <button 
                onClick={generateQuestion}
                disabled={loading || !jobRole.trim()}    
            >
                {loading && !initialQuestion ? 'Generating Question...' : 'Start New Interview'}
            </button>

            {error && (
                <p>Error: {error}</p>
            )}

            {conversationHistory.length > 0 && (
                <div>
                    {conversationHistory.map((msg, index) => (
                        <div key={index}>
                            <strong>{msg.role === 'user' ? 'You:' : 'AI:'}</strong> {msg.parts[0].text}
                        </div>
                    ))}
                </div>
            )}



            {(initialQuestion || conversationHistory.length > 0) && !loading && (
                <div>
                    <label htmlFor="messageInput">Your Response:</label>
                    <textarea 
                        rows={6}
                        cols={12}
                        value={currentUserAnswer} 
                        onChange={(e) => setCurrentUserAnswer(e.target.value)}
                        placeholder={
                            initialQuestion && !conversationHistory.some(m => m.role === 'user' && m.parts[0].text.includes(initialQuestion))
                                ? "Type your answer to the initial question here..."
                                : "Ask a follow-up, provide more details, or continue the conversation..."
                        }
                        disabled={loading}
                    />

                    <button 
                        onClick={() => handleUserMessage(
                            currentUserAnswer,
                            initialQuestion && !conversationHistory.some(m => m.role === 'user' && m.parts[0].text.includes(initialQuestion))
                                ? "answer_submission"
                                : "follow-up_user_question"
                        )} 
                        disabled={loading || !currentUserAnswer.trim()}>
                        {loading ? 'Sending...' : 'Send Message'}
                    </button>

                </div>
            )}

            {error && (
                <p>Error: {error}</p>
            )}
        </div>
    )
}

