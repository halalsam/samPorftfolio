'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import localFont from 'next/font/local';
import {
  motion,
  animate,
  useInView,
  useMotionValue,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from 'framer-motion';
import {
  PiArrowLeftThin,
  PiArrowRightThin,
  PiArrowUpRightThin,
} from 'react-icons/pi';
import { slideUpTitle } from '@/animation/anim';
import { featuredProjects } from '@/lib/projects';
import MagneticButton from '@/components/Common/magnetic-button';

const thunder = localFont({
  src: '../../fonts/Thunder/Thunder-BlackLC.otf',
});

// Featured projects (internal case-study pages) followed by the older
// builds that only link out.
const slides = [
  ...featuredProjects.map((project) => ({
    key: project.slug,
    name: project.name,
    image: project.image,
    accent: project.accent,
    role: project.role,
    year: project.year,
    href: `/projects/${project.slug}`,
    internal: true,
    live: project.live,
    liveHref: project.href,
  })),
  {
    key: 'aelzel',
    name: 'Aelzel',
    image: '/videos/AF.gif',
    accent: '#d4a373',
    role: 'Design & Development',
    year: '2024',
    href: 'https://github.com/Sammk21/AfStore',
    internal: false,
  },
  {
    key: 'dividebyzero',
    name: 'Divide by Zero',
    image: '/images/dividebyzero.webp',
    accent: '#8b5cf6',
    role: 'Design & Development',
    year: '2024',
    href: 'https://github.com/Sammk21/dbz-store-of',
    internal: false,
  },
  {
    key: 'onlyeducation',
    name: 'Only Education',
    image: '/images/onlyeducation.webp',
    accent: '#38bdf8',
    role: 'Development',
    year: '2024',
    href: 'https://onlyeducation.in',
    internal: false,
    live: true,
    liveHref: 'https://onlyeducation.in',
  },
];

const Slide = ({ slide, x }) => {
  const ref = useRef(null);

  // Parallax: the inner image drifts against the drag direction based on
  // how far the slide sits from the viewport centre.
  const imgX = useTransform(x, (latest) => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return 0;
    const center = el.offsetLeft + latest + el.offsetWidth / 2;
    return (center - window.innerWidth / 2) * -0.08;
  });

  // The card nearest the viewport centre sits at full size; the peeking
  // neighbours settle slightly smaller and scale up as they slide in.
  const scale = useTransform(x, (latest) => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return 0.9;
    const center = el.offsetLeft + latest + el.offsetWidth / 2;
    const dist = Math.abs(center - window.innerWidth / 2);
    return 1 - Math.min(dist / window.innerWidth, 1) * 0.18;
  });

  // Pill reveal: fully visible while the card holds the centre, melting
  // away as it slides toward the edges.
  const reveal = useTransform(x, (latest) => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return 0;
    const center = el.offsetLeft + latest + el.offsetWidth / 2;
    const dist = Math.abs(center - window.innerWidth / 2);
    return Math.max(0, Math.min(1, 1 - dist / (window.innerWidth * 0.3)));
  });
  const pillY = useTransform(reveal, (v) => (1 - v) * 24);

  const Anchor = slide.internal ? Link : 'a';
  const anchorProps = slide.internal
    ? { href: slide.href }
    : { href: slide.href, target: '_blank', rel: 'noreferrer' };

  return (
    <motion.div
      ref={ref}
      style={{ scale }}
      className="group relative w-[88vw] shrink-0 sm:w-[64vw] lg:w-[54vw]"
    >
      <Anchor {...anchorProps} draggable={false} className="block">
        <div className="relative">
          {/* YouTube-style hover: an accent-tinted backdrop and outline grow
              out from behind the card, then fade back into the void. */}
          <div
            aria-hidden
            style={{
              backgroundColor: `${slide.accent}40`,
              boxShadow: `0 0 0 1px ${slide.accent}90, 0 0 90px 0 ${slide.accent}40`,
            }}
            className="absolute -inset-3 rounded-2xl opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 sm:-inset-4"
          />
          <div className="relative aspect-[14/9] w-full overflow-hidden">
            <motion.img
              src={slide.image}
              alt={slide.name}
              draggable={false}
              style={{ x: imgX }}
              className="absolute inset-0 h-full w-[120%] max-w-none object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
            <h3
              className={`${thunder.className} pointer-events-none absolute bottom-2 left-4 z-10 whitespace-nowrap text-[clamp(3.5rem,8vw,8rem)] uppercase leading-none text-white mix-blend-difference sm:bottom-4 sm:left-6`}
            >
              {slide.name}
            </h3>
          </div>
        </div>

        <motion.div
          style={{ opacity: reveal, y: pillY }}
          className="mt-6 flex justify-center"
        >
          <span className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-black sm:text-[11px]">
            <span
              style={{
                backgroundColor: slide.accent,
                boxShadow: `0 0 12px ${slide.accent}`,
              }}
              className="h-1.5 w-1.5 rounded-full"
            />
            {slide.role}
            <span className="text-black/40">—</span>
            <span className="text-black/60">{slide.year}</span>
          </span>
        </motion.div>
      </Anchor>

      {/* Live blob — separate anchor floating over the card (never nested
          inside the card link) pointing at the deployed site. */}
      {slide.live && slide.liveHref ? (
        <div className="absolute right-5 top-5 z-20">
          <MagneticButton>
            <a
              href={slide.liveHref}
              target="_blank"
              rel="noreferrer"
              aria-label={`Visit ${slide.name} live`}
              draggable={false}
              className="group/live relative flex h-16 w-16 items-center justify-center rounded-full bg-[#e11d2e] text-[9px] font-bold uppercase tracking-wider text-white transition-colors duration-300 hover:bg-white"
            >
              {/* Default face: blinking white dot + LIVE, exits up-right on hover */}
              <span className="relative flex items-center gap-1.5 transition-all duration-300 ease-out group-hover/live:-translate-y-3 group-hover/live:translate-x-3 group-hover/live:opacity-0">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-90" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                Live
              </span>
              {/* Hover face: red arrow flies in from bottom-left toward top-right */}
              <span className="absolute inset-0 flex -translate-x-3 translate-y-3 items-center justify-center text-2xl text-[#e11d2e] opacity-0 transition-all duration-300 ease-out group-hover/live:translate-x-0 group-hover/live:translate-y-0 group-hover/live:opacity-100">
                <PiArrowUpRightThin />
              </span>
            </a>
          </MagneticButton>
        </div>
      ) : null}
    </motion.div>
  );
};

