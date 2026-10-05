import { thunder } from '@/lib/fonts';
import { Rise } from '@/components/ui/reveal';

// A run-in heading ends like a sentence, so the intro can follow it.
const stop = (s) => (/[.!?…:]$/.test(s.trim()) ? s : `${s}.`);

function ChapterMark({ number, label }) {
  return (
    <p className="flex items-end gap-3">
      <Rise text={number} className={`${thunder.className} text-[3.5rem] leading-[0.78] text-pd-accent-text`} />
      <span className="text-sm font-medium text-pd-muted">{label}</span>
    </p>
  );
}

/**
 * Every block sits in one of these. BlockRenderer hands each block a header
 * treatment in `meta.header`, chosen so neighbouring sections never open the
 * same way:
 *   margin  heading pinned in a side column, with the chapter mark when the
 *           block is a chapter; the content flows beside it
 *   runin   the heading runs straight into the intro as one paragraph
 *   poster  the heading set in Thunder at display size
 *   none    the block sets its own opening (Overview, Quote, Cta)
 * Anchors and chapter numbers are derived in BlockRenderer, never typed.
 */
export default function Section({ meta, heading, intro, children, className = '' }) {
  const header = heading || intro ? meta?.header ?? 'runin' : 'none';
  const id = meta?.anchor;

  if (header === 'margin') {
    return (
      <section id={id} className={`scroll-mt-28 pt-28 sm:pt-40 ${className}`}>
        <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-10">
          <header className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
            {meta?.number ? <ChapterMark number={meta.number} label={meta.label} /> : null}
            {heading ? (
              <h2 className={`max-w-[15ch] text-balance text-[clamp(2rem,3.2vw,3rem)] font-light leading-[1.05] tracking-[-0.025em] text-pd-fg ${meta?.number ? 'mt-7' : ''}`}>
                {heading}
              </h2>
            ) : null}
            {intro ? <p className="mt-6 max-w-[38ch] text-base leading-relaxed text-pd-muted sm:text-lg">{intro}</p> : null}
          </header>
          <div className="min-w-0 lg:col-span-8">{children}</div>
        </div>
      </section>
    );
  }

  if (header === 'poster') {
    return (
      <section id={id} className={`scroll-mt-28 pt-32 sm:pt-48 ${className}`}>
        {heading ? (
          <Rise
            as="h2"
            text={heading}
            className={`${thunder.className} max-w-[18ch] text-balance text-[clamp(3.25rem,9vw,9.5rem)] uppercase leading-[0.86] text-pd-fg`}
          />
        ) : null}
        {intro ? <p className="mt-8 max-w-[56ch] text-lg leading-relaxed text-pd-muted sm:text-xl">{intro}</p> : null}
        <div className="mt-14 sm:mt-20">{children}</div>
      </section>
    );
  }

  if (header === 'runin') {
    return (
      <section id={id} className={`scroll-mt-28 pt-28 sm:pt-40 ${className}`}>
        <div className="max-w-[46ch] text-pretty text-[clamp(1.375rem,2.1vw,1.875rem)] leading-[1.32] tracking-[-0.01em]">
          {heading ? <h2 className="inline font-medium text-pd-fg">{stop(heading)}</h2> : null}
          {heading && intro ? ' ' : null}
          {intro ? <p className="inline text-pd-muted">{intro}</p> : null}
        </div>
        <div className="mt-12 sm:mt-16">{children}</div>
      </section>
    );
  }

  return (
    <section id={id} className={`scroll-mt-28 pt-24 sm:pt-36 ${className}`}>
      {children}
    </section>
  );
}
