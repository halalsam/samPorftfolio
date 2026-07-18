'use client';
// components/CounterAnimation.js
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CounterAnimation = ({ initialValue, finalValue }) => {
  const counterRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { duration: 1 } });

    tl.fromTo(
      counterRef.current,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, ease: 'power2.out' }
    ).to(counterRef.current, {
      innerHTML: finalValue,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(counterRef.current, { opacity: 0, duration: 0.5, delay: 1 }); // Fade out after 1 second delay
      },
    });

    return () => tl.kill(); // Clean up GSAP timeline
  }, [finalValue]);

  return (
    <div className="h-screen bg-black text-white">
      <h1 className="pt-10 text-center text-3xl font-semibold">
        Counter Animation Example
      </h1>

      <div
        ref={counterRef}
        className="fixed inset-0 flex items-center justify-center text-6xl font-bold"
      >
        {initialValue}
      </div>
    </div>
  );
};

export default CounterAnimation;
