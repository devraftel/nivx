'use client';

// import { Product } from 'lib/shopify/types';
// import { useState } from 'react';
import { MYProduct, useProductsStore } from './store/products-array';
const ProductsGrid = () => {
  const { products } = useProductsStore();

  console.log('products', products);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
      {products.map((product: MYProduct, idx: number) => {
        return (
          <div className="flex flex-col items-center justify-center space-y-2 p-4" key={idx}>
            <div className="h-48 w-48"></div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h2 className="text-xl font-semibold">{product.title}</h2>
              {/* <p className="text-sm">{product.variants[0].price}</p> */}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductsGrid;
