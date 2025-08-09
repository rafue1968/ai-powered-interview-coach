import axios from "axios";
import React, {useEffect, useRef, useState} from "react";
import Loading from "../components/Loading";
import { auth } from "../lib/firebaseClient.js";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import StartInterviewInput from "../components/StartInterviewInput";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function InterviewCoach(){
    const [mode, setMode] = useState(null);
    const [jobRole, setJobRole] = useState('');
    const [initialQuestion, setInitialQuestion] = useState('');
    const [currentUserAnswer, setCurrentUserAnswer] = useState('');
    const [conversationHistory, setConversationHistory] = useState([])
    const [currentAIResponse, setCurrentAIResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const [resumeText, setResumeText] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [greeting, setGreeting] = useState(false);
    const [sessionStarted, setSessionStarted] = useState(false);


    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [conversationHistory, currentAIResponse, loading]);

    const addMessageToHistory = (role, text) => {
        setConversationHistory((prevHistory) => [
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
        setSessionStarted(true);

        if (!jobRole.trim() && !resumeText) {
            setError("Please enter a job role or a resume.");
            setLoading(false);
            return;
        }

        if (!userId) {
            setError("Please log in to start an interview session.");
            setLoading(false);
            return;
        }
        

        const greetingMessage = `Hey there! I'M YOUR AI Interview Coach. Let's get you ready for that ${jobRole || 'role'} interview. I'll start by asking a mock interview question - answer naturally and I'll help you refine it. Ready?`;
        addMessageToHistory('model', greetingMessage);

        const newConversationId = `interview-${Date.now()}-${Math.random().toString(36).substring(2,9)}`;
        setCurrentConversationId(newConversationId);
        // setConversationHistory([]);
        
        setGreeting(true);
        

        try {
            console.log("Calling Gemini API to generate question...")
            const response = await axios.post("/api/gemini", { 
                messages: [],
                latestUserMessage: {
                    role: "user", 
                    parts: [{
                        text: 
                         mode === "resume" && resumeText
                            ? `You are AI, an AI interview coach. Based on this resume:\n\n${resumeText}\n\nPlease generate one behavioural interview question. Format it as a clear question, no preamble or explanation.`
                            : `You are an AI interview coach for a ${jobRole}. Please generate one behavioral interview question for this role. Format it as a clear question, no preamble or explanation.`,
                    }]},
                latestRawUserMessage: {
                    role: "user", 
                    parts: [{text: mode && resumeText ? resumeText : jobRole }]},
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
                // console.error("No result in question response:", data);
                setError("Sorry, I couldn't generate an initial question right now. Please try again.");
            }

        } catch (error) {
            console.error("Error calling Gemini API for initial question:", error.response?.data || error.message);
            setError(error.response?.data?.error || "An error occurred while generating the initial question.");
        } finally {
            setLoading(false);
        }
    };

    const handleUserMessage = async (messageText, messageType) => {
        if (!userId || !currentConversationId) {
            setError("Please log in and start an interview session first.");
            console.warn("Blocked message send: missing userId or conversationId", { userId, currentConversationId });
            setLoading(false);
            return;
        }


        setLoading(true);
        setError('');
        setCurrentAIResponse('');

        // if (!userId || !currentConversationId) {
        //     setError("Please log in and start an interview session first.");
        //     setLoading(false);
        //     return;
        // }

        if (!messageText.trim()){
            setError("Please provide input.");
            setLoading(false);
            return;
        }

        const newUserMessage = { role: 'user', parts: [{ text: messageText }]};
        addMessageToHistory('user', messageText);

        let userPrompt = messageText;

        if (messageType === "answer_submission"){
            userPrompt = `Act like a friendly and insightful interview coach. My answer to the question "${initialQuestion}" is: "${messageText}". Please provide constructive, warm feedback using the STAR method as a reference.\n\n✅ Let me know if the response covered:\n- The situation/context\n- The task\n- The actions taken\n- The result\n\nGive encouraging advice on what worked, what could improve, and ask a natural follow-up question to help me refine it. Keep it conversational.`;
        } else if (messageType === "follow_up_user_question"){
            userPrompt = `My follow-up question is: "${messageText}". Please respond in the context of the interview. Keep it friendly and helpful.`;
        }

        try {
            const response = await axios.post("/api/gemini", {
                messages: [...conversationHistory, newUserMessage],
                latestUserMessage: { role: 'user', parts: [{text: userPrompt}] },
                latestRawUserMessage: {role: 'user', parts: [{text: messageText}]},
                type: messageType,
                jobRole: jobRole,
                userId: userId,
                conversationId: currentConversationId,
                resumeText: resumeText,

            });

            const data = response.data;

            if (data?.question) {
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
        } finally {
            setLoading(false);
        }
    };


    if (!mode) return <StartInterviewInput setMode={setMode} />

    if (mode === "resume" && !resumeText) {
        return <UploadResume setResumeText={setResumeText} onComplete={() => setStartInterview(true)} />;
    }

    if (mode === "jobrole" && !jobRole) {
        return <JobRoleInput setJobRole={setJobRole} onComplete={() => setStartInterview(true)} />;
    }

    if (startInterview) {
        return <InterviewChat jobRole={jobRole} resumeText={resumeText} />;
    }

    return null;


    return (
        <div>            
            {!sessionStarted &&
                (mode === 'resume' && !'greeting' && (
                <div>
                    <label>
                    Upload your resume:
                    <input 
                        type="file"
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileUpload}
                        disabled={loading}
                    />
                    </label>

                    <button 
                        onClick={() => setGreeting(true)}
                        disabled={loading || !resumeText.trim()}    
                    >
                        Continue
                    </button>
                </div>
                ))
            }

            {!sessionStarted &&
                (mode === 'jobrole' && !greeting && (
                <div>
                    <input 
                    type="text"
                    placeholder="Enter a job role (e.g. Software Engineer)"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}   
                    disabled={loading}
                />

                    <button 
                        onClick={() => setGreeting(true)}
                        disabled={!jobRole.trim()}    
                    >
                        Contunue
                    </button>

                </div>
                ))
            }

            {error && alert(`Error: ${error}`)}


            {greeting && (resumeText || jobRole) && !initialQuestion && (
                <div>
                    <p>Awesome! Thanks for sharing that.</p>
                    <p>Let's dive into a quick mode interview. I'll ask you a question based on your {mode==="resume" ? "resume" : "job role"}.</p>
                    <p>Just be yourself - no pressure. Ready?</p>

                    <button onClick={() => {
                        setGreeting(false);
                        generateQuestion();
                    }}>
                        Let's get started!
                    </button>
                </div>
            )}

            {/* {initialQuestion && !loading && (
                <div><strong>AI: </strong>{initialQuestion}</div>
            )} */}


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
                    <label>Your Response:</label>
                    <textarea 
                        rows={6}
                        cols={120}
                        value={currentUserAnswer} 
                        onChange={(e) => setCurrentUserAnswer(e.target.value)}
                        placeholder={
                            initialQuestion 
                            && !conversationHistory.some(m => m.role === 'user' && m.parts[0].text.includes(initialQuestion))
                                ? "Type your answer to the question here..."
                                : "Ask a follow-up or continue the conversation..."
                        }
                        disabled={loading}
                    />

                    <button 
                        onClick={() => 
                            handleUserMessage(
                            currentUserAnswer,
                            initialQuestion && 
                            !conversationHistory.some(m => m.role === 'user' && m.parts[0].text.includes(initialQuestion))
                                ? "answer_submission"
                                : "follow-up_user_question"
                        )} 
                        disabled={loading || !currentUserAnswer.trim()}>
                        {loading ? 'Sending...' : 'Send Message'}
                    </button>

                </div>
            )}
        </div>
    )
}