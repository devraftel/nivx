import { NextRequest, NextResponse } from 'next/server';

import { client } from 'scripts/weaviate';
const projectId = 'nivx-408903';

export async function POST(request: NextRequest) {
  const body = await request.json();

  console.log('FUN ROUTE: \t', body.prompt);

  const prompt = body.prompt;
  // const prompt = 'Share a gift for this christmas season!!';

  const data = await fetch(
    `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/gemini-pro:streamGenerateContent`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.VERRTEXVEARER}`,
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
      const query = args.query;
      const description = args.description;

      console.log('Function Name:', functionName);
      console.log('Query:', query);
      console.log('Description:', description);

      const result = await client.graphql
        .get()
        .withClassName('Gemini')
        .withNearText({ concepts: [prompt, query, description] })
        .withLimit(2)
        .withFields('handle title description image shopifyid image')
        .do();

      console.log(JSON.stringify(result, null, 2));

      const products = result.data.Get.Gemini;

      areProducts = products;

      const res2 = await fetch(
        `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/gemini-pro:streamGenerateContent`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ya29.a0AfB_byBdfgl1qrRtZT_xYJlKK-RY-XGwtWsf13TnMXwzIAOoYMRp73naRBma7DJlibdCgeqeS-ePZ-WFyvuQfhemg1njnU77mOLlKySgqCM9vDlvOecwl-3glos_zTSqcNKy7LfK2Op9ZDyWUnHdzVVnZiAcWn_9NfSpE33Lar8aCgYKAZISARISFQHGX2MipFCgRQs0JUK9Lj1oLppUzg0178`,
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

      console.log('JSON2', json2[0].candidates[0]?.content.parts[0].text);

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
