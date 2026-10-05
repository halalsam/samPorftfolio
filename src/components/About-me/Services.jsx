'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { EASE_OUT, useAmount } from '@/components/ui/reveal';
import { artifactPaths, services } from './data';

const FOCUS = 'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal';

/**
 * Wide screens: the four services pinned as one index. Scrolling moves the
 * highlight down the list and swaps in that service's detail beside it;
 * clicking a title scrolls to its stretch. The stage is position: sticky,
 * so nothing hijacks the wheel.
 */
function Pinned() {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const amp = useAmount(1);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const turn = useTransform([scrollYProgress, amp], ([p, a]) => p * 120 * a);
  useMotionValueEvent(scrollYProgress, 'change', (p) => setActive(Math.min(services.length - 1, Math.max(0, Math.floor(p * services.length)))));

  const jump = (i) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const target = top + ((el.offsetHeight - window.innerHeight) * (i + 0.5)) / services.length;
    if (window.__lscroll?.scrollTo) window.__lscroll.scrollTo(target);
    else window.scrollTo({ top: target, behavior: 'smooth' });
  };

  const service = services[active];
  return (
    <div ref={ref} className="relative hidden lg:block" style={{ height: `${services.length * 70 + 30}vh` }}>
      <div className="sticky top-0 grid h-screen grid-cols-12 items-center gap-x-10">
        <ol className="col-span-6 flex flex-col gap-3">
          {services.map((s, i) => (
            <li key={s.title}>
              <button
                type="button"
                onClick={() => jump(i)}
                aria-current={i === active ? 'true' : undefined}
                className={`text-left text-[clamp(2.25rem,3.8vw,4rem)] font-light leading-[1.05] tracking-[-0.03em] transition-colors duration-500 ${FOCUS} ${
                  i === active ? 'text-white' : 'text-white/20 hover:text-white/50'
                }`}
              >
                {s.title}
              </button>
            </li>
          ))}
        </ol>

        <div className="relative col-span-5 col-start-8 min-h-[22rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
            >
              <p className="text-lg leading-relaxed">{service.description}</p>
              <ul className="mt-8">
                {service.tools.map((t) => (
                  <li key={t} className="border-t border-white/10 py-3 text-white">
                    {t}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
          <motion.svg
            aria-hidden
            style={{ rotate: turn }}
            viewBox="0 0 280 280"
            fill="none"
            className="pointer-events-none absolute -bottom-28 -right-16 -z-10 w-72 opacity-60"
          >
            <path fillRule="evenodd" clipRule="evenodd" d={artifactPaths[service.artifact]} className="fill-low" />
          </motion.svg>
        </div>
      </div>
    </div>
  );
}

/** Small screens: the same four services as a plain list. */
function Stacked() {
  return (
    <ol className="lg:hidden">
      {services.map((s) => (
        <li key={s.title} className="border-t border-white/10 py-10">
          <h3 className="text-[clamp(2rem,7vw,3rem)] font-light leading-[1.05] tracking-[-0.02em] text-white">{s.title}</h3>
          <p className="mt-4 max-w-[60ch] text-base leading-relaxed">{s.description}</p>
          <ul className="mt-6 flex flex-col gap-1.5 text-white">
            {s.tools.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

/** "What I do": a pinned, scroll-driven index on wide screens; a list below. */
export default function Services() {
  return (
    <>
      <Pinned />
      <Stacked />
    </>
  );
}
