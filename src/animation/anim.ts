import { cubicBezier, type Variants } from 'framer-motion';
const easing = cubicBezier(0.16, 1, 0.3, 1);

export const slideUp: Variants = {
  initial: {
    y: '100%',
  },
  open: (i: number) => ({
    y: '0%',
    transition: { duration: 0.5, delay: 0.01 * i },
  }),
  closed: {
    y: '100%',
    transition: { duration: 0.5 },
  },
};
export const slideUpTitle: Variants = {
  initial: {
    y: '100%',
  },
  open: (i: number) => ({
    y: '0%',
    transition: {
      duration: 0.8,
      delay: 0.03 * i,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
  closed: {
    y: '100%',
    transition: { duration: 0.5 },
  },
};

export const opacity: Variants = {
  initial: {
    opacity: 0,
  },
  open: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
  closed: {
    opacity: 0,
    transition: { duration: 0.5 },
  },
};
export const height: Variants = {
  initial: {
    height: '0%',
  },
  open: {
    height: '100%',
    transition: { duration: 0.5, ease: easing },
  },
  closed: {
    height: 0,
    transition: { duration: 0.5, ease: easing },
  },
};
