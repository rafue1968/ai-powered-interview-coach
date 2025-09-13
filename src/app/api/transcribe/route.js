// import { IncomingForm } from "formidable";
// import fs from "fs";
// import axios from "axios";
// import { NextResponse } from "next/server";
// import { Readable } from "stream";
// import { promisify } from "util";

// export const config = {
//     api: {
//         bodyParser: false,
//     }
// }

// export const runtime = "nodejs";

// function readFile(file){
//     return fs.promises.readFile(file.filepath);
// }

// function requestToStream(req) {
//     return Readable.from(req.body);
// }

// export async function POST(req){
//     try {
//         const contentType = req.headers.get('content-type');
//         const contentLength = req.headers.get('content-length');
//         const body = await req.arrayBuffer();
//         const buffer = Buffer.from(body);
//         const stream = requestToStream(req)
//         const form = new IncomingForm();

//         const { files, fields } = await new Promise((resolve, reject) => {
//             form.parse(req, (err, fields, files) => {
//                 if (err) reject(err);
//                 resolve({ fields, files });
//             });
//         });

//         const audioFile = files.audioFile//?.[0];

//         if (!audioFile || !audioFile.filepath) {
//             return NextResponse.json({
//                 status: 400,
//                 error: "No audio file provided."
//             });
//         }

        
//         const fileBuffer = await fs.promises.readFile(audioFile.filepath);

//         // const buffer = await readFile(audioFile) //Buffer.from(await audioFile.arrayBuffer());

//         const uploadRes = await axios.post("https://api.assemblyai.com/v2/upload", fileBuffer, {
//                 headers: {
//                     authorization: process.env.ASSEMBLYAI_API_KEY,
//                     "Content-Type": "application/octet-stream",
//                     // "Transfer-Encoding": "chunked",
//                 },
//         });

//         const { upload_url } = uploadRes.data;

//         const transcriptRes = await axios.post("https://api.assemblyai.com/v2/transcript",
//                 { audio_url: upload_url },
//                 {
//                     headers: {
//                         authorization: process.env.ASSEMBLYAI_API_KEY,
//                         "Content-Type": "application/json",
//                     },
//                 }
//         );

//         const { id } = transcriptRes.data;

//         let transcript;

//         while (true) {
//             const pollingRes = await axios.get(`https://api.assemblyai.com/v2/transcript/${id}`, {
//                 headers: {
//                         authorization: process.env.ASSEMBLYAI_API_KEY,
//                 },
//             });

//             transcript = pollingRes.data;

//             if (transcript.status === "completed") {
//                 break;
//             } else if (transcript.status === "error") {
//                 throw new Error("Transcription failed at AssemblyAI side");
//             }

//             await new Promise((resolve) => setTimeout(resolve, 2000));
//         }

//         // const transcript = await transcriptRes.data;
//         return NextResponse.json({text: transcript.text});
//     } catch (err) {
//         console.error("Transcription failed:", err);
//         return NextResponse.json({ error: "Transcription failed"}, {status: 500});
//     }
// }


import { WebSocketServer } from "ws";
import { Readable } from "stream";

let server;

if (!server) {
  server = new WebSocketServer({ noServer: true });

  server.on("connection", (ws) => {
    let assemblySocket;

    fetch("https://api.assemblyai.com/v2/realtime/token", {
      method: "POST",
      headers: {
        authorization: process.env.ASSEMBLYAI_API_KEY,
      },
    })
      .then((res) => res.json())
      .then(({ token }) => {
        assemblySocket = new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`);

        assemblySocket.onopen = () => {
          console.log("Connected to AssemblyAI");
        };

        assemblySocket.onmessage = (msg) => {
          const data = JSON.parse(msg.data);
          if (data.text) {
            ws.send(JSON.stringify({ text: data.text }));
          }
        };
      });

    ws.on("message", (msg) => {
      if (assemblySocket?.readyState === WebSocket.OPEN) {
        assemblySocket.send(msg);
      }
    });

    ws.on("close", () => {
      assemblySocket?.close();
    });
  });
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default function handler(req, res) {
  if (res.socket.server.ws) {
    res.end();
    return;
  }

  res.socket.server.ws = true;

  const upgradeHandler = (request, socket, head) => {
    server.handleUpgrade(request, socket, head, (ws) => {
      server.emit("connection", ws, request);
    });
  };

  res.socket.server.on("upgrade", upgradeHandler);
  res.end();
}
