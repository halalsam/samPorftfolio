'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';

/** Counts up once when scrolled into view. Non-numeric values render as-is. */
export default function Counter({ value, decimals = 0, prefix = '', suffix = '', className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  const numeric = typeof value === 'number';
  const [shown, setShown] = useState(numeric ? 0 : value);

  useEffect(() => {
    if (!numeric || !inView) return;
    const controls = animate(0, value, {
      duration: Math.min(2.2, 0.9 + Math.log10(Math.max(value, 1)) * 0.35),
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setShown(v),
    });
    return () => controls.stop();
  }, [inView, numeric, value]);

  const text = numeric
    ? Number(shown).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : shown;

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
}
