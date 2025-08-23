import { NextResponse } from "next/server";
import { getTTS } from "../../../lib/azureTTS";

export async function POST(req) {
    const { text } = await req.json();

    try {
        const audioBuffer = await getTTS(text);
        const uint8Array = new Uint8Array(audioBuffer);

        return new NextResponse(uint8Array, {
            status: 200,
            headers: {
                "Content-Type": "audio/mpeg"
            }
        });
    } catch (err){
        console.error("TTS API Error:", err);
        return NextResponse.json({error: "TTS Failed"}, {status: 500});
    }
}