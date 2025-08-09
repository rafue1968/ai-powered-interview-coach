import { GoogleGenerativeAI } from "@google/generative-ai";
import { convertFirestoreToGeminiHistory } from "./convertFirestoreToGeminiHistory";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../lib/firebaseClient";

/**
 * Calls Gemini 2.0 Flash API using chat history and a user message.
 * Returns AI's generated text response.
 *
 * @param {Array} chatHistoryForGemini - Array of { role: "user" | "model", parts: [{ text: string }] }
 * @param {string} userMessage - The user's current message
 * @returns {Promise<string | null>}
 */


export default async function helperBot({chatHistoryForGemini, userMessage}){
    
    
    // const snapshot = await getDocs(collection(firestore, `users/${userId}/interactions`));
    // const rawInteractions = snapshot.docs.map(doc => doc.data());

    // rawInteractions.sort((a, b) => a.timestamp?.toMillis?.() - b.timestamp?.toMillis?.());

    // chatHistoryForGemini = convertFirestoreToGeminiHistory(rawInteractions);
    
    if (!userMessage || userMessage.trim() === "") {
        console.warn("User message is empty or invalid.");
        return null;
    }
    
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("Error: GEMINI_API_KEY is not set.");
        alert("Gemini API key is missing.");
        return;
    };

    let finalChatHistory = chatHistoryForGemini;

    if (!finalChatHistory || finalChatHistory.length === 0){
            finalChatHistory = [
                {
                    role: "user",
                    parts: [{ text: `You are an AI-powered Interview Coach. This user has said this: ${userMessage}. Help them prepare for job interviews with behavioural questions, feedback, and tips.` }],
                }
            ]
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({model: "gemini-2.0-flash"});

        const chat = model.startChat({
            history: finalChatHistory,
            generationConfig: {
                maxOutputTokens: 500,
            },
        });


        const result = await chat.sendMessage(userMessage);

        const geminiTextResponse = result?.response?.text?.();

        if (!geminiTextResponse) {
            alert("No text response generated from Gemini.")
        }

        return geminiTextResponse;
    } catch (err) {
        console.error("Error in helperBot:", err);
        return null;
    }
}