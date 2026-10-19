'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PiArrowUpThin } from 'react-icons/pi';
import MagneticButton from '../magnetic-button';

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toTop = () => {
    const scroller = window.__lscroll;
    if (scroller?.scrollTo) {
      scroller.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-8 right-6 z-50 sm:right-10"
        >
          <MagneticButton>
            <button
              type="button"
              aria-label="Scroll to top"
              onClick={toTop}
              className="group flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/40 text-2xl text-white backdrop-blur-md transition-colors duration-300 hover:bg-white hover:text-black"
            >
              <PiArrowUpThin className="transition-transform duration-300 group-hover:-translate-y-1" />
            </button>
          </MagneticButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
