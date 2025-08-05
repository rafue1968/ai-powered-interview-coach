// import { NextResponse } from 'next/server';
// import pdf;

// export async function POST(req) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get('file');

//     if (!file) {
//       return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
//     }

//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     const data = await pdf(buffer);
//     const text = data.text;

//     return NextResponse.json({ text }, { status: 200 });

//   } catch (error) {
//     console.error('PDF Parse Error:', error);
//     return NextResponse.json(
//       { error: 'Failed to parse PDF on server.' },
//       { status: 500 }
//     );
//   }
// }
