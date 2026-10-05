import Section from '../primitives/Section';
import RichText from '../primitives/RichText';

/** blocks.rich-text — long-form writing. In margin mode the heading stays
 *  pinned beside the column while you read; the first paragraph is set as
 *  the lead. */
export default function RichTextBlock({ block, meta }) {
  return (
    <Section meta={meta} heading={block.heading}>
      <RichText
        value={block.body}
        className="max-w-[62ch] text-lg leading-[1.7] text-pd-muted [&>p:first-child]:text-[1.375rem] [&>p:first-child]:leading-[1.5] [&>p:first-child]:text-pd-fg"
      />
    </Section>
  );
}
