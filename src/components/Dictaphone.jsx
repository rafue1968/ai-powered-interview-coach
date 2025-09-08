"use client";

import React, { useEffect, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";


export default function Dictaphone({setTranscript, dictaphoneComplete, setListening}){
    

    const [dictaphone, setDictaphone] = useState(false)
   
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();


    useEffect(() => {
        if (typeof window !== "undefined"){
            window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        }
    }, []);

    // useEffect(() => {
    //     if(setTranscript){
    //         setTranscript(transcript)
    //     }
    // }, [transcript]);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>
    }

    function startListening(){
        setDictaphone(true)
        setListening(true);
        resetTranscript();
        SpeechRecognition.startListening({continuous: true});
    }

    function stopListening(){
        setDictaphone(false)
        setListening(false);
        SpeechRecognition.stopListening();

        if (dictaphoneComplete) {
            dictaphoneComplete(transcript);
        }

        resetTranscript();
    }

    return (
        <div className="dictaphone-container">
            <button 
                onClick={startListening} className="mic-button" style={{
                    // width: "40px",
                    // height: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "5px",
                    backgroundColor: !dictaphone ? "" : "#008ecc",
                    border: "none",
                    cursor: "pointer",
                }}>
                    {dictaphone ? 
                        <div className="wave-dots">
                          <span></span><span></span><span></span>
                        </div>
                        :
                        <img style={{columnFill: "white"}} src="/mic.svg" alt="micicon" />
                    }
            </button>
            {dictaphone &&
                <button 
                    onClick={stopListening} className="stop-button">
                            Stop Recording
                </button>
            }
        </div>
    )
}