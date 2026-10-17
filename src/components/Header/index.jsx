'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useYear } from '@/hooks/useYear';
import { LogoMark } from '@/components/Logo';

// `nav` is the hook the preloader animates in (see pre-loader). The
// underline draws on hover or focus and stays drawn for the current page.
const LINK =
  'nav relative py-1 outline-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:after:scale-x-100 aria-[current=page]:after:scale-x-100 motion-reduce:after:transition-none';

export const Header = () => {
  const year = useYear();
  const pathname = usePathname();

  // On the home page, glide to the work index through Locomotive (Lenis)
  // instead of jumping; elsewhere the link navigates to /#work as usual.
  const toWork = (e) => {
    if (pathname !== '/') return;
    const el = document.getElementById('work');
    if (!el) return;
    e.preventDefault();
    if (window.__lscroll?.scrollTo) window.__lscroll.scrollTo(el, { offset: -80 });
    else el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="header fixed left-0 top-0 z-50 w-screen px-3 text-white mix-blend-difference sm:px-6">
      <div className="flex h-16 items-center justify-between gap-6 sm:h-20">
        <div className="nav relative flex">
          <Link href="/" aria-label="Sam, home" className="text-3xl font-bold outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white">
            sam
          </Link>
          <LogoMark />
        </div>

        <div className="flex items-center gap-x-8 text-sm sm:gap-x-10 sm:text-base">
          <p className="nav hidden opacity-70 md:block">Taking on freelance projects in {year}</p>
          <nav aria-label="Main" className="flex gap-x-6 sm:gap-x-8">
            <Link href="/#work" onClick={toWork} className={LINK}>
              Work
            </Link>
            <Link href="/contact" aria-current={pathname === '/contact' ? 'page' : undefined} className={LINK}>
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
