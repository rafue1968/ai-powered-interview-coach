import { useEffect, useRef, useState } from "react";


export default function LiveTranscriber() {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
    const mediaRecorderRef = useRef(null);
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = new WebSocket("ws://localhost:3000/api/transcribe");

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.text) setTranscript((prev) => prev + " " + data.text);
        };

        socketRef.current.onerror = (e) => console.error("WebSocket error:", e);

        return () => {
            socketRef.current.close();
        }
    }, []);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: "audio/webm",
        });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0 && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.send(event.data);
            }
        };

        mediaRecorder.start(250);
        setIsRecording(true);
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    };

    return (
        <div>
            <h2>Live Interview Transcription</h2>
            <button onClick={isRecording ? stopRecording : startRecording}>
                {isRecording ? "Stop" : "Start"} Recording
            </button>
            <p><strong>Transcript:</strong> {transcript}</p>
        </div>
    )
}