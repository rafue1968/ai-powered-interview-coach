"use client";

import { useEffect, useRef, useState } from "react";
import { firestore } from "../lib/firebaseClient";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import MessageBubble from "./MessageBubble"
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default function InterviewChat({ user, jobRole, resumeText }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatRef = collection(firestore, "users", user, "interactions");
  const bottomRef = useRef(null);


  useEffect(() => {
    if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
   }, [messages]);


  
  useEffect(() => {
    const q = query(collection(firestore, "users", user, "interactions"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: "user",
      timestamp: serverTimestamp(),
    };

    await addDoc(chatRef, userMessage);
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


      await addDoc(chatRef, {
        text: aiText,
        sender: "ai",
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error("Gemini error:", err);
      await addDoc(chatRef, {
        text: "Oops, something went wrong with the AI response.",
        sender: "ai",
        timestamp: serverTimestamp(),
      });
    }

    setLoading(false);
  };

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
        {loading && <p>Thinking...</p>}
        <div ref={bottomRef} />
      </div>

      <div className="input-area" style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          placeholder="Type your response..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button onClick={handleSend} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}
