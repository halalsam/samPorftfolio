'use client';

import Link from 'next/link';
import Image from 'next/image';
import { thunder } from '@/lib/fonts';
import { Draw } from '@/components/ui/reveal';
import WipeText from '@/components/ui/wipe-text';

const RISE = 'transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.2,1)] motion-reduce:transition-none';

/** Footer hand-off to the next case study (wraps around). Hover or focus
 *  wipes the title through in the next project's own accent, the same move
 *  as the slab link, and lifts its cover into view. */
export default function NextProject({ next }) {
  if (!next) return null;
  return (
    <section className="mt-36 sm:mt-48">
      <Draw className="h-px w-full text-pd-line" />
      <Link
        href={`/projects/${next.slug}`}
        style={{ '--next': next.accent }}
        className="group relative mt-8 block outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-pd-accent"
      >
        <div className="flex items-start justify-between gap-6">
          <span className="text-sm text-pd-muted">Next project</span>
          {next.cover ? (
            <span aria-hidden className="relative hidden aspect-[16/10] w-[clamp(10rem,18vw,16rem)] overflow-hidden md:block">
              <span className={`absolute inset-0 translate-y-full ${RISE} group-hover:translate-y-0 group-focus-visible:translate-y-0`}>
                <Image src={next.cover.url} alt="" fill sizes="16rem" className="object-cover object-top" />
              </span>
            </span>
          ) : null}
        </div>
        <h2 className={`${thunder.className} mt-2 pt-[0.06em] text-[clamp(5rem,17vw,17rem)] uppercase leading-[1] text-pd-fg`}>
          <WipeText color="var(--next)">{next.title}</WipeText>
        </h2>
        {next.tagline ? <p className="mt-4 max-w-[40ch] text-lg text-pd-muted">{next.tagline}</p> : null}
      </Link>
    </section>
  );
}
