'use client';

import { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import MagneticButton from '../Common/magnetic-button';

const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/abeysamm/' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/sameer-khan-837023259/',
  },
  { label: 'Github', href: 'https://github.com/Sammk21' },
];

export default function Footer() {
  const container = useRef();
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end end'],
  });

  return (
    <div className="relative overflow-hidden">
      <div className="relative z-20 h-screen overflow-hidden" ref={container}>
        <Logos scrollProgress={scrollYProgress} />
      </div>
      <div className="z-10 overflow-hidden">
        <Svg scrollProgress={scrollYProgress} />
      </div>
    </div>
  );
}

const Logos = ({ scrollProgress }) => {
  const y = useTransform(scrollProgress, [0, 1], [-200, 0]);

  return (
    <motion.div
      style={{ y }}
      className="z-10 flex h-full flex-col items-center gap-10 px-10 py-16 sm:px-16 sm:py-28"
    >
      <div className="flex w-full flex-col">
        <div className="hidden flex-col text-center text-[6vw] leading-none tracking-tight sm:flex">
          <span>LET'S GET</span>
          <span>
            YOU IN <span className="text-[#ff0000]">CREATIVE</span>
          </span>
          <span>SPACE</span>
        </div>
        <div className="flex flex-col text-center text-[30vw] leading-none tracking-tight sm:hidden">
          <span>LET'S</span>
          <span className="text-[#ff0000]">Talk</span>
        </div>

        <div className="my-10 flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-8">
          <MagneticButton>
            <a
              href="mailto:05sameerk@gmail.com"
              className="block w-full rounded-full border border-[#b9bcc147] px-8 py-4 text-center text-[5vw] sm:w-auto sm:px-12 sm:py-5 sm:text-[1.5vw]"
            >
              <span className="text-[80%]">05sameerk@gmail.com</span>
            </a>
          </MagneticButton>
          <MagneticButton>
            <a
              href="tel:+919321818500"
              className="block w-full rounded-full border border-[#b9bcc147] px-8 py-4 text-center text-[5vw] sm:w-auto sm:px-12 sm:py-5 sm:text-[1.5vw]"
            >
              <span className="text-[80%]">+91 9321818850</span>
            </a>
          </MagneticButton>
        </div>
        <div className="socials mt-16 flex items-center justify-between gap-y-5">
          {SOCIALS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="cta font-base"
            >
              <span className="hover-underline-animation">{label}</span>
            </a>
          ))}
        </div>
        <div className="py-3 text-sm sm:text-lg">
          <p>©2026 Sam, All Rights Reserved • Credits</p>
        </div>
      </div>
    </motion.div>
  );
};

function Svg({ scrollProgress }) {
  const y = useTransform(scrollProgress, [0, 1], [200, 1]);
  const scale = useTransform(scrollProgress, [0, 1], [2, 1]);

  return (
    <motion.svg
      style={{ y, scale }}
      className="absolute top-0 w-[200%]"
      id="c-circle"
      viewBox="0 0 1254 1254"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="627" cy="627" r="627" fill="url(#paint0_radial_3260_3)" />
      <defs>
        <radialGradient
          id="paint0_radial_3260_3"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(627) rotate(90) scale(813)"
        >
          <stop stopColor="#F3F3F3" stopOpacity="0.45" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
}
