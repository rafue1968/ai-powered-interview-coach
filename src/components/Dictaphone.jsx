"use client";

import React, { useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";


export default function Dictaphone(){
    
    useEffect(() => {
        if (typeof window !== "undefined"){
            window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        }
    }, []);
    
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>
    }

    return (
        <div>
            <p className={`status ${listening ? 'on' : 'off'}`}>
                Microphone: {listening ? 'on' : 'off'}
            </p>
            <button 
                onClick={() => 
                    SpeechRecognition.startListening({continuous: true})}>
                        Start
            </button>
            
            <button 
                onClick={SpeechRecognition.stopListening}>Stop</button>
            <button onClick={resetTranscript}>Reset</button>
            <p>{transcript}</p>
        </div>
    )
}