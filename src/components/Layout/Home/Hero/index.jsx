'use client';
import React, { useEffect, useRef } from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';
import image from '../../../../../public/man3.png';
import Image from 'next/image';
import gsap from 'gsap';
import { CustomEase } from 'gsap/dist/CustomEase';
import {
  Sticker1,
  Sticker2,
  Sticker3,
  Sticker4,
  Sticker5,
  Sticker6,
} from './stickers';
import localFont from 'next/font/local';
import { motion, useInView } from 'framer-motion';
import MagneticButton from '@/components/Common/magnetic-button';
import Link from 'next/link';
import BorderButton from '@/components/Common/button';

const sam = localFont({
  src: [
    {
      path: './font/Teko-SemiBold.ttf',
      weight: '400',
    },
  ],
});

gsap.registerPlugin(CustomEase);

CustomEase.create('cubic-text', '0.83, 0, 0.17, 1');
CustomEase.create('cubic-bg', '0.16, 1, 0.3, 1');

export const Hero = () => {
  const t1 = gsap.timeline({ defaults: { duration: 2 } });
  const t2 = gsap.timeline({ defaults: { duration: 0.2 } });
  const t3 = gsap.timeline({ defaults: { duration: 2 } });

  useEffect(() => {
    const logoClass = document.querySelectorAll('.logo');
    const paragraphClass = document.querySelectorAll('.paragraph');
    const arrowClass = document.querySelectorAll('.arrow');
    const buttonClass = document.querySelectorAll('.button');
    const bannerClass = document.querySelectorAll('.banner');

    t1.to(logoClass, {
      y: 0,
      duration: 1.5,
      ease: 'cubic-text',
    });

    paragraphClass.forEach((para, index) => {
      const delay = index * 0.2;
      t1.to(
        para,
        {
          y: 0,
          duration: 1.5,
          ease: 'cubic-text',
        },
        delay
      );
    });

    t2.to(arrowClass, {
      x: 0,
      duration: 1.5,
      ease: 'cubic-text',
    });
    t2.to(buttonClass, {
      y: 0,
      duration: 1.5,
      ease: 'cubic-text',
    });
    t3.to(bannerClass, {
      y: 0,
      duration: 2.2,
      ease: 'cubic-bg',
    });
  }, []);

  const phrase =
    'Join me and together well make you or your brand unforgettable online. No nonsense always on cutting edge';
  const phrase2 = 'Freelance web developer';
  const description = useRef(null);
  const intro = useRef(null);

  const isInView = useInView(description);
  const isInView2 = useInView(intro);

  const ButtonclassNames = 'rounded-full h-40 w-40 bg-[#100f0f]';

  return (
    <>
      <div className=" mt-10 ">
        <div className="h-[100vh]">
          <div className="flex  flex-col items-center justify-center px-5 py-10 md:px-24">
            <div className="overflow-hidden text-[13vw] font-bold uppercase leading-[1] tracking-tight xl:text-[14vw]">
              <motion.h1 className={`${sam.className} logo translate-y-full`}>
                Web developer
              </motion.h1>
            </div>
            <div ref={intro} className="mt-5 md:mt-10">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-10">
                <div className=" flex flex-col text-sm lg:text-xl">
                  <div>
                    {phrase2.split(' ').map((word, index) => {
                      return (
                        <span
                          key={index}
                          className="relative inline-flex overflow-hidden px-1"
                        >
                          <motion.span
                            variants={slideUp}
                            custom={index}
                            animate={isInView2 ? 'open' : 'closed'}
                            transition={{ delay: 2 }}
                          >
                            {word}
                          </motion.span>
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-x-3  text-xl  md:justify-end">
                  <div className="overflow-hidden">
                    <Link className="button -translate-y-20" href="/contact">
                      Get in touch
                    </Link>
                  </div>
                  <MagneticButton>
                    <Link
                      href="/contact"
                      className="arrow flex h-10 w-10  translate-x-full items-center justify-center  rounded-full border"
                    >
                      <FaArrowRightLong />
                    </Link>
                  </MagneticButton>
                </div>
              </div>
            </div>
          </div>
          <div className="banner relative h-[48vh] w-full translate-y-64 md:h-[60vh] md:w-[90vw]">
            <div className="relative flex h-full w-full  items-center justify-center rounded-r-full bg-white bg-grid-black/[0.2]">
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-r-full bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
              <div className="relative aspect-[6/12] h-full w-auto">
                <Image
                  src={image}
                  alt="Your Image"
                  fill="true"
                  className="absolute top-0 object-cover"
                />
              </div>
            </div>
            <Sticker1 />
            <Sticker2 />
            <Sticker3 />
            <Sticker4 />
            <Sticker5 />
            <Sticker6 />
          </div>
        </div>
      </div>
      <div className="relative py-[8vh] font-light sm:py-[15vh] lg:py-[21vh]">
        <div
          ref={description}
          className="justify-between px-[5vw] sm:flex sm:px-[8vw] lg:px-[15vw]"
        >
          <div className="relative text-[1.55em] sm:w-1/2 lg:text-[2.5vw]">
            <span className="gap-3">
              {phrase.split(' ').map((word, index) => {
                return (
                  <span
                    key={index}
                    className="relative inline-flex overflow-hidden px-1"
                  >
                    <motion.span
                      variants={slideUp}
                      custom={index}
                      animate={isInView ? 'open' : 'closed'}
                    >
                      {word}
                    </motion.span>
                  </span>
                );
              })}
            </span>
          </div>
          <div className="xs:w-1/2 pt-5 text-sm sm:w-1/3 sm:text-base lg:text-lg">
            <motion.p variants={opacity} animate={isInView ? 'open' : 'closed'}>
              The combination of my passion for design, code & interaction
              positions me in a unique place in the web design world.
            </motion.p>
          </div>
        </div>
        <div
          data-scroll
          data-scroll-speed={0.1}
          className=" button absolute bottom-20 right-[20%]"
        >
          <BorderButton content={'About me'} className={ButtonclassNames} />
        </div>
      </div>
    </>
  );
};
