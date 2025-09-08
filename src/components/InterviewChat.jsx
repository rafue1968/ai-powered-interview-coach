"use client";

import { useEffect, useRef, useState } from "react";
import { auth, firestore } from "../lib/firebaseClient";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDoc,
  doc,
} from "firebase/firestore";
import MessageBubble from "./MessageBubble"
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import Dictaphone from "../components/Dictaphone";



export default function InterviewChat({ user="", jobRole, resumeText, sessionId="" }) {
  const userId = auth.currentUser.uid;

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false)

  const firestoreInteractions = collection(firestore, "users", userId, "sessions", sessionId, "interactions");
  const bottomRef = useRef(null);


  useEffect(() => {
    if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
   }, [messages]);


      //  const q = query(collection(firestore, "users", user, "sessions", session, "interactions"), orderBy("timestamp"));
  
  useEffect(() => {
    if (!user || !sessionId) return;

    const interactionsRef = collection(
      firestore, 
      "users", 
      userId, 
      "sessions", 
      sessionId, 
      "interactions"
    )
    
    const q = query(interactionsRef, orderBy("timestamp", "desc"));
    
    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}));
        setMessages(msgs.sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0)));
      }, 
      (error) => {
        console.error("Firestore onSnapshot error:", error);
      }
    );

    return () => unsubscribe();
  }, [user, sessionId]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: "user",
      timestamp: serverTimestamp(),
    };

    await addDoc(firestoreInteractions, userMessage);
    setInput("");
    setLoading(true);

    try {

      const chatHistory = messages
        .filter((msg) => msg.sender && msg.text)
        .map((msg) => ({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{text: msg.text}],
        }));

        const res = await axios.post("/api/gemini", {
            message: input,
            history: chatHistory,
            jobRole,
            resumeText,
        });

        const aiText = res.data?.response || "Hmm, I couldn't think of a helpful response. Can you try rephrasing?";


      await addDoc(firestoreInteractions, {
        text: aiText,
        sender: "ai",
        timestamp: serverTimestamp(),
      });

      // const voiceRes = await axios.post("/api/speak", {
      //   aiText
      // })

      // const blob = await voiceRes.blob();
      // const url = URL.createObjectURL(blob);
      // const audio = new Audio(url);
      // audio.play();

    } catch (err) {
      console.error("Gemini error:", err);
      await addDoc(firestoreInteractions, {
        text: "Oops, something went wrong. I am not able to respond right now. Please try again.",
        sender: "ai",
        timestamp: serverTimestamp(),
      });
    } finally {
        setLoading(false);
        setInput("");
    }
  };

  const dictaphoneComplete = (transcript) => {
    setInput((prev) => prev + transcript);
    setTranscript("");
  }

  return (
    <div className="chat-container" style={{ maxWidth: 600, margin: "auto" }}>
      <div
        className="messages"
        style={{
          height: "400px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1rem",
        }}
      >
        <div>
            {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
            ))}
        </div>
        {loading && <p style={{
          color: "black"
        }}>Thinking <span className="dots"></span></p>}
        <div ref={bottomRef} />
      </div>

      <div className="input-area" style={{ display: "flex", gap: "0.5rem" }}>
        {listening ? 
          <p>Recording has started<span className="dots"></span></p> :
          <textarea 
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1, padding: "0.5rem" }}     
              className="message-textarea"   
          />
        }
        

        <button onClick={handleSend} disabled={loading}>
          Send
        </button>
        <div style={{display: "flex", alignItems: "center"}}>
            <Dictaphone setTranscript={setTranscript} dictaphoneComplete={dictaphoneComplete} setListening={setListening} />
        </div>
      </div>
    </div>
  );
}
