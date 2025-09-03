"use client";

import { ReactMediaRecorder } from "react-media-recorder";
import { useState } from "react";
import axios from "axios";

export default function VoiceRecorder(){
    const [transcript, setTranscript] = useState("");
    const [audioBlob, setAudioBlob] = useState(null);
    
    const startRecording = () => setRecord(true);
    const stopRecording = () => setRecord(false);


    const onStop = async (blobUrl, blob) => {
        setAudioBlob(blob);

        const formData = new FormData();
        formData.append("audio", blob);

        try {
            const res = await axios.post("/api/transcribe", formData);
            const data = res.data;
            console.log(data);
            setTranscript(data.text);

        } catch (err) {
            console.error("Transcription failed:", err);
        }
    };

    return (
        <div>
            <ReactMediaRecorder
                audio
                onStop={onStop}
                render={({status, startRecording, stopRecording}) => (
                    <div>
                        <p>Status: {status}</p>
                        <button onClick={startRecording}>Start</button>
                        <button onClick={stopRecording}>Stop</button>
                        {audioBlob && <audio controls src={URL.createObjectURL(audioBlob)} />}
                        <p>Transcript: {transcript}</p>
                    </div>
                )}>

            </ReactMediaRecorder>
        </div>
    )
}