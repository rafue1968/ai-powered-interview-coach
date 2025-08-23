import axios from "axios";

export async function analyzeSentiment(text){
    try {
        const response = await axios.post("http://127.0.0.1:5000/analyze", {
            text: text
        });

        return response.data
    } catch (err){
        console.error("Error calling sentiment API:", err);
        return null;
    }
}