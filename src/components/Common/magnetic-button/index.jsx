'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function MagneticButton({ children }) {
  const magnetic = useRef(null);

  useEffect(() => {
    const el = magnetic.current;
    const xTo = gsap.quickTo(el, 'x', {
      duration: 1,
      ease: 'elastic.out(1, 0.3)',
    });
    const yTo = gsap.quickTo(el, 'y', {
      duration: 1,
      ease: 'elastic.out(1, 0.3)',
    });

    // Bounds are measured once per hover — getBoundingClientRect on every
    // mousemove forces a layout pass per event.
    let bounds = null;
    const onEnter = () => {
      bounds = el.getBoundingClientRect();
    };
    const onMove = (e) => {
      if (!bounds) bounds = el.getBoundingClientRect();
      const x = e.clientX - (bounds.left + bounds.width / 2);
      const y = e.clientY - (bounds.top + bounds.height / 2);
      xTo(x * 0.35);
      yTo(y * 0.35);
    };
    const onLeave = () => {
      bounds = null;
      xTo(0);
      yTo(0);
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return React.cloneElement(children, { ref: magnetic });
}
