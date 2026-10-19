'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';

/** Counts up once when scrolled into view. Non-numeric values render as-is. */
interface CounterProps {
  value: number | string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function Counter({ value, decimals = 0, prefix = '', suffix = '', className = '' }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  // Vertical inset only: a horizontal one would hide numbers at the start of
  // a line (inside the left 15%) from the observer, leaving them at 0.
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const numeric = typeof value === 'number';
  const [shown, setShown] = useState<number | string>(numeric ? 0 : value);

  useEffect(() => {
    if (typeof value !== 'number' || !inView) return;
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
