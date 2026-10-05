import { Draw } from '@/components/ui/reveal';
import Section from '../primitives/Section';
import RichText from '../primitives/RichText';

// Row layouts. Beside a pinned (margin) heading the column is narrow, so the
// tag sits to the left of a stacked title + body; given the full width, the
// row spreads into tag | title | body.
const NARROW = {
  row: 'sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-x-8',
  tag: 'sm:row-span-2 sm:pt-2',
  title: '',
  body: 'sm:col-start-2',
};
const WIDE = {
  row: 'md:grid-cols-12 md:gap-x-10',
  tag: 'md:col-span-2 md:pt-2',
  title: 'md:col-span-4',
  body: 'md:col-span-6',
};
const WIDE_UNTAGGED = { row: 'md:grid-cols-12 md:gap-x-10', tag: '', title: 'md:col-span-5', body: 'md:col-span-7' };

/** blocks.features — an index, not a card grid: each tag labels its row,
 *  then the title, then what it does. Rules draw in as the rows arrive. */
export default function Features({ block, meta }) {
  const items = block.items ?? [];
  const tagged = items.some((it) => it.tag);
  const wide = meta?.header !== 'margin';
  const cols = wide ? (tagged ? WIDE : WIDE_UNTAGGED) : tagged ? NARROW : { row: '', tag: '', title: '', body: '' };

  return (
    <Section meta={meta} heading={block.heading} intro={block.intro}>
      <ul>
        {items.map((item, i) => (
          <li key={item.title}>
            <Draw className="h-px w-full text-pd-line" delay={Math.min(i, 5) * 0.06} />
            <div className={`grid gap-y-3 py-9 ${cols.row}`}>
              {tagged ? <span className={`text-sm font-medium text-pd-accent-text ${cols.tag}`}>{item.tag}</span> : null}
              <h3 className={`text-[1.625rem] font-normal leading-[1.15] tracking-[-0.015em] text-pd-fg ${cols.title}`}>{item.title}</h3>
              <RichText value={item.body} className={`text-base leading-[1.65] text-pd-muted ${cols.body}`} />
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
