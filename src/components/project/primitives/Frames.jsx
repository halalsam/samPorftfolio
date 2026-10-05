'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Curtain, EASE_OUT } from '@/components/ui/reveal';
import { MediaFill, aspectOf } from './Media';

/** The accent hairline under the address strip: runs once like a page load,
 *  then fades out. */
function LoadBar({ delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' });
  return (
    <span ref={ref} aria-hidden className="absolute inset-x-0 -bottom-px h-px">
      <motion.span
        className="block h-full w-full origin-left bg-pd-accent"
        initial={{ scaleX: 0, opacity: 1 }}
        animate={inView ? { scaleX: 1, opacity: 0 } : { scaleX: 0, opacity: 1 }}
        transition={{ scaleX: { duration: 0.9, delay, ease: EASE_OUT }, opacity: { duration: 0.5, delay: delay + 0.85 } }}
      />
    </span>
  );
}

/** Browser: a hairline box with a slim address strip (the URL, nothing
 *  else) whose load bar runs as the frame comes into view. Square, like
 *  everything inside the panel. */
export function BrowserFrame({ media, url, sizes, priority, sound, delay = 0 }) {
  return (
    <div className="border border-pd-line bg-pd-surface">
      <div className="relative flex h-9 items-center border-b border-pd-line px-4 text-xs text-pd-muted">
        <span className="truncate">{url || ' '}</span>
        <LoadBar delay={delay} />
      </div>
      <Curtain cover="bg-pd-surface" delay={delay + 0.3}>
        <div className="relative w-full" style={{ aspectRatio: aspectOf(media) }}>
          <MediaFill media={media} sizes={sizes} priority={priority} sound={sound} />
        </div>
      </Curtain>
    </div>
  );
}

/** Phone: the screen on its own, with its physical corner radius and a
 *  hairline edge. No bezel, no notch. */
export function PhoneFrame({ media, sizes = '(min-width: 1024px) 26vw, 70vw', priority, sound, delay = 0 }) {
  return (
    <div className="mx-auto w-full max-w-[340px] rounded-[2.75rem] bg-pd-surface p-[5px] ring-1 ring-pd-line">
      <Curtain className="rounded-[calc(2.75rem_-_5px)]" cover="bg-pd-surface" delay={delay}>
        <div className="relative w-full" style={{ aspectRatio: aspectOf(media, '9 / 19.5') }}>
          <MediaFill media={media} sizes={sizes} priority={priority} sound={sound} />
        </div>
      </Curtain>
    </div>
  );
}

/** Picks the frame named by the content: 'browser' | 'phone' | 'none'. */
export function Framed({ media, frame = 'none', url, sizes, priority, sound, delay = 0 }) {
  if (!media) return null;
  if (frame === 'browser') return <BrowserFrame media={media} url={url} sizes={sizes} priority={priority} sound={sound} delay={delay} />;
  if (frame === 'phone') return <PhoneFrame media={media} sizes={sizes} priority={priority} sound={sound} delay={delay} />;
  return (
    <Curtain className="border border-pd-line" delay={delay}>
      <div className="relative w-full" style={{ aspectRatio: aspectOf(media) }}>
        <MediaFill media={media} sizes={sizes} priority={priority} sound={sound} />
      </div>
    </Curtain>
  );
}
