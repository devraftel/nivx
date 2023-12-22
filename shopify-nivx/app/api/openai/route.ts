import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

export async function POST(request: NextRequest) {
  console.log('OPENAI Route Called');
  const body = await request.blob();
  console.log('body', body);

  const file = new File([body], 'filename.mp3', { type: 'audio/mp3' });

  console.log('file', typeof file, file);

  if (file.type !== 'audio/mp3') {
    console.log('File type is not mp3');
    return NextResponse.json({
      message: 'Error: File type is not mp3'
    });
  }

  const response = openai.audio.transcriptions.create({
    model: 'whisper-1',
    file: file
    // language: 'en-US'
  });

  const data = await response;

  console.log('response', data.text);

  return NextResponse.json(data.text, {
    status: 200
  });
}
