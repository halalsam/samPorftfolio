'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap/dist/gsap';
import CustomEase from 'gsap/dist/CustomEase';
import localFont from 'next/font/local';

const thunder = localFont({
  src: '../../fonts/Thunder/Thunder-BlackLC.otf',
});

gsap.registerPlugin(CustomEase);
CustomEase.create('smooth', '0.25, 0.1, 0.25, 1');

// Odometer strip: 0–9 plus a duplicate 0 so the roll past 9 wraps seamlessly.
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const CELL = 100 / DIGITS.length; // yPercent per digit cell

// Manifest lines reveal as the progress value passes each threshold.
const MANIFEST = [
  { at: 1, label: 'DESIGN' },
  { at: 28, label: 'DEVELOPMENT' },
  { at: 56, label: 'MOTION' },
  { at: 82, label: 'DEPLOYMENT' },
];

const CURVE_BULGE = 'M0 0 L100 0 Q50 100 0 0 Z';
const CURVE_FLAT = 'M0 0 L100 0 Q50 0 0 0 Z';

const PreLoader = () => {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const alreadyPlayed =
      window.sessionStorage.getItem('preloaderPlayed') === 'true';

    const ctx = gsap.context(() => {
      // Already ran this session: reveal the hero/nav instantly and hide the
      // overlay without replaying the intro animation.
      if (alreadyPlayed) {
        gsap.set(el, { display: 'none' });
        gsap.set('#hero', { scale: 1 });
        gsap.set('.hero-title', { y: 0, opacity: 1, scale: 1 });
        gsap.set('.hero-para', { y: 0, opacity: 1 });
        gsap.set('.nav', { y: 0 });
        return;
      }

      const q = gsap.utils.selector(el);
      const strips = q('.pl-digit-strip'); // [hundreds, tens, ones]
      const lineInners = q('.pl-line-inner');
      const curve = q('.pl-curve-path');

      const finish = () => {
        window.sessionStorage.setItem('preloaderPlayed', 'true');
        gsap.set(el, { display: 'none' });
        gsap.set('.progress', { autoAlpha: 1 });
      };

      // The scroll-progress bar sits above the overlay (z-9999) — park it
      // until the intro is done.
      gsap.set('.progress', { autoAlpha: 0 });

      // Mirror the anti-FOUC CSS with inline values GSAP can animate from.
      gsap.set('.hero-title', { y: 300, opacity: 0, scale: 2 });
      gsap.set('.hero-para', { y: 100, opacity: 0 });
      gsap.set('.nav', { y: -100 });
      gsap.set('#hero', { scale: 0.8 });
      gsap.set(q('.pl-meta'), { autoAlpha: 0, y: 14 });
      gsap.set(q('.pl-cross'), { autoAlpha: 0, scale: 0.4 });
      gsap.set(q('.pl-monogram'), { autoAlpha: 0, scale: 1 });
      // y: 0 clears the px offset GSAP parses from the anti-FOUC CSS
      // transform (translateY(112%) computes to a px matrix) so it doesn't
      // stack with yPercent.
      gsap.set(lineInners, { yPercent: 112, y: 0 });
      gsap.set(q('.pl-counter-inner'), { yPercent: 112, y: 0 });
      gsap.set(q('.pl-bar-fill'), { scaleX: 0, transformOrigin: 'left center' });

      // Reduced motion: skip the show, fade straight through.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set('#hero', { scale: 1 });
        gsap.set('.hero-title', { y: 0, opacity: 1, scale: 1 });
        gsap.set('.hero-para', { y: 0, opacity: 1 });
        gsap.set('.nav', { y: 0 });
        gsap.to(el, { autoAlpha: 0, duration: 0.5, onComplete: finish });
        return;
      }

      // --- Progress engine: one eased value drives the odometer, the
      // hairline bar and the manifest reveals.
      const state = { v: 0 };
      const revealed = new Array(MANIFEST.length).fill(false);
      const setBar = gsap.quickSetter(q('.pl-bar-fill'), 'scaleX');

      const render = () => {
        const v = state.v;
        // Odometer positions: the ones column rolls continuously; higher
        // columns only roll while the column below sweeps 9 → 0.
        const ones = v % 10;
        const tens = Math.floor(v / 10) + Math.max(0, ones - 9);
        const hundreds = Math.max(0, v - 99);
        gsap.set(strips[0], { yPercent: -hundreds * CELL });
        gsap.set(strips[1], { yPercent: -tens * CELL });
        gsap.set(strips[2], { yPercent: -ones * CELL });
        setBar(v / 100);
        MANIFEST.forEach((m, i) => {
          if (!revealed[i] && v >= m.at) {
            revealed[i] = true;
            gsap.to(lineInners[i], {
              yPercent: 0,
              duration: 0.9,
              ease: 'power4.out',
            });
          }
        });
      };

      const tl = gsap.timeline({ delay: 0.3, onComplete: finish });

      // --- Intro: metadata, grid marks, monogram, counter mask-reveal.
      tl.to(q('.pl-meta'), {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
      })
        .to(
          q('.pl-cross'),
          {
            autoAlpha: 0.5,
            scale: 1,
            duration: 0.7,
            stagger: 0.06,
            ease: 'power3.out',
          },
          0.15
        )
        .to(
          q('.pl-monogram'),
          { autoAlpha: 1, duration: 1.4, ease: 'power2.out' },
          0.2
        )
        // Slow drift for the whole load — subtle depth behind the numbers.
        .to(
          q('.pl-monogram'),
          { scale: 1.08, duration: 4.6, ease: 'none' },
          0.2
        )
        .to(
          q('.pl-counter-inner'),
          { yPercent: 0, duration: 1, ease: 'expo.out' },
          0.35
        )

        // --- Count 0 → 100 in three eased pulls with hesitations,
        // so the odometer feels like a real load, not a stopwatch.
        .to(
          state,
          { v: 34, duration: 1.0, ease: 'power2.inOut', onUpdate: render },
          0.75
        )
        .to(state, {
          v: 68,
          duration: 0.65,
          ease: 'power2.inOut',
          onUpdate: render,
          delay: 0.2,
        })
        .to(state, {
          v: 100,
          duration: 0.95,
          ease: 'power3.inOut',
          onUpdate: render,
          delay: 0.15,
        })

        // --- Exit: content clears, then the curtain lifts with a curved edge.
        .add('exit', '+=0.3')
        .to(
          q('.pl-counter-inner'),
          { yPercent: -112, duration: 0.65, ease: 'power3.in' },
          'exit'
        )
        .to(
          lineInners,
          { yPercent: -115, duration: 0.5, stagger: 0.05, ease: 'power3.in' },
          'exit'
        )
        .to(
          [...q('.pl-meta'), ...q('.pl-cross'), ...q('.pl-monogram')],
          { autoAlpha: 0, duration: 0.45, ease: 'power2.in' },
          'exit'
        )
        .to(
          q('.pl-bar-fill'),
          {
            scaleX: 0,
            transformOrigin: 'right center',
            duration: 0.55,
            ease: 'power3.inOut',
          },
          'exit'
        )
        .to(
          el,
          { yPercent: -100, duration: 1.1, ease: 'power4.inOut' },
          'exit+=0.45'
        )
        .to(
          curve,
          { attr: { d: CURVE_FLAT }, duration: 1.1, ease: 'power4.inOut' },
          'exit+=0.45'
        )

        // --- Handoff: hero scales in under the lifting curtain.
        .to('#hero', { scale: 1, duration: 1.2, ease: 'smooth' }, 'exit+=0.75')
        .to(
          '.hero-title',
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            stagger: 0.03,
            ease: 'power4.out',
          },
          'exit+=0.85'
        )
        .to(
          '.hero-para',
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.012,
            ease: 'power4.out',
          },
          'exit+=1'
        )
        .to(
          '.nav',
          { y: 0, duration: 0.9, stagger: 0.06, ease: 'power4.out' },
          'exit+=1.05'
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="preloader pointer-events-none fixed inset-0 z-[999]"
    >
      {/* Solid panel — the curve below trails it as it lifts */}
      <div className="absolute inset-0 bg-[#100f0f]" />
      <svg
        className="absolute left-0 top-[calc(100%-1px)] h-[26vh] w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path className="pl-curve-path" d={CURVE_BULGE} fill="#100f0f" />
      </svg>

      <div className="absolute inset-0 overflow-hidden">
        <div className="pl-grain" />

        {/* Ghost monogram */}
        <div
          className={`pl-monogram ${thunder.className} pointer-events-none absolute inset-0 flex items-center justify-center text-[58vh] leading-none`}
        >
          SK<span className="mt-[10vh] text-[10vh]">®</span>
        </div>

        {/* Editorial grid marks */}
        <span className="pl-cross left-1/4 top-1/4">+</span>
        <span className="pl-cross left-3/4 top-1/4">+</span>
        <span className="pl-cross left-1/4 top-3/4">+</span>
        <span className="pl-cross left-3/4 top-3/4">+</span>
        <span className="pl-cross left-1/2 top-1/2">+</span>

        {/* Corner metadata */}
        <div className="absolute left-5 top-5 sm:left-8 sm:top-7">
          <p className="pl-meta text-[11px] font-semibold uppercase tracking-[0.35em] text-[#e8e6e3]">
            Sam Khan
          </p>
          <p className="pl-meta mt-1 text-[10px] uppercase tracking-[0.3em] text-[#b9bcc1]/60">
            Folio — Vol. 01
          </p>
        </div>
        <div className="absolute right-5 top-5 text-right sm:right-8 sm:top-7">
          <p className="pl-meta text-[11px] font-semibold uppercase tracking-[0.35em] text-[#e8e6e3]">
            ©2026
          </p>
          <p className="pl-meta mt-1 text-[10px] uppercase tracking-[0.3em] text-[#b9bcc1]/60">
            Freelance web developer
          </p>
        </div>

        {/* Manifest — reveals with progress */}
        <ul className="absolute bottom-6 left-5 sm:bottom-10 sm:left-8">
          {MANIFEST.map((m, i) => (
            <li key={m.label} className="overflow-hidden">
              <span className="pl-line-inner block py-[3px] text-[10px] uppercase tracking-[0.3em] text-[#b9bcc1] sm:text-[11px]">
                <span className="mr-3 text-[#ff2b1f]">
                  0{i + 1}
                </span>
                {m.label}
              </span>
            </li>
          ))}
        </ul>

        {/* Rolling odometer counter */}
        <div className="absolute bottom-4 right-4 overflow-hidden sm:bottom-6 sm:right-8">
          <div
            className={`pl-counter-inner ${thunder.className} flex items-end text-[clamp(120px,30vw,38vh)] leading-none text-[#e8e6e3]`}
          >
            {[0, 1, 2].map((col) => (
              <span key={col} className="pl-digit">
                <span className="pl-digit-strip">
                  {DIGITS.map((d, i) => (
                    <span key={i}>{d}</span>
                  ))}
                </span>
              </span>
            ))}
            <span className="mb-[0.12em] text-[0.28em] text-[#ff2b1f]">%</span>
          </div>
        </div>

        {/* Hairline progress rule */}
        <div className="pl-bar absolute bottom-0 left-0 h-[2px] w-full bg-[#b9bcc1]/10">
          <div className="pl-bar-fill h-full w-full bg-[#ff2b1f]" />
        </div>
      </div>
    </div>
  );
};

export default PreLoader;
