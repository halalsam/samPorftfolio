'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { thunder } from '@/lib/fonts';
import { useYear } from '@/hooks/useYear';
import { LogoMark } from '@/components/Logo';
import { EMAIL, SOCIALS } from '@/lib/contact';

const LINKS = [
  { label: 'Work', href: '/#work' },
  { label: 'Contact', href: '/contact' },
];

const EASE = [0.16, 1, 0.3, 1];
const DESKTOP = '(min-width: 768px)';

const FOCUS = 'outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current';

// `nav` is the hook the preloader animates in (see pre-loader). The
// underline draws on hover or focus and stays drawn for the current page.
const LINK =
  'nav relative py-1 outline-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:after:scale-x-100 aria-[current=page]:after:scale-x-100 motion-reduce:after:transition-none';

// On the home page, glide to the work index through Locomotive (Lenis)
// instead of jumping; elsewhere the link navigates to /#work as usual.
function glideToWork() {
  const el = document.getElementById('work');
  if (window.__lscroll?.scrollTo) window.__lscroll.scrollTo(el, { offset: -80 });
  else el.scrollIntoView({ behavior: 'smooth' });
}

const isWorkOnHome = (href, pathname) => href === '/#work' && pathname === '/' && !!document.getElementById('work');

/**
 * Fixed top bar. From md up: logo, availability line, inline links, laid out
 * on a three-column grid so the middle line stays centred. Below md the
 * links fold into a full-screen menu, which also surfaces the availability
 * line, email and socials that don't fit the bar on a phone.
 *
 * The bar uses mix-blend-difference so it reads over any section. The menu
 * panel renders as a sibling, outside the blend, so it keeps its own colour.
 */
export const Header = () => {
  const year = useYear();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  // Close on any route change (including back/forward while open).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Rotating the phone or resizing past md: the menu has no meaning there.
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);
    const onChange = (e) => e.matches && setOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // While open: lock the page (Lenis already yields when body overflow is
  // hidden, see providers), keep Tab inside the menu, Escape closes.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusables = () => [toggleRef.current, ...(panelRef.current?.querySelectorAll('a[href]') ?? [])].filter(Boolean);
    focusables()[1]?.focus({ preventScroll: true });

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const onBarLink = (href) => (e) => {
    if (!isWorkOnHome(href, pathname)) return;
    e.preventDefault();
    glideToWork();
  };

  // From the menu: close first so the scroll lock lifts, then glide on the
  // next frames once the page can scroll again.
  const onMenuLink = (href) => (e) => {
    setOpen(false);
    if (!isWorkOnHome(href, pathname)) return;
    e.preventDefault();
    requestAnimationFrame(() => requestAnimationFrame(glideToWork));
  };

  const current = (href) => (href === pathname ? 'page' : undefined);

  return (
    <>
      <header className="header fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
        <div className="grid h-16 grid-cols-[1fr_auto] items-center gap-6 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[env(safe-area-inset-top)] sm:pl-6 sm:pr-6 md:h-20 md:grid-cols-[1fr_auto_1fr] lg:pl-10 lg:pr-10">
          <div className="nav relative flex justify-self-start">
            <Link href="/" aria-label="Sam, home" className={`text-[1.75rem] font-bold leading-none sm:text-3xl ${FOCUS}`}>
              sam
            </Link>
            <LogoMark />
          </div>

          <p className="nav hidden whitespace-nowrap text-sm opacity-70 md:block lg:text-base">Taking on freelance projects in {year}</p>

          <nav aria-label="Main" className="hidden gap-x-8 justify-self-end text-sm md:flex lg:gap-x-10 lg:text-base">
            {LINKS.map(({ label, href }) => (
              <Link key={href} href={href} onClick={onBarLink(href)} aria-current={current(href)} className={LINK}>
                {label}
              </Link>
            ))}
          </nav>

          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
            className={`nav -mr-2 justify-self-end px-2 py-3 text-sm md:hidden ${FOCUS}`}
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            {/* Two stacked words; the stack slides to show the current one. */}
            <span aria-hidden className="block h-[1.25em] overflow-hidden leading-[1.25]">
              <span className={`block transition-transform duration-500 ease-out-expo motion-reduce:transition-none ${open ? '-translate-y-1/2' : ''}`}>
                <span className="block">Menu</span>
                <span className="block">Close</span>
              </span>
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            id="site-menu"
            ref={panelRef}
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%', transition: { duration: 0.55, ease: [0.7, 0, 0.84, 0] } }}
            transition={{ duration: 0.7, ease: EASE }}
            data-lenis-prevent
            className="fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto overscroll-contain bg-[#100f0f] px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[calc(6rem+env(safe-area-inset-top))] text-white sm:px-6 md:hidden"
          >
            <nav aria-label="Main">
              <ul>
                {LINKS.map(({ label, href }, i) => (
                  <li key={href} className="overflow-hidden">
                    <motion.div
                      initial={{ y: '105%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '105%', transition: { duration: 0.3 } }}
                      transition={{ duration: 0.8, delay: 0.25 + i * 0.07, ease: EASE }}
                    >
                      <Link
                        href={href}
                        onClick={onMenuLink(href)}
                        aria-current={current(href)}
                        className={`${thunder.className} block py-1 text-[clamp(4.5rem,26vw,9rem)] leading-[0.9] transition-colors duration-300 hover:text-signal focus-visible:text-signal aria-[current=page]:text-signal outline-none`}
                      >
                        {label}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
              className="mt-12 flex flex-col gap-6 text-base"
            >
              <p className="text-white/60">Taking on freelance projects in {year}</p>
              <a href={EMAIL.href} className={`w-fit break-all text-lg ${FOCUS}`}>
                {EMAIL.label}
              </a>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-white/80">
                {SOCIALS.map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} target="_blank" rel="noopener noreferrer" className={`py-1 ${FOCUS}`}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
