import { NextRequest, NextResponse } from 'next/server';
import { client } from 'scripts/weaviate';
import { GoogleAuth } from 'google-auth-library';
import path from 'path';

async function getAccessToken(jsonPath: string) {
  const auth = new GoogleAuth({
    keyFile: jsonPath,
    scopes: 'https://www.googleapis.com/auth/cloud-platform',
  });

  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();
  return accessToken;
}

// Construct an absolute path to the JSON key file
const jsonKeyPath = path.resolve(__dirname, '../../nivx-408903-d25200f4d889.json');



export async function POST(request: NextRequest) {
  const body = await request.json();

  console.log('FUN ROUTE: \t', body.prompt);

  const prompt = body.prompt;
  // const prompt = 'Share a gift for this christmas season!!';

    // Get the access token
  const accessToken = await getAccessToken('nivx-408903-8ce98da433b3.json');  

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
        safety_settings: {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_LOW_AND_ABOVE'
        },
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
            safety_settings: {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_LOW_AND_ABOVE'
            },
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
