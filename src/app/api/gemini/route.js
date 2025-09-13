import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
// import { firestore } from "../../../../firebaseClient";
import { db } from "../../../lib/firebaseAdmin";
import constructGeminiPrompt from "../../../utils/constructGeminiPrompt"
import { analyzeSentiment } from "../../../utils/sentimentAnalysisAPI"

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("Error: GEMINI_API_KEY is not set in environment variables.");
};

const genAI = apiKey ? new GoogleGenerativeAI(apiKey): null;

export async function POST(request) {

    if (!genAI) {
        return NextResponse.json(
            {error : "Server configuration error: Google API key missing."},
            {status: 500}
        );
    }

    if (!db) {
        console.error("Error: Firestore DB instance is not available.");
        return NextResponse.json(
            { error: "Server configuration error: Firestore database not initialized." },
            { status: 500 }
        );
    }


    try {
        const { message, history, jobRole, resumeText} = await request.json();

        const userText = typeof message === "string" ? message : message?.text;
        const sentimentResult = analyzeSentiment(userText);
        const sentimentLabel = sentimentResult.sentiment;

        const systemPrompt = constructGeminiPrompt(userText, jobRole, resumeText, sentimentLabel);
        
        const combinedHistory = [...systemPrompt, ...history];

        const model = genAI.getGenerativeModel({model: "gemini-2.0-flash"});

        const chat = model.startChat({
            history: combinedHistory,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 512,
            },
        });
        const result = await chat.sendMessage(userText);

        const responseText = result.response?.text()
            || result.candidates?.[0]?.content?.parts?.[0]?.text
            || "Sorry. I am not able to respond right now.";

        return NextResponse.json({ response: responseText }, {status: 200})


    } catch (error) {
        console.error("Gemini/Firebase Error:", {
        message: error.message,
        code: error.code,
        stack: error.stack,
        ...error
        });
        return NextResponse.json(
            { error: error.message || "Gemini error" }, 
            { status: 500 },
        );
    }
}
