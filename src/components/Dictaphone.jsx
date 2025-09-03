"use client";

import React, { useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";


export default function Dictaphone({setTranscript, dictaphoneComplete}){
    
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

    useEffect(() => {
        if(setTranscript){
            setTranscript(transcript)
        }
    }, [transcript]);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>
    }

    function startListening(){
        SpeechRecognition.startListening({continuous: true});
    }

    function stopListening(){
        SpeechRecognition.stopListening();
        if (dictaphoneComplete) {
            dictaphoneComplete(transcript);
        }
    }

    return (
        <div>
            {/* <p className={`status ${listening ? 'on' : 'off'}`}>
                Microphone: {listening ? 'on' : 'off'}
            </p> */}
            <button 
                onClick={ 
                    // SpeechRecognition.startListening({continuous: true})
                    startListening
                    }>
                        {/* Start */}
                        <img style={{columnFill: "white"}} src="/play.svg" alt="starticon" />
            </button>
            
            <button 
                onClick={
                    // SpeechRecognition.stopListening
                    stopListening
                    }>
                        Stop
            </button>

            {/* <button onClick={resetTranscript}>Reset</button> */}
            {/* <p>{transcript}</p> */}
        </div>
    )
}