'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { slideUpTitle } from '@/animation/anim';

/** The home page's section titles ("AboutMe.", "Recent Work"): bold, set
 *  without spaces, each letter rising out of its own mask once in view. */
export default function SectionTitle({ text, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  return (
    <h2 ref={ref} aria-label={text} className={`flex flex-wrap text-[12vw] font-bold tracking-tight sm:text-[8vw] ${className}`}>
      {text
        .replace(/\s+/g, '')
        .split('')
        .map((char, i) => (
          <span key={i} aria-hidden className="relative inline-flex overflow-hidden">
            <motion.span className="inline-block" variants={slideUpTitle} custom={i} initial="initial" animate={inView ? 'open' : 'initial'}>
              {char}
            </motion.span>
          </span>
        ))}
    </h2>
  );
}
