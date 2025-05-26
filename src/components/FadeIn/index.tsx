import { motion, useReducedMotion } from 'motion/react';

const viewport = { once: true };

export function SlideUpFadeIn({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate="visible"
      exit="hidden"
      initial="hidden"
      transition={{ duration: 0.25 }}
      variants={{
        hidden: {
          opacity: 0,
          y: shouldReduceMotion ? -20 : -10,
        },
        visible: {
          opacity: 1,
          y: -20,
        },
      }}
      viewport={viewport}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return children;
  }

  return (
    <motion.div
      animate="visible"
      exit="hidden"
      initial="hidden"
      transition={{ duration: 0.15 }}
      variants={{
        hidden: {
          opacity: 0,
        },
        visible: {
          opacity: 1,
        },
      }}
      viewport={viewport}
    >
      {children}
    </motion.div>
  );
}
