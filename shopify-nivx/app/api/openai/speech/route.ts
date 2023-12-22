import { NextRequest } from 'next/server';
import OpenAI from 'openai';
// import fs from 'fs';
// import path from 'path';
// import { Readable } from 'stream';

import {} from 'ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

// const speechFile = path.resolve('./speech.mp3');

export async function GET(request: NextRequest) {
  const body = await request.json();

  const prompt = body.prompt;

  const response = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'alloy',
    input: prompt
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  //   const stream = new Readable();
  //   stream.push(buffer);
  //   stream.push(null);

  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'audio/mp3'
    }
  });
}
