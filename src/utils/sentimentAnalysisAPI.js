import axios from "axios";

export async function analyzeSentiment(text){
    try {
        // const response = await axios.post("http://127.0.0.1:5000/analyze", {
        const response = await axios.post("https://vader-sentiment-api-1.onrender.com/analyze", {
            text: text
        });

        const sentiment = response.data;

        return sentiment;
    } catch (err){
        console.error("Error calling sentiment API:", err);
        return null;
    }
}