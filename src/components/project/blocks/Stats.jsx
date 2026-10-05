import { Fragment } from 'react';
import { thunder } from '@/lib/fonts';
import { Draw } from '@/components/ui/reveal';
import Section from '../primitives/Section';
import Counter from '../primitives/Counter';

const NUMBER = `${thunder.className} text-[1.75em] leading-none tracking-normal text-pd-fg`;

const finalValue = (s) =>
  typeof s.value === 'number'
    ? s.value.toLocaleString('en-US', { minimumFractionDigits: s.decimals ?? 0, maximumFractionDigits: s.decimals ?? 0 })
    : s.value;

// "a, b and c."
const joiner = (i, n) => (i === n - 1 ? '.' : i === n - 2 ? ' and ' : ', ');

/** blocks.stats — the numbers set inside one sentence. Each counts up in
 *  Thunder with its final width reserved, so the line never reflows while
 *  it counts; details ride along in brackets and the source is a footnote. */
export default function Stats({ block, meta }) {
  const items = block.items ?? [];
  return (
    <Section meta={meta} heading={block.heading}>
      <p className="max-w-[36ch] text-pretty text-[clamp(1.625rem,3.3vw,3.125rem)] font-light leading-[1.42] tracking-[-0.02em] text-pd-muted">
        {items.map((s, i) => (
          <Fragment key={`${s.label}-${i}`}>
            <span className="relative inline-block">
              <span aria-hidden className={`invisible ${NUMBER}`}>
                {s.prefix}
                {finalValue(s)}
                {s.suffix}
              </span>
              <Counter
                value={s.value}
                decimals={s.decimals}
                prefix={s.prefix ?? ''}
                suffix={s.suffix ?? ''}
                className={`absolute inset-0 ${NUMBER}`}
              />
            </span>{' '}
            <span className="text-pd-fg">{s.label}</span>
            {s.detail ? <span className="text-[0.6em] tracking-normal"> ({s.detail})</span> : null}
            {joiner(i, items.length)}
          </Fragment>
        ))}
      </p>
      {block.note ? (
        <div className="mt-12 max-w-sm">
          <Draw className="h-px w-12 text-pd-faint" />
          <p className="mt-4 text-sm leading-relaxed text-pd-faint">{block.note}</p>
        </div>
      ) : null}
    </Section>
  );
}
