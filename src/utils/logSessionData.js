import { db } from "../lib/firebaseAdmin";
import { v4 as uuidv4 } from "uuid";

async function logSessionData(userId, jobRole, resumeText, userText, aiResponse, sentimentLabel, mode) {
    const sessionId = uuidv4();

    const docRef = db.collection("interview_sessions").doc(sessionId);

    const sessionData = {
        sessionId,
        userId: userId || "anonymous",
        jobRole: jobRole || null,
        resumeUsed: !!resumeText,
        timestamp: new Data().toISOString(),
        messages: [
            {
                role: "user",
                text: userText,
                sentiment: sentimentLabel,
                mode: null
            },
            {
                role: "ai",
                text: aiResponse,
                sentiment: null,
                mode
            }
        ]
    };

    await docRef.set(sessionData);
    return sessionId;
}