import { NextRequest, NextResponse } from 'next/server';
import { client } from 'scripts/weaviate';
import { GoogleAuth } from 'google-auth-library';

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

export async function POST(request: NextRequest) {
  const body = await request.json();

  console.log('FUN ROUTE: \t', body.prompt);

  const prompt = body.prompt;

  // Get the access token
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Failed to authenticate with Google services.' },
      { status: 500 }
    );
  }

  const data = await fetch(
    `https://us-central1-aiplatform.googleapis.com/v1/projects/${process.env.GOOGLE_PROJECT_ID}/locations/us-central1/publishers/google/models/gemini-pro:streamGenerateContent`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'USER',
            parts: { text: 'Hello!' }
          },
          {
            role: 'ASSISTANT',
            parts: { text: 'Argh! What brings ye eCommerce Store?' }
          },
          {
            role: 'USER',
            parts: { text: prompt }
          }
        ],
        generation_config: {
          temperature: 0.2,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 200
        },
        tools: [
          {
            function_declarations: [
              {
                name: 'search_product',
                description:
                  'find the product present in eCommerce Store Cataglog based on the user query , gender, description, title words, etc.',
                parameters: {
                  type: 'object',
                  properties: {
                    query: {
                      type: 'string',
                      description: 'The search query'
                    },
                    description: {
                      type: 'string',
                      description: 'Under 160 words product description.'
                    }
                  },
                  required: ['query', 'description']
                }
              }
            ]
          }
        ]
      })
    }
  );

  const json = await data.json();

  let answer = null;
  let areProducts = null;
  const parts = json[0].candidates[0]?.content.parts;

  if (Array.isArray(parts)) {
    const textPart = parts.find((part) => part.text !== undefined);
    const functionCallPart = parts.find((part) => part.functionCall !== undefined);

    if (textPart) {
      console.log('TEXT', textPart.text);
      answer = textPart.text;
    } else if (functionCallPart) {
      console.log('FUNCTION_CALL', functionCallPart.functionCall);
      answer = functionCallPart.functionCall;

      const functionName = functionCallPart.functionCall.name;
      const args = functionCallPart.functionCall.args;

      // Extract individual arguments
      const query = args.query ? args.query : '';
      // const description = args.description ? args.description : '';

      console.log('Function Name:', functionName);
      console.log('Query:', query);
      // console.log('Description:', description);

      const result = await client.graphql
        .get()
        .withClassName('Gemini')
        .withNearText({ concepts: [prompt, query] })
        .withLimit(2)
        .withFields('handle title description image shopifyid')
        .do();

      console.log('JSON.stringify(result, null, 2)', JSON.stringify(result, null, 2));

      const products = result.data.Get.Gemini;

      areProducts = products;

      const res2 = await fetch(
        `https://us-central1-aiplatform.googleapis.com/v1/projects/${process.env.GOOGLE_PROJECT_ID}/locations/us-central1/publishers/google/models/gemini-pro:streamGenerateContent`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'USER',
                parts: { text: 'Hello!' }
              },
              {
                role: 'ASSISTANT',
                parts: { text: 'Argh! What brings ye eCommerce Store?' }
              },
              {
                role: 'USER',
                parts: { text: prompt }
              },
              {
                role: 'ASSISTANT',
                parts: { text: 'Called Function' }
              },
              { role: 'USER', parts: { text: JSON.stringify(products) } }
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

      const json2 = await res2.json();

      console.log('JSON2', json2[0].candidates[0]);

      answer = json2[0].candidates[0]?.content.parts[0].text;
    } else {
      console.log('PARTS', parts);
      answer = parts;
    }
  } else {
    console.log('No parts found');
    answer = 'No parts found';
  }

  return NextResponse.json({ response: answer, products: areProducts }, { status: 200 });
}
