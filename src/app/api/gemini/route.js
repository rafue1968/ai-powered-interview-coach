import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
// import { firestore } from "../../../../firebaseClient";
import { db } from "../../../lib/firebaseAdmin";

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
        const { messages, latestUserMessage, latestRawUserMessage, type, jobRole, userId, conversationId, resumeText} = await request.json();

        // console.log("Incoming request body:", {
        //     latestUserMessage,
        //     latestRawUserMessage,
        //     userId,
        //     conversationId,
        // })

        if (!latestUserMessage || !latestRawUserMessage || !userId || !conversationId) {
            return NextResponse.json(
                {error: "Missing required parameters: latestUserMessage, userId, or conversationalId."},
                {status: 400}
            );
        }

        console.log(`Received ${type || 'unknown'} prompt:`, latestUserMessage.parts[0].text);

        if (resumeText && typeof resumeText === 'string' && resumeText.trim().length > 0) {
            messages.unshift({
                role: 'user',
                parts: [{ text: `The user has uploaded the following resume content. Use it to tailor your questions:\n\n${resumeText}` }],
            })
        }


        if (!Array.isArray(messages)){
            return NextResponse.json(
                { error: "messages must be an array." },
                { status: 400 }
            );
        }

        console.log(`Received ${type || 'chat'} prompt from user:`, latestUserMessage.parts[0].text);
        console.log(`Conversation History Length:`, messages.length);

        const model = genAI.getGenerativeModel({model: "gemini-2.0-flash"});

        let chatHistoryForGemini = [];

        const conversationDocRef = db.collection('users').doc(userId).collection('conversations').doc(conversationId);
        const conversationDoc = await conversationDocRef.get();

        if (conversationDoc.exists) {
            console.log("Loading existing conversation from Firebase.");
            chatHistoryForGemini = conversationDoc.data().history || [];
        } else {
            console.log("Starting a new conversation in Firebase.");
            chatHistoryForGemini = messages;
        }

        const chat = model.startChat({
            history: chatHistoryForGemini,
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        console.log("Sending message to Gemini:", latestUserMessage.parts);
        const result = await chat.sendMessage(latestUserMessage.parts); //model.generateContent(userPrompt);
        
        
        const geminiTextReponse = await result?.response?.text?.();


        if (!geminiTextReponse) {
            console.error("No text content in Gemini response:", JSON.stringify(result, null, 2));
            return NextResponse.json(
                { error: "No text response generated from Gemini." },
                { status: 500 }
            );
        }

        console.log("Gemini response:", geminiTextReponse);
        const updatedHistory = [
            ...chatHistoryForGemini,
            latestRawUserMessage,
            {role: 'model', parts: [{text: geminiTextReponse}] }
        ];

        await conversationDocRef.set({
            jobRole: jobRole,
            userId: userId,
            lastUpdated: new Date(),
            history: updatedHistory,
        }, {merge: true});


        console.log("Conversation history updated in Firebase.");

        return NextResponse.json({ question: geminiTextReponse }, {status: 200})


    } catch (error) {
        console.error("Gemini/Firebase Error:", {
        message: error.message,
        code: error.code,
        stack: error.stack,
        ...error
        });
        return NextResponse.json(
            { error: error.message || "Internal server error" }, 
            { status: 500 },
        );
    }
}


async function humanizedGeminiTextResponse(aiText){
    const humanizedUserPrompt = `Hey, given the text, can you please make it more conversational, like a good friend explaining something to another friend: ${aiText}`
}