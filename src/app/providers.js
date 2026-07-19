'use client';
import { useEffect } from 'react';

export default function Providers({ children }) {
  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import('locomotive-scroll')).default;
      // Kept on window so utilities (e.g. scroll-to-top) can drive the
      // smooth scroller instead of fighting it with native scrollTo.
      window.__lscroll = new LocomotiveScroll();
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
