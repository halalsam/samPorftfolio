'use client';
import React, { useEffect } from 'react';
import Svg1 from './svg';
import gsap from 'gsap/dist/gsap';
import CustomEase from 'gsap/dist/CustomEase';

const PreLoader = () => {
  gsap.registerPlugin(CustomEase);
  CustomEase.create('smooth', '0.25, 0.1, 0.25, 1');
    CustomEase.create('fast', '0, 0.55, 0.45, 1');
  

  useEffect(() => {
    gsap.set('.img', { y: 500 });
    gsap.set('.loader-img', { x: 500 });
    gsap.set('.hero-title', { y: 300, opacity: 0, scale: 2 });
    gsap.set('.hero-para', { y: 100, opacity: 0 });
    gsap.set('.nav', { y: -100 });
    gsap.set('#hero', { scale: 0.8 });

    const tl = gsap.timeline({ delay: 1 });

    tl.to('.img', {
      y: 0,
      duration: 1.5,
      stagger: 0.5,
      ease: 'power3.inOut',
    })
      .to(
        '.loader-img',
        {
          x: 0,
          duration: 3,
          ease: 'power3.inOut',
        },
        '-=2.5'
      )
      .to(
        '.img:not(#loader-logo)',
        {
          clipPath: 'polygon(0% 0%,100% 0%,100% 0%,0% 0%)',
          duration: 0.4,
          stagger: 0.1,
          ease: 'power3.inOut',
        },
        '-=1'
      )
      .to(
        '.loader',
        {
          clipPath: 'polygon(0% 0%,100% 0%,100% 0%,0% 0%)',
          duration: 1,
          ease: 'power2.inOut',
        },
        '-=0.5'
      )
      .to(
        '#hero',
        {
          scale: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'smooth',
        },
        '-=0.6'
      )
      .to(
        '.hero-title',
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          scale: 1,
          stagger: 0.02,
          ease: 'power4.out',
        },
        '-=0.6'
      )
      .to(
        '.hero-para',
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.01,
          ease: 'power4.inOut',
        },
        '-=1.3'
      )
      .to(
        '.nav',
        {
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power4.inOut',
        },
        '-=1'
      );
  }, []);

  return (
    <div className="loader pointer-events-none fixed z-[999] h-[100vh] w-[100vw]  bg-[#181818] ">
      <div className="loader-img absolute left-1/2 top-1/2 flex w-[150%] -translate-x-1/2 -translate-y-1/2 gap-3 sm:gap-10 ">
        <div className="img">
          <Svg1 src={'c2'} />
        </div>
        <div className="img">
          <Svg1 src={'maven'} />
        </div>
        <div className="img">
          <Svg1 src={'funny'} />
        </div>
        <div className="img" id="loader-logo">
          <Svg1 src={'sam'} />
        </div>
        <div className="img">
          <Svg1 src={'panda'} />
        </div>
        <div className="img">
          <Svg1 src={'powell'} />
        </div>
        <div className="img">
          <Svg1 src={'wix'} />
        </div>
      </div>
    </div>
  );
};

export default PreLoader;
