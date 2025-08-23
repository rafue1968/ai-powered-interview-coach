import React, {useState} from "react";
import { analyzeSentiment } from "../utils/sentimentAnalysisAPI";

export default function SentimentDemo(){
    const [text, setText] = useState("");
    const [result, setResult] = useState(null);


    const handleAnalyze = async () => {
        const sentiment = await analyzeSentiment(text);
        setResult(sentiment);
    };
    
    // return (
    //     <div>
    //         <h2>Sentiment Analysis Demo</h2>
    //         <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your text here..." />
    //         <br />
    //         <button onClick={handleAnalyze}>Analyze Sentiment</button>


    //         {result && (
    //             <div>
    //                 <h3>Result:</h3>
    //                 <p><strong>Label:</strong> {result.sentiment}</p>
    //                 <p><strong>Compound Score:</strong>{result.compound_score}</p>

    //                 <h4>Sentence Breakdown:</h4>
    //                 <ul>
    //                     {result.sentence_breakdown.map((item, index) => (
    //                         <li key={index}>
    //                             <strong>Text:</strong> {item.text} <br />
    //                             {/* <strong>Score:</strong> {item.score} */}
    //                         </li>
    //                     ))}
    //                 </ul>
    //             </div>
    //         )}
    //     </div>
    // )


    return (
        <div>
            <h2>Sentiment Analysis Demo</h2>
            <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your text here..." />
            <br />
            <button onClick={handleAnalyze}>Analyze Sentiment</button>


            {result && (
                <div>
                    <h3>Result:</h3>
                    <p>Label: {result.sentiment}</p>
                    {/* <pre>{JSON.stringify(result.scores, null, 2)}</pre> */}
                </div>
            )}
        </div>
    )
}