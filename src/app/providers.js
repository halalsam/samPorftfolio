'use client';
import { useEffect } from 'react';

export default function Providers({ children }) {
  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import('locomotive-scroll')).default;
      new LocomotiveScroll();
    })();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      document.body.style.cursor = 'default';
      window.scrollTo(0, 0);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  return children;
}
