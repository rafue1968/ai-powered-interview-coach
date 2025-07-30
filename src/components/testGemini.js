// import { GoogleGenerativeAI } from "@google/generative-ai";

// const run = async () => {
//   const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//   const result = await model.generateContent("How is life as Google Gemini been going?");
//   const response = result.response.text();
//   console.log("Gemini says:", response);

//   return (
//     <div>
//         Gemini said:
//         <strong>{response}</strong>
//     </div>
//   )
// };

// run().catch(console.error);
