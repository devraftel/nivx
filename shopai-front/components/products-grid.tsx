// 'use client';

// import { Product } from 'lib/shopify/types';
// import { useState } from 'react';
// const ProductsGrid = () => {
//   const [products, setProducts] = useState([]);

//   return (
//     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
//       {products.map((product: any, idx: number) => {
//         return (
//           <div className="flex flex-col items-center justify-center space-y-2 p-4" key={idx}>
//             <div className="h-48 w-48">
//               <img src={product.images[0].src} alt={product.title} />
//             </div>
//             <div className="flex flex-col items-center justify-center space-y-2">
//               <h2 className="text-xl font-semibold">{product.title}</h2>
//               <p className="text-sm">{product.variants[0].price}</p>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default ProductsGrid;
