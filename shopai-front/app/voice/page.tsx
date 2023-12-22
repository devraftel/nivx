import { VoiceRecorder } from 'components/voice-recorder';
import { getCollectionProducts } from 'lib/shopify';

const page = async () => {
  const allProducts = await getCollectionProducts({
    collection: 'all-products'
  });

  console.log(allProducts.forEach((item) => console.log(item.title)));

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <VoiceRecorder />
    </div>
  );
};

export default page;
