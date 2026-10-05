'use client';

import { useState } from 'react';
import { Curtain, Draw } from '@/components/ui/reveal';
import Section from '../primitives/Section';
import RichText from '../primitives/RichText';
import { MediaFill, aspectOf } from '../primitives/Media';
import { readableOn } from '../theme';

// The palette is listed in order of importance: the first colour gets the
// most room, the second a little less, the supporting colours share the
// rest. Desktop sizes by flex-grow; phones by grid spans and heights.
const GROW = [3, 2];
const PHONE = ['col-span-2 h-44', 'col-span-2 h-32'];

function Swatch({ swatch, index }) {
  const [copied, setCopied] = useState(false);
  const copy = () =>
    navigator.clipboard
      ?.writeText(swatch.hex)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      })
      .catch(() => {});

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${swatch.name} ${swatch.hex}`}
      style={{ backgroundColor: swatch.hex, color: readableOn(swatch.hex), flexGrow: GROW[index] ?? 1 }}
      className={`flex min-w-0 flex-col justify-end p-4 text-left outline-none ring-inset ring-current focus-visible:ring-2 sm:h-72 sm:basis-0 ${PHONE[index] ?? 'h-28'}`}
    >
      <span className="break-words text-sm font-medium leading-tight">{swatch.name}</span>
      <span className="mt-1 font-mono text-xs uppercase opacity-75">{copied ? 'Copied' : swatch.hex}</span>
      <span className="sr-only" aria-live="polite">
        {copied ? `${swatch.hex} copied` : ''}
      </span>
    </button>
  );
}

/** blocks.brand — a specimen sheet: the logo on its own colour, typeface
 *  names set large, and the palette as a strip sized by importance. Click
 *  a swatch to copy its hex. */
export default function Brand({ block, meta }) {
  const palette = block.palette ?? [];
  const typefaces = block.typefaces ?? [];
  return (
    <Section meta={meta} heading={block.heading}>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-10">
        {block.logo ? (
          <Curtain className="lg:col-span-7">
            <div
              className="flex aspect-[4/3] items-center justify-center p-[14%] ring-1 ring-inset ring-pd-line"
              style={{ backgroundColor: block.logoBackground || 'var(--pd-surface)' }}
            >
              <div className="relative w-full max-w-[460px]" style={{ aspectRatio: aspectOf(block.logo, '4 / 1') }}>
                <MediaFill media={block.logo} fit="contain" sizes="(min-width: 1024px) 40vw, 80vw" />
              </div>
            </div>
          </Curtain>
        ) : null}

        <div className={`flex flex-col gap-10 ${block.logo ? 'lg:col-span-5' : 'lg:col-span-8'}`}>
          {block.body ? <RichText value={block.body} className="text-lg leading-relaxed text-pd-muted" /> : null}
          {typefaces.length ? (
            <ul>
              {typefaces.map((t) => (
                <li key={t.name}>
                  <Draw className="h-px w-full text-pd-line" />
                  <p className="pb-6 pt-5">
                    <span className="block text-[clamp(2.25rem,3.6vw,3.5rem)] font-light leading-none tracking-[-0.03em] text-pd-fg">{t.name}</span>
                    {t.role ? <span className="mt-2 block text-sm text-pd-muted">{t.role}</span> : null}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      {palette.length ? (
        <div className="mt-12 grid grid-cols-2 gap-px bg-pd-line p-px sm:flex">
          {palette.map((s, i) => (
            <Swatch key={s.hex + s.name} swatch={s} index={i} />
          ))}
        </div>
      ) : null}
    </Section>
  );
}
