import { Fragment } from 'react';
import { Draw } from '@/components/ui/reveal';
import Section from '../primitives/Section';

/** blocks.stack — set like end credits: each group's label right-aligned
 *  against a centre axis, its tools one per line on the other side. */
export default function Stack({ block, meta }) {
  const groups = block.groups ?? [];
  return (
    <Section meta={meta} heading={block.heading}>
      <div className="relative">
        <Draw axis="y" duration={1.6} className="absolute inset-y-0 left-1/2 w-px text-pd-line" />
        <dl className="relative grid grid-cols-2 items-baseline gap-x-12 gap-y-14 sm:gap-x-20">
          {groups.map((group) => (
            <Fragment key={group.label}>
              <dt className="text-right text-sm text-pd-muted sm:text-base">{group.label}</dt>
              <dd>
                <ul className="flex flex-col gap-1.5">
                  {group.items.map((item) => (
                    <li key={item} className="text-base leading-snug text-pd-fg sm:text-xl">
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </Fragment>
          ))}
        </dl>
      </div>
    </Section>
  );
}
