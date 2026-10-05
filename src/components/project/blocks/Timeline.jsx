'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useScroll, useTransform } from 'framer-motion';
import { thunder } from '@/lib/fonts';
import Section from '../primitives/Section';
import RichText from '../primitives/RichText';
import { BLEED } from '../theme';

const keyOf = (item) => `${item.date}-${item.title}`;

/** Phones, and anyone who prefers reduced motion: a plain dated log. */
function Log({ items, className }) {
  return (
    <ol className={`flex flex-col gap-12 ${className}`}>
      {items.map((item) => (
        <li key={keyOf(item)} className="grid grid-cols-[minmax(0,5.5rem)_minmax(0,1fr)] gap-x-6">
          <p className={`${thunder.className} text-[2.75rem] uppercase leading-[0.86] text-pd-fg`}>{item.date}</p>
          <div>
            <h3 className="text-xl leading-snug text-pd-fg">{item.title}</h3>
            {item.body ? <RichText value={item.body} className="mt-2 text-base leading-relaxed text-pd-muted" /> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

/**
 * Wide screens: a dated ruler that pans sideways while you scroll. The
 * stage is plain `position: sticky` (nothing hijacks the wheel); the
 * section is exactly as tall as the pan, and the accent fill on the axis
 * tracks how far through you are.
 */
function Ruler({ items, className }) {
  const outer = useRef(null);
  const track = useRef(null);
  const [distance, setDistance] = useState(0);
  const span = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: outer, offset: ['start start', 'end end'] });
  const x = useTransform([scrollYProgress, span], ([p, d]) => -p * d);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => {
      const d = Math.max(0, el.scrollWidth - el.parentElement.clientWidth);
      span.set(d);
      setDistance(d);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(el.parentElement);
    return () => ro.disconnect();
  }, [span]);

  return (
    <div ref={outer} className={`relative ${BLEED} ${className}`} style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="relative w-max px-5 sm:px-10 lg:px-14">
          <span aria-hidden className="absolute inset-x-5 top-0 h-px bg-pd-line sm:inset-x-10 lg:inset-x-14">
            <motion.span style={{ scaleX: scrollYProgress }} className="block h-full w-full origin-left bg-pd-accent" />
          </span>
          <ol className="flex gap-x-[clamp(3rem,6vw,7rem)]">
            {items.map((item) => (
              <li key={keyOf(item)} className="relative w-[clamp(17rem,27vw,25rem)] shrink-0 pt-12">
                <span aria-hidden className="absolute left-0 top-0 h-5 w-px -translate-y-1/2 bg-pd-fg" />
                <p className={`${thunder.className} text-[clamp(3.5rem,6.4vw,6.5rem)] uppercase leading-[0.86] text-pd-fg`}>{item.date}</p>
                <h3 className="mt-6 text-2xl leading-snug text-pd-fg">{item.title}</h3>
                {item.body ? <RichText value={item.body} className="mt-3 text-base leading-relaxed text-pd-muted" /> : null}
              </li>
            ))}
          </ol>
        </motion.div>
      </div>
    </div>
  );
}

/** blocks.timeline — dated milestones. Both layouts are in the markup; CSS
 *  picks one, so server and client always agree. */
export default function Timeline({ block, meta }) {
  const items = block.items ?? [];
  return (
    <Section meta={meta} heading={block.heading}>
      <Log items={items} className="md:motion-safe:hidden" />
      <Ruler items={items} className="hidden md:motion-safe:block" />
    </Section>
  );
}
