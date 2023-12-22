import { VertexAI } from '@google-cloud/vertexai';
import { NextRequest, NextResponse } from 'next/server';

const projectId = 'nivx-408903';
const location = 'us-central1';
const image =
  'https://images.pexels.com/photos/16892276/pexels-photo-16892276/free-photo-of-a-black-and-white-camera-with-a-leaf-on-it.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'; // Google Cloud Storage image
const mimeType = 'image/jpeg';

// Initialize Vertex with your Cloud project and location
const vertexAI = new VertexAI({ project: projectId, location: location });

// Instantiate the model
const generativeVisionModel = vertexAI.preview.getGenerativeModel({
  model: 'gemini-pro'
});

// For images, the SDK supports both Google Cloud Storage URI and base64 strings
const filePart = {
  fileData: {
    fileUri: image,
    mimeType: mimeType
  }
};

const textPart = {
  text: 'what is shown in this image?'
};

const request = {
  contents: [{ role: 'user', parts: [filePart, textPart] }]
};

export async function GET(req: NextRequest) {
  console.log('Prompt Text:');
  // @ts-ignore
  console.log(request.contents[0].parts[0].text);

  console.log('Non-Streaming Response Text:');
  // Create the response stream

  // @ts-ignore
  const responseStream = await generativeVisionModel.generateContentStream(request);

  // Wait for the response stream to complete
  // @ts-ignore
  const aggregatedResponse = await responseStream.response;

  // Select the text from the response
  // @ts-ignore
  const fullTextResponse = aggregatedResponse.candidates[0].content.parts[0].text;

  console.log(fullTextResponse);

  return NextResponse.json(fullTextResponse, { status: 200 });
}
