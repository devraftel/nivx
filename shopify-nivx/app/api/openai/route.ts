import { NextRequest, NextResponse } from 'next/server';
import FormData from 'form-data';
import axios from 'axios';

export async function POST(request: NextRequest) {
  console.log('OPENAI Route Called');

  // Convert the request body to an ArrayBuffer and then to a Buffer
  const arrayBuffer = await request.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Create a FormData instance and append the buffer
  const formData = new FormData();
  formData.append('file', buffer, { filename: 'filename.mp3', contentType: 'audio/mp3' });
  formData.append('model', 'whisper-1'); // Adding the model as per the curl example

  try {
    // Make a POST request to the OpenAI API
    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    // Extract the data from the response
    const data = response.data;
    console.log('data.text', data.text);

    return NextResponse.json(data.text, {
      status: 200
    });
  } catch (error) {
    console.error('Error during transcription:', error);
    return NextResponse.json(
      { message: 'Error during transcription' },
      {
        status: 500
      }
    );
  }
}
