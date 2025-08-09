import { GoogleGenerativeAI } from "@google/generative-ai";
import { constructGeminiPrompt } from "../../../utils/constructGeminiPrompt";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({error: "Method Not Allowed"});
    }

    const [message, history, jobRole, resumeText] = req.body;

    if (!message || !Array.isArray(history)){
        return res.status(400).json({error: "Missing required fields"});
    }

    

    try {

        const userText = typeof message === "string" ? message : message.text;

        const systemPrompt = constructGeminiPrompt(userText, jobRole, resumeText);

        const combinedHistory = [...systemPrompt, ...history];

        const model = genAI.getGenerativeModel({model: "gemini-2.0-flash"});

        const chat = model.startChat({
            history: combinedHistory,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 350,
            },
        });
        const result = await chat.sendMessage(userText);
        const responseText = result.response.text();

        res.status(200).json({response: responseText});
    } catch (err) {
        console.error("Gemini error:", err);
        res.status(500).json({ error: "Gemini API failed."});
    }
}