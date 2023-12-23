'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

import main from '../hero-image.png';

export const Hero = () => {
  const FADE_DOWN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' } }
  };

  const IMAGE_FADE_IN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { delay: 0.5 } }
  };

  return (
    <>
      <motion.div
        className="py-4 md:py-6"
        variants={IMAGE_FADE_IN_ANIMATION_VARIANTS}
        initial="hidden"
        animate="show"
      >
        <Image src={main} height={500} width={600} alt="Main Image" priority />
      </motion.div>
      <motion.div
        initial="hidden"
        animate="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        className="px-4 py-4 md:px-8 md:py-8"
      >
        <motion.h1
          className="font-display text-center text-5xl font-bold tracking-[-0.02em] drop-shadow-sm md:text-8xl md:leading-[5.5rem]"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          Nivx
        </motion.h1>
        <motion.p
          className="mt-6 text-center text-2xl md:text-3xl"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          Discover your style. Experience a smarter way to shop with Nivx.
        </motion.p>
      </motion.div>
    </>
  );
};
