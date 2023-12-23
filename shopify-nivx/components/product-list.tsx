'use client';

import { SearchedProduct, useSearchedProductsStore } from './store/searched-product-store';
import { ProductCard } from './product-card';

import { motion } from 'framer-motion';

export const ProductList = () => {
  const { products } = useSearchedProductsStore();

  const title = `Oops, it's a bit empty here...`;
  const wordVariants = {
    hidden: { opacity: 0 },
    visible: (i: any) => ({ y: 0, opacity: 1, transition: { delay: i * 0.1 } })
  };
  const words = title.split(' ');

  const sentence = `Why not try our AI Sales Assistant on the left? It's powered by the latest AI technology and has a great sense of style. Plus, it promises not to laugh at your jokes!`;
  const wordVariants2 = {
    hidden: { opacity: 0 },
    visible: (i: any) => ({ y: 0, opacity: 1, transition: { delay: i * 0.05 } })
  };

  const words2 = sentence.split(' ');

  if (products.length <= 0)
    return (
      <div className="flex h-full max-w-3xl flex-col items-center justify-center p-6 text-center">
        <div>
          <motion.h2
            initial="hidden"
            animate="visible"
            className="font-display text-center text-4xl font-bold tracking-[-0.02em] drop-shadow-sm md:leading-[5rem]"
          >
            {words.map((word, i) => (
              <motion.span key={word} variants={wordVariants} custom={i}>
                {word}{' '}
              </motion.span>
            ))}
          </motion.h2>
          <motion.p
            initial="hidden"
            animate="visible"
            className="text-center text-xl font-medium tracking-[-0.02em] drop-shadow-sm md:leading-[2rem]"
          >
            {words2.map((word, i) => (
              <motion.span key={word} variants={wordVariants2} custom={i}>
                {word}{' '}
              </motion.span>
            ))}
          </motion.p>
        </div>
      </div>
    );

  return (
    <div className="flex h-full w-full flex-wrap space-x-3">
      {products.map((product: SearchedProduct, idx: number) => {
        return <ProductCard key={idx} product={product} />;
      })}
    </div>
  );
};
