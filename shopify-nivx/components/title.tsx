'use client';
import { motion } from 'framer-motion';

export const Title = () => {
  const FADE_DOWN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.15
          }
        }
      }}
    >
      <motion.h1
        className="font-display text-center text-4xl font-bold tracking-[-0.02em] drop-shadow-sm md:text-7xl md:leading-[5rem]"
        variants={FADE_DOWN_ANIMATION_VARIANTS}
      >
        Nivx
      </motion.h1>
      <motion.p className="mt-6 text-center md:text-2xl" variants={FADE_DOWN_ANIMATION_VARIANTS}>
        Shop smarter. Select your shopping style:
      </motion.p>
    </motion.div>
  );
};
