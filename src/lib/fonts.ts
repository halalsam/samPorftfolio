import localFont from 'next/font/local';

// Display face used for oversized titles (also used by Recent-Work).
// `block`, not `swap`: titles animate in on load, and a fallback face
// swapping to Thunder mid-reveal reads as a glitch. It's preloaded, so the
// block period is short.
export const thunder = localFont({
  src: '../fonts/Thunder/Thunder-BlackLC.otf',
  display: 'block',
});
