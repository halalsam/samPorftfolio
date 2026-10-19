import type LocomotiveScroll from 'locomotive-scroll';

declare global {
  interface Window {
    /** The app's smooth scroller, set by app/providers.ts once it loads. */
    __lscroll?: LocomotiveScroll;
  }
}

export {};
