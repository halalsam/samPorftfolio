'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAmount } from '@/components/ui/reveal';
import Section from '../primitives/Section';
import { Framed } from '../primitives/Frames';
import { BLEED } from '../theme';

// Placements on the 12-column grid, cycled. Two-up alternates a wide and a
// narrow shot at different heights; three-up steps down like a contact
// sheet. `depth` is the parallax drift in px (wide screens only).
const LAYOUTS = {
  2: [
    { slot: 'lg:col-span-7', depth: 0 },
    { slot: 'lg:col-span-4 lg:col-start-9 lg:mt-48', depth: 70 },
    { slot: 'lg:col-span-5 lg:col-start-2 lg:-mt-4', depth: 30 },
    { slot: 'lg:col-span-6 lg:col-start-7 lg:mt-32', depth: 80 },
  ],
  3: [
    { slot: 'lg:col-span-5', depth: 0 },
    { slot: 'lg:col-span-4 lg:col-start-6 lg:mt-28', depth: 50 },
    { slot: 'lg:col-span-3 lg:col-start-10 lg:mt-56', depth: 90 },
  ],
};
const SIZES = { 2: '(min-width: 1024px) 55vw, 92vw', 3: '(min-width: 1024px) 40vw, 92vw' };
const WIDE = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';

function Item({ item, className, depth, sizes, step = 0, centered = false }) {
  const ref = useRef(null);
  const amp = useAmount(depth, WIDE);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform([scrollYProgress, amp], ([p, a]) => (0.5 - p) * a);
  return (
    <motion.figure ref={ref} style={{ y, '--step': step }} className={className}>
      <Framed media={item.media} frame={item.frame} url={item.url} sizes={sizes} />
      {item.caption ? <figcaption className={`mt-4 text-sm text-pd-muted ${centered ? 'text-center' : ''}`}>{item.caption}</figcaption> : null}
    </motion.figure>
  );
}

/** Phones step down a staircase on wide screens (each at its own drift) and
 *  become a swipeable row on small ones. `lg:snap-align-none` matters: once
 *  the row stops scrolling, the page itself (html has scroll-snap-type: y
 *  mandatory) would adopt the phones' snap points and pin the page to them. */
function Staircase({ items }) {
  return (
    <div className={`${BLEED} flex snap-x snap-mandatory items-start gap-5 overflow-x-auto px-5 pb-2 sm:px-10 lg:mx-0 lg:snap-none lg:justify-between lg:gap-10 lg:overflow-visible lg:px-0`}>
      {items.map((item, i) => (
        <Item
          key={item.media.url}
          item={item}
          step={i}
          depth={i * 45}
          sizes="(min-width: 1024px) 26vw, 68vw"
          centered
          className="w-[68vw] max-w-[300px] shrink-0 snap-center lg:snap-align-none lg:mt-[calc(var(--step)*7vw)] lg:w-auto lg:max-w-[340px] lg:flex-1"
        />
      ))}
    </div>
  );
}

/** blocks.gallery — composed, not gridded. Shots stagger across the page at
 *  varied sizes and drift at slightly different speeds; all-phone galleries
 *  become a staircase; `columns: 1` stacks everything full width. Captions
 *  sit under the image, never on it. */
export default function Gallery({ block, meta }) {
  const items = block.items ?? [];
  const phones = items.length > 1 && items.every((it) => it.frame === 'phone');
  const layout = LAYOUTS[Math.min(block.columns, 3)];

  let body;
  if (phones) body = <Staircase items={items} />;
  else if (!layout)
    body = (
      <div className="flex flex-col gap-20">
        {items.map((item) => (
          <Item key={item.media.url} item={item} depth={0} sizes="100vw" />
        ))}
      </div>
    );
  else
    body = (
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-20">
        {items.map((item, i) => {
          const { slot, depth } = layout[i % layout.length];
          return <Item key={item.media.url} item={item} depth={depth} sizes={SIZES[Math.min(block.columns, 3)]} className={slot} />;
        })}
      </div>
    );

  return (
    <Section meta={meta} heading={block.heading}>
      {body}
    </Section>
  );
}
