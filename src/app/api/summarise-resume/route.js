import pdf from "pdf-parse";
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import formidable from "formidable";
import fs from "fs/promises";
import { Readable } from "stream";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export const config = {
  api: {
    bodyParser: false,
  }
}

function toNodeReadable(webStream){
  return Readable.fromWeb(webStream)
}

function parseForm(req){
  return new Promise((resolve, reject) => {
    const form = formidable({multiples: false, keepExtensions: true});
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({fields, files});
    });
  });
}

export async function POST(req) {

  try {
      const nodeReq = toNodeReadable(req.body);
      nodeReq.headers = Object.fromEntries(req.headers);

      const {files} = await parseForm(nodeReq);

      if (!files.file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }

      const uploaded = Array.isArray(files.file) ? files.file[0] : files.file;
      const fileName = uploaded.originalFilename.split(".").pop().toLowerCase();

      if (fileName !== "pdf"){
        return NextResponse.json(
          { error: "Unsupported file type. Upload a PDF file." },
          { status: 400 }
        )
      }

      const buffer = await fs.readFile(uploaded.filepath);

      const data = await pdf(buffer);
      const extractedText = data.text;

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
        console.log(error);
        return NextResponse.json(
          { error: 'Failed to summarise resume.' },
          { status: 500 }
        );
  }
}
