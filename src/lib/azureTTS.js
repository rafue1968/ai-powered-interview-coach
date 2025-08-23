import axios from "axios";

export async function getTTS(text) {

    const speechKey = process.env.AZURE_SPEECH_KEY;
    const region = process.env.AZURE_SPEECH_REGION;


    const escapeXml = (unsafe) =>
        unsafe.replace(/[<>&'"]/g, (c) => ({
            "<": "&lt;",
            ">": "&gt;",
            "&": "&amp;",
            "'": "&apos;",
            '"': "&quot;",
        }[c]));


    if (!speechKey || !region) {
        console.error("Azure Speech key or region is missing");
        throw new Error("Azure Speech key or region is not set.")
    };

    const url = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;

    const escapedText = escapeXml(text);

    const ssml = `
        <speak version='1.0' xml:lang='en-GB'>
            <voice xml:lang='en-GB' xml:gender='Male' name='en-GB-RyanNeural'>
                ${escapedText}
            </voice>
        </speak>`;

    try {
        const response = await axios.post(url, ssml.trim(), {
            headers: {
                'Ocp-Apim-Subscription-Key': speechKey,
                "Content-Type": "application/ssml+xml",
                'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
                "User-Agent": "InterviewCoachApp"
            },
            responseType: "arraybuffer"
        });

        return response.data;
    } catch (err) {
         console.error("Azure TTS error status:", err.response?.status);
        console.error("Azure TTS error headers:", err.response?.headers);
        console.error("Azure TTS error data:", err.response?.data);
        throw new Error("Azure TTS generation failed.");
    }
}