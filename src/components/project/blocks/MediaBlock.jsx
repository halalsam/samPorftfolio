import Section from '../primitives/Section';
import { Framed } from '../primitives/Frames';

// Where the media sits on the 12-column grid; `full` takes all of it.
const SPAN = { wide: 'lg:col-span-9 lg:col-start-4', narrow: 'lg:col-span-6 lg:col-start-5' };
const SIZES = { wide: '(min-width: 1024px) 70vw, 92vw', narrow: '(min-width: 1024px) 45vw, 92vw' };

/** blocks.media — one image or video in the frame the content names. Wide
 *  and narrow media leave the margin free, so the caption sits there as a
 *  side note, aligned to the bottom of the frame. */
export default function MediaBlock({ block, meta }) {
  const span = SPAN[block.width];
  return (
    <Section meta={meta} heading={block.heading}>
      <figure className={span ? 'grid gap-5 lg:grid-cols-12 lg:gap-x-10' : ''}>
        <div className={span ?? ''}>
          <Framed media={block.media} frame={block.frame} url={block.url} sound={Boolean(block.sound)} sizes={SIZES[block.width] ?? '100vw'} />
        </div>
        {block.caption ? (
          <figcaption
            className={`text-sm leading-relaxed text-pd-muted ${span ? 'lg:col-span-3 lg:col-start-1 lg:row-start-1 lg:self-end' : 'mt-4 max-w-[60ch]'}`}
          >
            {block.caption}
          </figcaption>
        ) : null}
      </figure>
    </Section>
  );
}
