"use client";

import axios from "axios";
import { useState } from "react";
import Loading from "./Loading"

export default function AudioTTSButton ({text}) {
    const [loading, setLoading] = useState(false);


    const handlePlay = async () => {
        setLoading(true);
        try {
            const res = await axios.post(
                "/api/tts", 
                { text },
                { responseType: "blob" }
            );

            if (res.status === 200) {
                console.log("Audio has been fetched!");
            } else {
                console.log("Failed to fetch audio.")
                return;
            }

            const audioUrl = URL.createObjectURL(res.data);
            const audio = new Audio(audioUrl);
            audio.play();
        } catch (err) {
            console.error("Playback error:", err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={handlePlay} disabled={loading} className="speaker-button">
            {loading ? `Loading${<span className="dots"></span>}` 
                : 
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                }}>Play Audio <img src="/speaker-icon.svg" height="20px" width="20px" alt="speakericon" /></div>}
        </button>
    )
}