const RecentWork = () => {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: '-10%' });
  const [maxDrag, setMaxDrag] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const stepRef = useRef(0);
  const draggingRef = useRef(false);

  const x = useMotionValue(0);
  const progress = useSpring(0, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!track || !viewport) return;
      setMaxDrag(Math.max(track.scrollWidth - viewport.offsetWidth, 0));
      const kids = track.children;
      stepRef.current =
        kids.length > 1 ? kids[1].offsetLeft - kids[0].offsetLeft : 0;
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useMotionValueEvent(x, 'change', (latest) => {
    if (maxDrag > 0) progress.set(Math.min(-latest / maxDrag, 1));
    setAtStart(latest >= -1);
    setAtEnd(latest <= -maxDrag + 1);
  });

  const clampX = (value) => Math.max(Math.min(value, 0), -maxDrag);

  // Momentum settles on the nearest slide so a flick never skips far ahead.
  const snapTarget = (target) => {
    const step = stepRef.current;
    if (!step) return clampX(target);
    return clampX(Math.round(target / step) * step);
  };

  const goTo = (direction) => {
    const step = stepRef.current;
    if (!step) return;
    const target = snapTarget(
      Math.round(x.get() / step) * step + direction * -step
    );
    animate(x, target, { type: 'spring', stiffness: 90, damping: 20 });
  };

  // Horizontal trackpad swipes move the slider; vertical page scroll is
  // left untouched.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      x.set(clampX(x.get() - e.deltaX * 0.6));
    };
    viewport.addEventListener('wheel', onWheel, { passive: false });
    return () => viewport.removeEventListener('wheel', onWheel);
  }, [x, maxDrag]);

  return (
    <section className="-mx-10 my-24 overflow-hidden">
      <div
        ref={headingRef}
        className="flex justify-start px-10 pb-12 text-[12vw] font-bold tracking-tight sm:text-[8vw]"
      >
        {'Recent Work'.split('').map((char, index) => (
          <span
            className="relative inline-flex overflow-hidden text-center"
            key={index}
          >
            <motion.span
              className="inline-block"
              variants={slideUpTitle}
              custom={index}
              initial="closed"
              animate={headingInView ? 'open' : 'closed'}
              transition={{ ease: [0.16, 1, 0.3, 1] }}
            >
              {char === ' ' ? '' : char}
            </motion.span>
          </span>
        ))}
      </div>

      <div className="relative">
        <div ref={viewportRef} className="cursor-grab active:cursor-grabbing">
          <motion.div
            ref={trackRef}
            drag="x"
            style={{ x }}
            dragConstraints={{ left: -maxDrag, right: 0 }}
            dragElastic={0.04}
            dragTransition={{
              power: 0.2,
              timeConstant: 180,
              modifyTarget: snapTarget,
            }}
            onDragStart={() => {
              draggingRef.current = true;
            }}
            onDragEnd={() => {
              // Let the trailing click fire (and get swallowed) before
              // re-arming link navigation.
              requestAnimationFrame(() => {
                draggingRef.current = false;
              });
            }}
            onClickCapture={(e) => {
              if (draggingRef.current) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            className="flex w-max items-center gap-[6vw] px-[6vw] pb-16 pt-2 sm:px-[18vw] lg:px-[23vw]"
          >
            {slides.map((slide) => (
              <Slide key={slide.key} slide={slide} x={x} />
            ))}
          </motion.div>
        </div>

        <button
          type="button"
          aria-label="Previous project"
          onClick={() => goTo(-1)}
          disabled={atStart}
          className="absolute left-4 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-2xl text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-black disabled:pointer-events-none disabled:opacity-25 sm:left-8"
        >
          <PiArrowLeftThin />
        </button>
        <button
          type="button"
          aria-label="Next project"
          onClick={() => goTo(1)}
          disabled={atEnd}
          className="absolute right-4 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-2xl text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-black disabled:pointer-events-none disabled:opacity-25 sm:right-8"
        >
          <PiArrowRightThin />
        </button>
      </div>

      <div className="px-10 sm:px-16">
        <div className="relative h-px w-full bg-neutral-800">
          <motion.div
            style={{ scaleX: progress }}
            className="absolute inset-0 origin-left bg-white"
          />
        </div>
      </div>
    </section>
  );
};

export default RecentWork;
