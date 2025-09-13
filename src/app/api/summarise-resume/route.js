import pdf from "pdf-parse";
import mammoth from "mammoth";
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export const runtime = "nodejs"

export async function POST(req) {

  try {
      const formData = await req.formData();
      const file = formData.get('file');

      if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }

      

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      console.log("Uploaded File: ", file);
      const fileName = file.name.split(".").pop().toLowerCase();

      let extractedText = "";

      if (fileName === "pdf"){
        const data = await pdf(buffer);
        extractedText = data.text;
      } else if (fileName === "docx") {
        const result = await mammoth.extractRawText({ arrayBuffer});
        extractedText = result.value;
      } else if (fileName === "txt"){
        extractedText = buffer.toString("utf-8");
      } else {
        return NextResponse.json(
          { error: "Unsupported file type. Upload PDF, DOCX, or TXT."},
          { status: 400 }
        );
      }

      if (!extractedText.trim()){
        return NextResponse.json(
          { error: "No text content extracted."},
          { status: 400 }
        );
      }

      const trimmedText = extractedText.slice(0, 5000);

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

        const prompt = `Summarise the following resume:\n\n${trimmedText}`


        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();

        return NextResponse.json({ summary }, { status: 200 });

  } catch (error) {
        console.error('Upload Resume Error:', error.message, error.stack);
        return NextResponse.json(
          { error: 'Failed to summarise resume.' },
          { status: 500 }
        );
  }
}
