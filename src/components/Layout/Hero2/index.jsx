'use client';
import { slideUpTitle } from '@/animation/anim';
import { useScroll, useTransform, motion } from 'framer-motion';
import React, { useRef } from 'react';
import localFont from 'next/font/local';
import MagneticButton from '@/components/Common/magnetic-button';

const thunder = localFont({
  src: '../../../fonts/Thunder/Thunder-BlackLC.otf',
});
const Hero2 = () => {
  const container = useRef();
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end end'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [5, 2]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 3]);

  return (
    <section
      ref={container}
      id="hero"
      className="mb-[-100svh] overflow-hidden py-0"
    >
      <div className="section-padding relative top-0 flex h-svh w-full justify-center sm:items-center">
        {/* The blob used to keep its 1186px height attribute while CSS set
            only the width, giving a tall mostly-empty box with the circle
            centred 593px above its bottom edge. It is now a square box whose
            bottom offset (12% + 593px - half its width) keeps the circle in
            the same spot. The relative parent also lets the section's
            overflow-hidden clip it, so the scaled-up blob can no longer push
            the page sideways on phones. */}
        <motion.svg
          viewBox="0 0 1186 1186"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[calc(12%+593px-35vw)] z-0 aspect-square h-auto w-[70%] opacity-5 sm:bottom-[calc(12%+593px-30vw)] sm:w-3/5 lg:bottom-[calc(12%+593px-20vw)] lg:w-2/5"
          style={{ y, scale, willChange: 'transform' }}
        >
          <circle
            cx="593"
            cy="593"
            r="593"
            fill="url(#paint0_linear_4949_267)"
          ></circle>
          <defs>
            <linearGradient
              id="paint0_linear_4949_267"
              x1="593"
              y1="0"
              x2="593"
              y2="1186"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#DDDDD5"></stop>
              <stop offset="1" stopColor="#DDDDD5" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
        </motion.svg>

        <div className="flex h-full w-full items-center justify-center">
          <Text scrollYProgress={scrollYProgress} />
        </div>
      </div>
      <div></div>
      <div className="h-svh"></div>
    </section>
  );
};

export default Hero2;

const Text = ({ scrollYProgress }) => {
  const opacity = useTransform(scrollYProgress, [0, 0.8], [3, 0]);
  const scale = useTransform(scrollYProgress, [0.1, 1], [1, 0.6]);
  const y = useTransform(scrollYProgress, [0, 0.8], [3, 1]);
  const heroTitle = 'SAM';
  const heroPara =
    'Full-stack developer & designer — apps, web apps, desktop, and the servers behind them If it runs on a screen, I can design it, build it and ship it';
  return (
    <motion.div
      style={{ opacity, scale, y, willChange: 'transform, opacity' }}
      className=" z-10   "
    >
      <div className="hero-title1 flex h-full w-full flex-col px-10 text-[35vw] leading-tight sm:mb-0 sm:items-center sm:text-[20vw]">
        <MagneticButton>
          <div className="flex justify-center">
            {heroTitle.split('').map((word, index) => {
              return (
                <motion.h1
                  key={index}
                  variants={slideUpTitle}
                  initial="initial"
                  animate="open"
                  exit="closed"
                  className={`hero-title relative flex text-end font-medium  ${thunder.className}`}
                >
                  <span className=" inline-block text-end">{word}</span>
                </motion.h1>
              );
            })}
          </div>
        </MagneticButton>

        <div className="hero-para1 relative -mt-2 flex w-full justify-center sm:-mt-6">
          <motion.p
            variants={slideUpTitle}
            initial="initial"
            animate="open"
            exit="closed"
            className="text-secondary-100 hero-para relative mx-auto max-w-[44ch] text-wrap py-1 text-center text-[clamp(15px,4.2vw,20px)] font-medium leading-snug sm:max-w-[40ch] sm:text-[clamp(16px,1.5vw,24px)]"
          >
            {heroPara.split(' ').map((word, index) => {
              return (
                <span key={index} className=" hero-para mr-1.5 inline-block">
                  {word}
                </span>
              );
            })}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};
