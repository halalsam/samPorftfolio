'use client';

import { Fragment, useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue } from 'framer-motion';

// The site's entrance vocabulary. Each reveal belongs to one kind of element,
// so motion reads as a system instead of one effect applied to everything:
//
//   Rise     type       words come up out of their own masks
//   Curtain  media      a panel in the page colour lifts off, the image settles
//   Draw     structure  rules, axes and underlines draw along their length
//   Fade     fallback   opacity plus a short lift (blur-fade.jsx aliases it)
//
// Transform and opacity only, and each plays once. Reduced motion is handled
// globally by <MotionConfig reducedMotion="user"> in components/Page.js, which
// makes the transforms land instantly instead of travelling.

export const EASE_OUT = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT = [0.7, 0, 0.2, 1];

// Fire slightly before the element is fully on screen.
const VIEW = { once: true, margin: '0px 0px -12% 0px' };

/**
 * Rise — a string set word by word, each word rising out of its own mask. A
 * "\n" in the text starts a new line. Masks are padded above and below (and
 * pulled back with negative margins) so tall glyphs and descenders never
 * clip; inline-flex keeps them on the text baseline.
 */
export function Rise({ as: Tag = 'span', text, className = '', delay = 0, stagger = 0.035, duration = 0.9 }) {
  const ref = useRef(null);
  const inView = useInView(ref, VIEW);
  let n = 0;
  return (
    <Tag ref={ref} className={className}>
      {String(text ?? '')
        .split('\n')
        .map((line, li) => (
          <Fragment key={li}>
            {li > 0 ? <br /> : null}
            {line
              .split(/\s+/)
              .filter(Boolean)
              .map((word, wi) => {
                const i = n++;
                return (
                  <Fragment key={wi}>
                    {wi > 0 ? ' ' : null}
                    <span className="-my-[0.14em] inline-flex overflow-hidden py-[0.14em]">
                      <motion.span
                        className="inline-block"
                        initial={{ y: '110%' }}
                        animate={{ y: inView ? '0%' : '110%' }}
                        transition={{ duration, delay: delay + i * stagger, ease: EASE_OUT }}
                      >
                        {word}
                      </motion.span>
                    </span>
                  </Fragment>
                );
              })}
          </Fragment>
        ))}
    </Tag>
  );
}

/**
 * Curtain — for media. A panel in the page colour covers the box and lifts
 * off (scaleY toward the top) while the media underneath settles from 1.08.
 * `cover` is the panel's background class; size the box from outside or let
 * the children size it.
 */
export function Curtain({ children, className = '', cover = 'bg-pd-bg', delay = 0, duration = 1.1, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, VIEW);
  return (
    <div ref={ref} style={style} className={`relative isolate overflow-hidden ${className}`}>
      <motion.div
        className="h-full w-full"
        initial={{ scale: 1.08 }}
        animate={{ scale: inView ? 1 : 1.08 }}
        transition={{ duration: duration + 0.5, delay, ease: EASE_OUT }}
      >
        {children}
      </motion.div>
      <motion.span
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-10 origin-top ${cover}`}
        initial={{ scaleY: 1 }}
        animate={{ scaleY: inView ? 0 : 1 }}
        transition={{ duration, delay, ease: EASE_IN_OUT }}
      />
    </div>
  );
}

/**
 * Draw — a rule that draws along its length: scaleX from the left, or
 * scaleY from the top. Size and colour come from `className` (the line is
 * painted in currentColor), e.g. "h-px w-full text-pd-line".
 */
export function Draw({ axis = 'x', className = '', delay = 0, duration = 1.2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, VIEW);
  const key = axis === 'x' ? 'scaleX' : 'scaleY';
  return (
    <span ref={ref} aria-hidden className={`block ${className}`}>
      <motion.span
        className={`block h-full w-full bg-current ${axis === 'x' ? 'origin-left' : 'origin-top'}`}
        initial={{ [key]: 0 }}
        animate={{ [key]: inView ? 1 : 0 }}
        transition={{ duration, delay, ease: EASE_OUT }}
      />
    </span>
  );
}

/**
 * Fade — the quiet fallback: opacity plus a short lift. API-compatible with
 * the old BlurFade (inView, delay, duration, yOffset, inViewMargin) so
 * blur-fade.jsx can alias it. Without `inView` it plays on mount.
 */
export function Fade({ children, className, delay = 0, duration = 0.6, yOffset = 10, inView = false, inViewMargin = '-50px' }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, margin: inViewMargin });
  const shown = !inView || seen;
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: yOffset }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset }}
      transition={{ duration, delay: 0.04 + delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

/**
 * For scroll-linked effects (parallax, scroll scale), which MotionConfig
 * doesn't cover: a motion value that is `amount` while `query` matches and 0
 * otherwise. It starts at 0, so server and client render the same markup.
 */
export function useAmount(amount, query = '(prefers-reduced-motion: no-preference)') {
  const value = useMotionValue(0);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => value.set(mq.matches ? amount : 0);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [value, amount, query]);
  return value;
}
