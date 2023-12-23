import { GoogleAuth } from 'google-auth-library';
import { NextRequest, NextResponse } from 'next/server';
import { client } from 'scripts/weaviate';

const auth = new GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_CLIENT_EMAIL || 'default_client_email@example.com',
    private_key: (process.env.GOOGLE_SERVICE_PRIVATE_KEY || 'default_private_key').replace(
      /\\n/gm,
      '\n'
    )
  },
  scopes: 'https://www.googleapis.com/auth/cloud-platform'
});

async function getAccessToken() {
  try {
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    return accessToken;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

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

  try {

    const formData = await request.formData();
    console.log('formData', formData);
    
  
    const accessToken = await getAccessToken();
  
    console.log('accessToken', accessToken);
    
  
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Failed to authenticate with Google services.' },
        { status: 500 }
      );
    }

    
    const imageFile = formData.get('image');

    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    console.log('IMAGE CALLING: \t');

    const base64String = await getBase64(imageFile);

    console.log('IMAGE CALLED: \t');

    // Create the response
    const fetchVision = await fetch(
      `https://us-central1-aiplatform.googleapis.com/v1/projects/${process.env.GOOGLE_PROJECT_ID}/locations/us-central1/publishers/google/models/gemini-pro-vision:streamGenerateContent`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
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
          ],
          generation_config: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 200
          }
        })
      }
    );

    const aggregatedResponse = await fetchVision.json();

    // console.log('aggregatedResponse', aggregatedResponse);

    if (
      !aggregatedResponse ||
      !aggregatedResponse[0].candidates ||
      aggregatedResponse[0].candidates.length === 0
    ) {
      return NextResponse.json({ error: 'No candidates found' }, { status: 400 });
    }

    const candidate = aggregatedResponse[0].candidates[0];
    console.log('candidate', candidate);
    
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
