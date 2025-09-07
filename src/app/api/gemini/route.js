import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
// import { firestore } from "../../../../firebaseClient";
import { db } from "../../../lib/firebaseAdmin";
import constructGeminiPrompt from "../../../utils/constructGeminiPrompt"
import { analyzeSentiment } from "../../../utils/sentimentAnalysisAPI"
import logSessionData from "../../../utils/logSessionData";

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

        // console.log("Received from client:", { message, history, jobRole, resumeText });

        const userText = typeof message === "string" ? message : message?.text;

        const sentimentResult = await analyzeSentiment(userText);
        const sentimentLabel = sentimentResult.sentiment;

        const systemPrompt = constructGeminiPrompt(userText, jobRole, resumeText, sentimentLabel);
        
        const combinedHistory = [...systemPrompt, ...history];

        const model = genAI.getGenerativeModel({model: "gemini-2.0-flash"});

        const chat = model.startChat({
            history: combinedHistory,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 100,
            },
        });
        const result = await chat.sendMessage(userText);
        const responseText = result.response.text();      
        
        // let mode = "Strategist";
        // if (sentimentLabel === "negative") mode = "Motivator";
        // if (sentimentLabel === "positive") mode = "Interviewer"

        // await logSessionData("demoUser", jobRole, resumeText, userText, responseText, sentimentLabel, mode);

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


async function humanizedGeminiTextResponse(aiText){
    const humanizedUserPrompt = `Hey, given the text, can you please make it more conversational, like a good friend explaining something to another friend: ${aiText}`
}