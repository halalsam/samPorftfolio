'use client';

import { Curtain } from '@/components/ui/reveal';
import Section from '../primitives/Section';
import { AutoVideo, aspectOf } from '../primitives/Media';
import { PhoneFrame } from '../primitives/Frames';
import { BLEED } from '../theme';

/** blocks.reel — cinema mode: the 16:9 master runs edge to edge across the
 *  panel, and the 9:16 cut docks over its lower right corner like a second
 *  screen (pulled up by a negative margin, so it stays in the flow and the
 *  overhang never collides with the next section). Both play only on
 *  screen and keep their own sound toggle. */
export default function Reel({ block, meta }) {
  const { landscape, portrait } = block;
  return (
    <Section meta={meta} heading={block.heading} intro={block.caption}>
      {landscape ? (
        <div className={BLEED}>
          <Curtain>
            <div className="relative w-full" style={{ aspectRatio: aspectOf(landscape, '16 / 9') }}>
              <AutoVideo media={landscape} sound className="h-full w-full" />
            </div>
          </Curtain>
        </div>
      ) : null}
      {portrait ? (
        <div
          className={
            landscape
              ? 'relative z-10 -mt-[16%] ml-auto mr-[4%] w-[44%] max-w-[340px] md:-mt-[22%] md:mr-[5%] md:w-[19%]'
              : 'mx-auto w-full max-w-[340px]'
          }
        >
          <PhoneFrame media={portrait} sound delay={0.25} sizes="(min-width: 768px) 19vw, 44vw" />
        </div>
      ) : null}
    </Section>
  );
}
