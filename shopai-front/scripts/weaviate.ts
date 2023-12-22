import weaviate, { WeaviateClient, ObjectsBatcher, ApiKey } from 'weaviate-ts-client';
import { getCollectionProducts } from 'lib/shopify';
import { Product } from 'lib/shopify/types';

const client: WeaviateClient = weaviate.client({
    scheme: process.env.WEAVIATE_SCHEME || 'https',
    host: process.env.WEAVIATE_HOST || 'localhost',
    apiKey: new ApiKey(process.env.WEAVIATE_API_KEY!),
    headers: { 'X-OpenAI-Api-Key': `${process.env.OPENAI_API_KEY}` }
  });

// Add the schema
const classObj = {
  'class': 'STORE',
  'vectorizer': 'text2vec-openai',  // If set to "none" you must always provide vectors yourself. Could be any other "text2vec-*" also.
  'moduleConfig': {
    'text2vec-openai': {},
    'generative-openai': {}  // Ensure the `generative-openai` module is used for generative queries
  },
};

async function addSchema() {
  const res = await client.schema.classCreator().withClass(classObj).do();
  console.log(res);
}

// END Add the schema

// Import data function
async function getJsonData() {
    const products: Product[] = await getCollectionProducts({
        collection: 'all-products'
      });
    return products;
}

async function importQuestions() {
  // Get the questions directly from the URL
  const data = await getJsonData();

  // Prepare a batcher
  let batcher: ObjectsBatcher = client.batch.objectsBatcher();
  let counter = 0;
  const batchSize = 100;

  for (const product of data) {
    // Construct an object with a class and properties 'answer' and 'question'
    const obj = {
      class: 'Question',
      properties: {
        title: product.title,
        handle: product.handle,
        description: product.description,
        shopifyid: product.id,
        image: product.featuredImage.url,
        price: product.priceRange.maxVariantPrice.amount,
        currentcyCode: product.priceRange.maxVariantPrice.currencyCode,
        tags: product.tags[0],
          },
    };

    // add the object to the batch queue
    batcher = batcher.withObject(obj);

    // When the batch counter reaches batchSize, push the objects to Weaviate
    if (counter++ == batchSize) {
      // flush the batch queue
      const res = await batcher.do();
      console.log(res);

      // restart the batch queue
      counter = 0;
      batcher = client.batch.objectsBatcher();
    }
  }

  // Flush the remaining objects
  const res = await batcher.do();
  console.log(res);
}

export async function run() {
  await addSchema();
  await importQuestions();
}

