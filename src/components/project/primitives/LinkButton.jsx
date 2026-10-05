'use client';

import MagneticButton from '@/components/Common/magnetic-button';

// What each kind of link is, in words. The label is usually the address.
const KIND = { live: 'Live site', web: 'Website', repo: 'Source', store: 'App store' };

const WIPE = 'transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] motion-reduce:transition-none';

function SlabText({ kind, label }) {
  return (
    <>
      <span className="block text-xs font-medium opacity-70">{kind}</span>
      <span className="mt-1 block whitespace-nowrap text-lg font-medium leading-tight">{label}</span>
    </>
  );
}

/**
 * A content `link` ({ label, href, kind }) in the project-page link language.
 *   default  an address: the kind in small muted type, then the label, with
 *            an accent underline that draws across on hover or focus
 *   primary  the slab, one per view: a square accent block. On hover a
 *            foreground-coloured block wipes up through it carrying an
 *            inverted copy of the text (the copy counter-moves, so it stays
 *            put while the window passes over it). Transform-only.
 */
export default function LinkButton({ link, primary = false }) {
  const kind = KIND[link.kind] ?? KIND.web;

  if (primary) {
    return (
      <MagneticButton>
        <a
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="group relative inline-flex min-w-[15rem] flex-col overflow-hidden bg-pd-accent px-6 py-4 text-pd-accent-fg outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pd-fg"
        >
          <SlabText kind={kind} label={link.label} />
          <span aria-hidden className={`absolute inset-0 translate-y-full overflow-hidden bg-pd-fg text-pd-bg ${WIPE} group-hover:translate-y-0 group-focus-visible:translate-y-0`}>
            <span className={`block h-full -translate-y-full px-6 py-4 ${WIPE} group-hover:translate-y-0 group-focus-visible:translate-y-0`}>
              <SlabText kind={kind} label={link.label} />
            </span>
          </span>
        </a>
      </MagneticButton>
    );
  }

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noreferrer"
      className="group inline-flex items-baseline gap-3 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pd-accent"
    >
      <span className="text-sm text-pd-muted">{kind}</span>
      <span className="relative pb-1 text-lg font-medium text-pd-fg">
        {link.label}
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-pd-line" />
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-pd-accent transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
        />
      </span>
    </a>
  );
}
