// import { getProduct } from 'lib/shopify';
import Link from 'next/link';
import { GridTileImage } from './grid/tile';
import { SearchedProduct } from './store/searched-product-store';

export const ProductCard = async ({ product }: { product: SearchedProduct }) => {
  //   const product = await getProduct(handle);

  console.log('product', product);

  if (!product) return null;

  return (
    <div
      key={`${product?.handle}`}
      className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
    >
      <Link href={`/product/${product?.handle}`} className="relative h-full w-full">
        <GridTileImage
          alt={product.title}
          label={{
            title: product.title,
            amount: '0',
            currencyCode: 'USD'
            //   amount: product.priceRange.maxVariantPrice.amount,
            //   currencyCode: product.priceRange.maxVariantPrice.currencyCode
          }}
          src={product?.image}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
        />
      </Link>
    </div>
  );
};
