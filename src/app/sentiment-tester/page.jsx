"use client";

import SentimentDemo from "../../components/SentimentDemo";
// import VoiceRecorder from "../../components/VoiceRecorder";
import LiveTranscriber from "../../components/LiveTranscriber"
import Dictaphone from "../../components/Dictaphone"

import dynamic from "next/dynamic";

const VoiceRecorder = dynamic(() => import("../../components/VoiceRecorder"), {
    ssr: false,
});

export default function Page(){
    return (
        <>
            {/* <SentimentDemo /> */}
            {/* <VoiceRecorder /> */}

            {/* <LiveTranscriber /> */}

            <Dictaphone />
        </>
    )
}