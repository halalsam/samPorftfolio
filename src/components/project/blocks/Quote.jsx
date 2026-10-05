import { Rise } from '@/components/ui/reveal';
import Section from '../primitives/Section';

/** blocks.quote — set large with hanging punctuation: the opening mark sits
 *  out in the margin so the text keeps a clean left edge. Longer quotes
 *  step down a size. */
export default function Quote({ block, meta }) {
  const long = String(block.quote ?? '').length > 180;
  return (
    <Section meta={meta}>
      <figure className="lg:grid lg:grid-cols-12 lg:gap-x-10">
        <blockquote
          className={`text-balance font-light leading-[1.14] tracking-[-0.02em] text-pd-fg lg:col-span-9 lg:col-start-3 ${
            long ? 'text-[clamp(1.5rem,2.6vw,2.5rem)]' : 'text-[clamp(1.875rem,4vw,3.75rem)]'
          }`}
        >
          <p>
            <span aria-hidden className="relative">
              <span className="absolute right-full top-0 pr-[0.06em] text-pd-accent-text">“</span>
            </span>
            <Rise text={block.quote} stagger={0.02} />
            <span aria-hidden className="text-pd-accent-text">”</span>
          </p>
        </blockquote>
        {block.attribution ? (
          <figcaption className="mt-10 lg:col-span-9 lg:col-start-3">
            <span className="block text-base font-medium text-pd-fg">{block.attribution}</span>
            {block.role ? <span className="mt-1 block text-sm text-pd-muted">{block.role}</span> : null}
          </figcaption>
        ) : null}
      </figure>
    </Section>
  );
}
