'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from 'framer-motion';
import { thunder } from '@/lib/fonts';
import SectionTitle from '@/components/Common/section-title';
import MagneticButton from '@/components/Common/magnetic-button';
import WipeText from '@/components/ui/wipe-text';
import { Draw, EASE_OUT, useAmount } from '@/components/ui/reveal';

const FOCUS = 'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-signal';
const UNDERLINE =
  'relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 motion-reduce:after:transition-none';
const SPRING = { stiffness: 220, damping: 26, mass: 0.6 };

const host = (href) => {
  try {
    return new URL(href).host.replace(/^www\./, '');
  } catch {
    return '';
  }
};
// Case studies open here; archive entries say where they go.
const kindOf = (card) => (card.internal ? 'Case study' : host(card.href));

/** A live case study's deployed site, kept outside the row's own link. */
function LiveLink({ card }) {
  return (
    <MagneticButton>
      <a
        href={card.liveHref}
        target="_blank"
        rel="noreferrer"
        aria-label={`${card.name}, live site`}
        className={`group/live inline-flex items-center gap-2.5 py-2 text-sm text-white ${FOCUS}`}
      >
        <span aria-hidden className="h-2 w-2 rounded-full bg-signal" />
        <span className={`${UNDERLINE} group-hover/live:after:scale-x-100 group-focus-visible/live:after:scale-x-100`}>Live</span>
      </a>
    </MagneticButton>
  );
}

function Row({ card, index, dim, onEnter, onFocusRow, onBlurRow }) {
  const Anchor = card.internal ? Link : 'a';
  const external = card.internal ? {} : { target: '_blank', rel: 'noreferrer' };
  return (
    <li
      onPointerEnter={(e) => e.pointerType !== 'touch' && onEnter(index, e.clientX, e.clientY)}
      className={`transition-opacity duration-300 ${dim ? 'opacity-30' : 'opacity-100'}`}
    >
      <Draw className="h-px w-full text-white/15" delay={Math.min(index, 6) * 0.05} />
      <div className="grid grid-cols-12 items-center gap-x-6 gap-y-4 py-7 sm:py-9">
        <Anchor
          href={card.href}
          {...external}
          onFocus={(e) => onFocusRow(index, e.currentTarget)}
          onBlur={onBlurRow}
          className={`group col-span-12 grid grid-cols-12 items-center gap-x-6 gap-y-3 lg:col-span-10 ${FOCUS}`}
        >
          {/* touch screens get the cover inline; pointers get the floating preview */}
          {card.image ? (
            <span className="relative col-span-12 block aspect-[16/10] overflow-hidden [@media(hover:hover)]:hidden">
              <Image src={card.image} alt="" fill sizes="92vw" className="object-cover" />
            </span>
          ) : null}
          <span className="order-3 col-span-12 text-sm lg:order-none lg:col-span-1">{card.year}</span>
          <WipeText
            color={card.accent}
            className={`${thunder.className} order-2 col-span-12 text-[clamp(3rem,8.5vw,8.5rem)] uppercase leading-[0.86] text-white lg:order-none lg:col-span-7`}
          >
            {card.name}
          </WipeText>
          <span className="order-4 col-span-12 flex flex-col gap-1 text-sm lg:order-none lg:col-span-4">
            <span>{card.role}</span>
            <span className={`w-fit text-white ${UNDERLINE} group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100`}>{kindOf(card)}</span>
          </span>
        </Anchor>
        <div className="col-span-12 lg:col-span-2 lg:justify-self-end">
          {card.internal && card.live && card.liveHref ? <LiveLink card={card} /> : null}
        </div>
      </div>
    </li>
  );
}

/** The cover of whichever row is hovered or focused, floating beside the
 *  pointer on a spring and leaning into its own sideways speed. */
function Preview({ cards, active, armed, x, y, rotate, innerRef }) {
  const show = active !== null;
  return (
    <motion.div
      ref={innerRef}
      aria-hidden
      style={{ x, y, rotate }}
      className="pointer-events-none fixed left-0 top-0 z-30 hidden w-[clamp(16rem,24vw,24rem)] [@media(hover:hover)]:block"
    >
      <motion.div
        initial={false}
        animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.9 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
        className="relative aspect-[16/10] overflow-hidden bg-white/5"
      >
        {armed
          ? cards.map((c, i) =>
              c.image ? (
                <Image
                  key={c.key}
                  src={c.image}
                  alt=""
                  fill
                  sizes="24vw"
                  className={`object-cover transition-opacity duration-300 ${i === active ? 'opacity-100' : 'opacity-0'}`}
                />
              ) : null,
            )
          : null}
      </motion.div>
    </motion.div>
  );
}

/**
 * The home page's project index. One row per project: year, the name set
 * big in Thunder, role and where it leads. Hovering (or keyboard-focusing)
 * a row wipes its name in that project's accent, quiets the other rows and
 * floats its cover beside the pointer. `cards` come from the content layer
 * (getWorkCards): case studies open /projects/[slug], archive entries link
 * out.
 */
const RecentWork = ({ cards = [] }) => {
  const [active, setActive] = useState(null);
  const [armed, setArmed] = useState(false); // covers load on first approach
  const preview = useRef(null);
  const visible = useRef(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING);
  const sy = useSpring(y, SPRING);
  const lean = useAmount(1);
  const vx = useVelocity(sx);
  const rotate = useTransform([vx, lean], ([v, a]) => Math.max(-7, Math.min(7, v / 120)) * a);

  // Park the preview beside a point, flipping to the left near the right
  // edge. The first placement jumps, so it never flies in from a corner.
  const place = (cx, cy) => {
    const w = preview.current?.offsetWidth ?? 0;
    const h = w * 0.625;
    const nx = cx + 28 + w < window.innerWidth - 16 ? cx + 28 : cx - 28 - w;
    const ny = Math.min(Math.max(cy - h / 2, 16), window.innerHeight - h - 16);
    if (visible.current) {
      x.set(nx);
      y.set(ny);
    } else {
      x.jump(nx);
      y.jump(ny);
      sx.jump(nx);
      sy.jump(ny);
      visible.current = true;
    }
  };

  const hide = () => {
    setActive(null);
    visible.current = false;
  };

  // A row can arrive under a still cursor (scrolling, or the first enter),
  // so place the preview from the enter event itself, not just on move.
  const enterRow = (index, cx, cy) => {
    setArmed(true);
    place(cx, cy);
    setActive(index);
  };

  const focusRow = (index, el) => {
    setArmed(true);
    const r = el.getBoundingClientRect();
    place(r.left + r.width * 0.55, r.top + r.height / 2);
    setActive(index);
  };

  return (
    <section id="work" className="my-24 scroll-mt-24">
      <SectionTitle text="Recent Work" />
      <ol
        className="mt-12 sm:mt-16"
        onPointerEnter={(e) => e.pointerType !== 'touch' && setArmed(true)}
        onPointerMove={(e) => e.pointerType !== 'touch' && place(e.clientX, e.clientY)}
        onPointerLeave={hide}
      >
        {cards.map((card, i) => (
          <Row
            key={card.key}
            card={card}
            index={i}
            dim={active !== null && active !== i}
            onEnter={enterRow}
            onFocusRow={focusRow}
            onBlurRow={hide}
          />
        ))}
      </ol>
      <Draw className="h-px w-full text-white/15" />
      <Preview cards={cards} active={active} armed={armed} x={sx} y={sy} rotate={rotate} innerRef={preview} />
    </section>
  );
};

export default RecentWork;
