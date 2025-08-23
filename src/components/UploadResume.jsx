import axios from "axios";
import { useState, useRef } from "react";


export default function UploadResume({setResumeText, onComplete}){
    const fileInputRef = useRef(null);
    const [error, setError] = useState("");
    const [file, setFile] = useState(null);
    const [summary, setSummary] = useState("");
    const [uploading, setUploading] = useState(false);


    const handleFileUpload = async (e) => {
        e.preventDefault();
        console.log(file);
        setError("");
        setUploading(true);
        setSummary("");


        if (!file){ 
            setError("Please select a file first");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", file);

            // const res = await fetch("/api/summarise-resume", {
            //     method: "POST",
            //     body: formData,
            // });

            // const res = await axios.post("/api/summarise-resume", formData);

            const res = await axios.post("/api/summarise-resume", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });

            const data = res.data;
            console.log("Upload Resume Result:", data)

            const contentType = res.headers["content-type"];
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Server returned unexpected response");
            }

            if (res.status !== 200) {
                throw new Error(data.error || "Something went wrong");
            }

            setUploading(false);
            setSummary(data.summary);
            setResumeText(data.summary);
            onComplete();
        } catch (err) {
            setError("Network or server error: " + err.message);
            setUploading(false);
        }


    };
    


    return (
        <div>
            <h2>Upload your resume</h2>
            <form onSubmit={handleFileUpload} >
                <input
                    type="file"
                    accept=".pdf,.docx,.txt, .doc"
                    ref={fileInputRef}
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                />
                <button type="submit" disabled={uploading}>
                    {uploading ? "Uploading" : "Upload and Summarise"}
                </button>
            </form>

            {
                summary && (
                    <div>
                        <h3>Summary:</h3>
                        <pre>{summary}</pre>
                    </div>
                )
            }

            {uploading && <p>Uploading and extracting text...</p>}
            {error && <p>Upload Resume Error: ${error}`</p>}
        </div>
    )

}




// import * as pdfjsLib from "pdfjs-dist";
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker/entry";
// import mammoth from "mammoth";
// import { useState, useRef } from "react";

// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;


// export default function UploadResume({setResumeText, onComplete}){
//     const fileInputRef = useRef(null);
//     const [uploading, setUploading] = useState(false);
//     const [error, setError] = useState("");

//     const handleFileUpload = async (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         const fileType = file.type;
//         try {
//             if (fileType === "application/pdf"){
//                 setUploading(true);
//                 setError("");
//                 const fileReader = new FileReader();

//                 fileReader.onload = async function () {
//                     const typedArray = new Uint8Array(this.result);
//                     try {
//                         const pdf = await pdfjsLib.getDocument(typedArray).promise;
//                         let extractedText = '';

//                         for (let i =1; i <= pdf.numPages; i++) {
//                             const page = await pdf.getPage(i);
//                             const content = await page.getTextContent();
//                             const textItems = content.items.map(item => item.str);
//                             extractedText += textItems.join(" ") + '\n';
//                         }

//                         setResumeText(extractedText);
//                         onComplete();
//                     } catch (err) {
//                         console.error("Error parsing PDF:", err);
//                         setError("Could not read PDF file.");
//                     }
//                     setUploading(false);
//                 };
                
//                 fileReader.readAsArrayBuffer(file);

//             } else if (fileType === "text/plain") {
//                 const reader = new FileReader();
//                 reader.onload = function(e) {
//                     setResumeText(e.target.result);
//                     onComplete();
//                 };
//                 reader.readAsText(file);
//             } else if (
//                 fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
//                 file.name.endsWith(".docx")
//             ) {
//                 const reader = new FileReader();
//                 reader.onload = async function(e){
//                     const arrayBuffer = e.target.result;
//                     try {
//                         const result = await mammoth.extractRawText({arrayBuffer});
//                         setResumeText(result.value);
//                         onComplete();
//                     } catch (error) {
//                         console.error("Error reading DOCX file:", error);
//                         alert("Could not extract text from the DOCX file.");
//                     }
//                 };
//                 reader.readAsArrayBuffer(file);
//             } else {
//                 alert("Unsupported file type. Please upload PDF, Word (.docx) or plain text (.txt).");
//             }
//         } catch (err) {
//             console.error("Upload error:", err);
//             alert("There was a problem reading your file.");
//         } finally {
//             setUploading(false);   
//         }
//     };
    


//     return (
//         <div>
//             <h2>Upload your resume</h2>
//             <input
//                 type="file"
//                 accept=".pdf,.docx,.txt"
//                 ref={fileInputRef}
//                 onChange={handleFileUpload}
//             />
//             {uploading && alert("Uploading and extracting text...")}
//             {error && alert(`${error}`)}
//         </div>
//     )

// }