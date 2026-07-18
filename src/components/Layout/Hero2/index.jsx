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
      class="mb-[-100svh] overflow-hidden py-0"
    >
      <div class="section-padding  top-0 flex h-svh w-full justify-center sm:items-center ">
        <motion.svg
          width="1186"
          height="1186"
          viewBox="0 0 1186 1186"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className=" pointer-events-none absolute bottom-[12%] z-0 w-[70%] opacity-5 sm:w-3/5 lg:w-2/5"
          style={{ y, scale: scale }}
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
              <stop stop-color="#DDDDD5"></stop>
              <stop offset="1" stop-color="#DDDDD5" stop-opacity="0"></stop>
            </linearGradient>
          </defs>
        </motion.svg>

        <div className="flex h-full w-full items-center justify-center">
          <Text scrollYProgress={scrollYProgress} />
        </div>
      </div>
      <div></div>
      <div class="h-svh"></div>
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
    "A passionate React/Next developer & web designer Let's collaborate to elevate your digital footprint with style and innovation";
  return (
    <motion.div style={{ opacity: opacity, scale }} class=" z-10   ">
      <div class="hero-title1 flex h-full w-full flex-col px-10 text-[35vw] leading-tight sm:mb-0 sm:items-center sm:text-[20vw]">
        <MagneticButton>
          <div className="flex justify-center">
            {heroTitle.split('').map((word, index) => {
              return (
                <motion.h1
                  style={{ y }}
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

        <div className="hero-para1 relative flex">
          <motion.p
            style={{ y }}
            variants={slideUpTitle}
            initial="initial"
            animate="open"
            exit="closed"
            className="text-secondary-100 hero-para relative max-w-[38ch] text-wrap pl-1  text-center text-[4vw] font-medium sm:pl-0 sm:text-[2vw] lg:text-[1vw]"
          >
            {heroPara.split(' ').map((word, index) => {
              return (
                <span className=" hero-para mr-1.5 inline-block">{word}</span>
              );
            })}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};
