Voice First Digital Shopping Assistant 

Nivx AI is voice first digital shopping assistant for small and mid size ecommerce businesses.

On Frontend Fronterier Empowring Gen AU Multi Modals to create Immerse Shopping expeience.

## Building the Proof Of Concept: 

End Goals: Better User Expericne, Increases Convesations and Revenue, Get the same personal shopping exprience like we get physically. Powered with multimodal Gen AI modals and Paving the way to create immerse shopping experience in 2d, 3d and metaverse

The proof of concept does the following:
1. Have a Voice First AI Avatar present on the Store Landing Page. 
2. Stage 1: Greet in voice and text. Helps to seamlessily find products, get personal suggestions for clothing wears
3. Stage 2: Combining Voice and Image so you upload your images and ask AI to share best clothing suggestions for you based on the event you want to attend.

Used Multiple Multi Modal LLMs like Gemini Pro, Gemini Vision, OpenAI, and best evals like TrueLens combined with RAG using LLAMA for building Nivix AI.

## Running Locally

1. Clone the repo and cd shopify-nivx

2. Run pnpm install

3. Ensure you have locally authnticated Google Cloud to run Gemini on Vertex AI. 

3a. Create a service user and download your json formatted api keys. From there you will get the private keys and email ENV vars.

4. Rename env.example to .env and fill all env variables

5. run pnpm dev and open localhost:3000

## Running With DOcker

Follow the local steps 1 - 3

Ensure Docker is running on your machine and run the following command:

```
docker buildx build --platform linux/amd64 \
  --build-arg OPENAI_API_KEY="" \
  --build-arg COMPANY_NAME="" \
  --build-arg TWITTER_SITE="" \
  --build-arg SITE_NAME="" \
  --build-arg SHOPIFY_REVALIDATION_SECRET="" \
  --build-arg SHOPIFY_STOREFRONT_ACCESS_TOKEN="" \
  --build-arg SHOPIFY_STORE_DOMAIN="" \
  -t mjunaidca/nivx .

```

Start your containor and pass the .env file

Note: we use buildx build --platform linux/amd64 as their is M2 ship images deployment issue on Google Run. Refer to Google Cloud docs for latest updates.

## Deployment

1. Push your docker image on docker hub

2. Go to Google Cloud Console > Google Run > Deploy your container (din;t forget to add env vars in settings)

Note: Why are we using a service account? ```https://cloud.google.com/docs/authentication```

## Nivx AI Future Development Stages to Become a Successful Startup

Imagine a customer service chatbot that not only processes your queries but also accesses your order history, checks real-time inventory data, and even initiates a refund—all while interacting with you in a conversational manner. This is possible through APIs, which serve as conduits between the chatbot and various databases or services. Your customers can get incredibly rich insights into their data without there needing to be a custom front end.

This is what we are building Nivx AI into. Now after completing the proof of concept we are developing a more scalable backend using FastAPI. This backend will be used to build GenAI powered

- Shopify StoreFront
- ECommerce Apps
- Integration with all other ECommerce Providers

We will offering the agent as an API service so all Headless eCommerce store owners can seamlesily integrate and use it with their eCommerce Business.
