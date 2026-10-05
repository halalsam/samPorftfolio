import { thunder } from '@/lib/fonts';
import { Rise } from '@/components/ui/reveal';
import Section from '../primitives/Section';
import RichText from '../primitives/RichText';
import LinkButton from '../primitives/LinkButton';

/** blocks.cta — the closing card, without a card: a Thunder line, one
 *  sentence of context, then the links (the first one as the slab). */
export default function Cta({ block, meta }) {
  const [primary, ...rest] = block.links ?? [];
  return (
    <Section meta={meta}>
      {block.heading ? (
        <Rise
          as="h2"
          text={block.heading}
          className={`${thunder.className} max-w-[16ch] text-balance text-[clamp(3.5rem,10vw,10rem)] uppercase leading-[0.86] text-pd-fg`}
        />
      ) : null}
      {block.body ? <RichText value={block.body} className="mt-8 max-w-[52ch] text-lg leading-relaxed text-pd-muted sm:text-xl" /> : null}
      {primary ? (
        <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6">
          <LinkButton link={primary} primary />
          {rest.map((link) => (
            <LinkButton key={link.href} link={link} />
          ))}
        </div>
      ) : null}
    </Section>
  );
}
