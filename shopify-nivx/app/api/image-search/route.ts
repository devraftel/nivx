import { VertexAI } from '@google-cloud/vertexai';
import { NextRequest, NextResponse } from 'next/server';
import { client } from 'scripts/weaviate';

async function getBase64(imageFile: any) {
  //   const image = await axios.get(url, { responseType: 'arraybuffer' });
  //   return Buffer.from(image.data).toString('base64');
  const data = await imageFile.arrayBuffer();
  const buffer = Buffer.from(data);

  // Convert the Buffer to a base64 string
  const base64String = buffer.toString('base64');

  return base64String;
}

export async function POST(request: NextRequest) {
  console.log('IMAGE SEARCH ROUTE: \t');
  const formData = await request.formData();

  try {
    const imageFile = formData.get('image');

    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    console.log('IMAGE CALLING: \t');

    const base64String = await getBase64(imageFile);

    console.log('IMAGE CALLED: \t', base64String);

    const vertexAI = new VertexAI({
      project: process.env.GOOGLE_PROJECT_ID!,
      location: 'us-central1'
    });

    const generativeVisionModel = vertexAI.preview.getGenerativeModel({
      model: 'gemini-pro-vision'
    });

    // Pass multimodal prompt
    const request: any = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: base64String,
                mimeType: 'image/png'
              }
            },
            {
              text: 'Find what product I want to search, it;s characterstics and features'
            }
          ]
        }
      ]
    };

    // Create the response
    const response = await generativeVisionModel.generateContent(request);
    // Wait for the response to complete
    const aggregatedResponse = await response.response;

    console.log('RESPONSE: \t', aggregatedResponse.candidates);

    if (
      !aggregatedResponse ||
      !aggregatedResponse.candidates ||
      aggregatedResponse.candidates.length === 0
    ) {
      return NextResponse.json({ error: 'No candidates found' }, { status: 400 });
    }

    const candidate = aggregatedResponse.candidates[0];
    if (
      !candidate ||
      !candidate.content ||
      !candidate.content.parts ||
      candidate.content.parts.length === 0
    ) {
      return NextResponse.json({ error: 'No content parts found' }, { status: 400 });
    }

    const parts = candidate.content.parts;
    if (!parts || parts.length === 0) {
      return NextResponse.json({ error: 'No parts found' }, { status: 400 });
    } // Select the text from the response\

    let answer = null;
    let callProducts = null;
    if (Array.isArray(parts)) {
      const textPart = parts.find((part) => part.text !== undefined);

      if (textPart) {
        console.log('TEXT', textPart.text);
        answer = textPart.text;

        if (answer === null || answer === undefined || answer === '') {
          answer = 'The Latest Products';
        }

        const result = await client.graphql
          .get()
          .withClassName('Gemini')
          .withNearText({ concepts: [answer] })
          .withLimit(2)
          .withFields('handle title description image shopifyid image')
          .do();

        console.log('JSON.stringify(result, null, 2)', JSON.stringify(result, null, 2));

        const products = result.data.Get.Gemini;

        callProducts = products;
      } else {
        console.log('PARTS', parts);
        answer = parts;
      }
    } else {
      console.log('No parts found');
      answer = '';
    }

    return NextResponse.json({ response: answer, products: callProducts }, { status: 200 });
  } catch (error: any) {
    console.error('Error occurred in POST:', error);
    // Log detailed error message
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 });
  }
}
