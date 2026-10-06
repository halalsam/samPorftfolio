'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Locomotive (Lenis) keeps its own scroll position, so client-side
 * navigations would land mid-page. On every route change jump to the top —
 * or to the #anchor if the link has one (e.g. "All work" → /#work).
 */
function useScrollRestoration() {
  const pathname = usePathname();
  useEffect(() => {
    let raf2;
    // wait two frames so the new page's content is laid out first
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const scroller = window.__lscroll;
        const hash = window.location.hash;
        const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
        if (target) {
          if (scroller?.scrollTo) scroller.scrollTo(target, { offset: -80, immediate: true });
          else target.scrollIntoView();
          return;
        }
        if (scroller?.scrollTo) scroller.scrollTo(0, { immediate: true });
        window.scrollTo(0, 0);
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [pathname]);
}

export default function Providers({ children }) {
  useEffect(() => {
    let scroller;
    let cancelled = false;
    import('locomotive-scroll').then(({ default: LocomotiveScroll }) => {
      // Strict Mode mounts this twice in dev; only the surviving mount may
      // create an instance, or two Lenis loops fight over the page.
      if (cancelled) return;
      scroller = new LocomotiveScroll({
        lenisOptions: {
          // While the page is locked (the preloader sets body overflow:
          // hidden), hand wheel events back to the browser so the lock
          // holds; Lenis would otherwise keep scrolling via scrollTo. The
          // lock starts before this instance exists, so stop() can't be used.
          prevent: () => document.body.style.overflow === 'hidden',
          // With the OS reduced-motion setting on, the wheel scrolls natively
          // instead of easing, matching MotionConfig reducedMotion="user".
          smoothWheel: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        },
      });
      // Kept on window so utilities (e.g. scroll-to-top) can drive the
      // smooth scroller instead of fighting it with native scrollTo.
      window.__lscroll = scroller;
    });
    return () => {
      cancelled = true;
      if (!scroller) return;
      scroller.destroy();
      delete window.__lscroll;
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      document.body.style.cursor = 'default';
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  useScrollRestoration();

  return children;
}
