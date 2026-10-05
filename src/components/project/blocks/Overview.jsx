import { Draw, Rise } from '@/components/ui/reveal';
import Section from '../primitives/Section';
import RichText from '../primitives/RichText';

// "Next.js 16 · React 19 · GSAP" reads better as a stacked spec.
const lines = (value) => String(value ?? '').split(/\s+·\s+/).filter(Boolean);

/** blocks.overview — the opener: the heading as a statement, the facts as a
 *  spec sheet in the margin, the pitch in the reading column. */
export default function Overview({ block, meta }) {
  const facts = block.facts ?? [];
  return (
    <Section meta={meta}>
      {block.heading ? (
        <Rise
          as="h2"
          text={block.heading}
          className="max-w-[20ch] text-balance text-[clamp(2.5rem,5.6vw,5.75rem)] font-light leading-[1.02] tracking-[-0.035em] text-pd-fg"
        />
      ) : null}

      <div className="mt-14 grid gap-14 sm:mt-20 lg:grid-cols-12 lg:gap-x-10">
        <RichText
          value={block.body}
          className="text-xl leading-[1.55] text-pd-muted sm:text-[1.375rem] lg:col-span-7 lg:col-start-5 lg:row-start-1"
        />
        {facts.length ? (
          <div className="lg:col-span-3 lg:col-start-1 lg:row-start-1">
            <Draw className="h-px w-full text-pd-line" />
            <dl className="grid grid-cols-2 gap-x-6 gap-y-8 pt-6 lg:grid-cols-1">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-sm text-pd-faint">{fact.label}</dt>
                  <dd className="mt-1.5 text-base font-medium leading-snug text-pd-fg">
                    {lines(fact.value).map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
      </div>
    </Section>
  );
}
