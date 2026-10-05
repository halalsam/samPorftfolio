'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { thunder } from '@/lib/fonts';

const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  // Drive Locomotive (Lenis) when it's running so the jump stays smooth.
  if (window.__lscroll?.scrollTo) window.__lscroll.scrollTo(el, { offset: -96 });
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

/** Fixed chapter index on very wide screens, built from blocks with a
 *  navLabel: the chapter numbers in Thunder, the current one in accent with
 *  a marker that slides between them. Labels show on hover or focus. */
export default function ChapterRail({ chapters }) {
  const [active, setActive] = useState(chapters[0]?.anchor);

  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.anchor)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [chapters]);

  if (chapters.length < 3) return null;
  return (
    <nav aria-label="Chapters" className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 2xl:block">
      <ol className="flex flex-col items-end">
        {chapters.map((c) => {
          const on = c.anchor === active;
          return (
            <li key={c.anchor}>
              <button
                type="button"
                onClick={() => scrollToId(c.anchor)}
                aria-current={on ? 'location' : undefined}
                className="group relative flex items-center gap-3 py-1.5 pr-3 outline-none"
              >
                <span className="translate-x-1 text-xs text-pd-fg opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none">
                  {c.label}
                </span>
                <span
                  className={`${thunder.className} w-7 text-right text-xl leading-none transition-colors duration-300 ${
                    on ? 'text-pd-accent-text' : 'text-pd-faint group-hover:text-pd-fg group-focus-visible:text-pd-fg'
                  }`}
                >
                  {c.number}
                </span>
                {on ? (
                  <motion.span
                    layoutId="chapter-marker"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute right-0 top-1/2 -mt-2.5 h-5 w-px bg-pd-accent"
                  />
                ) : null}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
