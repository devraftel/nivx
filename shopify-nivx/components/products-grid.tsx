'use client';

import { MYProduct, useProductsStore } from './store/products-array';
import { GridProduct } from './grid-product';

const ProductsGrid = () => {
  const { products } = useProductsStore();

  console.log('products', products);

  return (
    <div className="flex h-full w-full flex-wrap space-x-3">
      {products.map((product: MYProduct, idx: number) => {
        return <GridProduct key={idx} product={product} />;
      })}
    </div>
  );
};

export default ProductsGrid;
