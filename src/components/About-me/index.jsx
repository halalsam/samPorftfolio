'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import SectionTitle from '@/components/Common/section-title';
import { Curtain, Rise, useAmount } from '@/components/ui/reveal';
import Services from './Services';
import Tools from './Tools';
import { INTRO, artifactPaths, stackRows } from './data';

/**
 * About on the home page, in three parts: who (a statement beside the
 * portrait, with one turning mark), what I do (a pinned index of services)
 * and what I use (the tool shelves).
 */
const AboutMe = () => {
  const photo = useRef(null);
  const amp = useAmount(1);
  const { scrollYProgress } = useScroll({ target: photo, offset: ['start end', 'end start'] });
  const photoY = useTransform([scrollYProgress, amp], ([p, a]) => `${(p - 0.5) * 10 * a}%`);
  const turn = useTransform([scrollYProgress, amp], ([p, a]) => p * 140 * a);

  return (
    <section>
      <SectionTitle text="AboutMe." />
      <div className="mt-10 grid gap-12 sm:mt-14 lg:grid-cols-12 lg:items-end lg:gap-x-10">
        <div ref={photo} className="relative lg:col-span-5">
          <Curtain cover="bg-black" className="aspect-[4/5]">
            <motion.div style={{ y: photoY }} className="absolute inset-[-6%]">
              <Image src="/sam2.png" alt="Sam Khan" fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover object-center" />
            </motion.div>
          </Curtain>
          <motion.svg
            aria-hidden
            style={{ rotate: turn }}
            viewBox="0 0 280 280"
            fill="none"
            className="pointer-events-none absolute -right-8 -top-10 w-28 sm:-right-12 sm:w-40"
          >
            <path fillRule="evenodd" clipRule="evenodd" d={artifactPaths.petals} className="fill-low" />
          </motion.svg>
        </div>
        <Rise
          as="p"
          text={INTRO}
          stagger={0.012}
          className="text-[clamp(1.6rem,2.7vw,2.75rem)] font-light leading-[1.18] tracking-[-0.02em] text-white lg:col-span-6 lg:col-start-7"
        />
      </div>

      <div className="mt-36 sm:mt-48">
        <SectionTitle text="WhatIdo." />
        <p className="mt-2 text-xl">apps, web, servers: the lot</p>
        <div className="mt-12">
          <Services />
        </div>
      </div>

      <div className="mt-28 sm:mt-36">
        <SectionTitle text="TheStack." />
        <p className="mt-2 text-xl">tools I ship with, daily</p>
        <div className="mt-12">
          <Tools rows={stackRows} />
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
