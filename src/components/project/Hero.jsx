'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { thunder } from '@/lib/fonts';
import { isVideo } from '@/lib/content/normalize';
import { Curtain, Draw, EASE_OUT, Rise, useAmount } from '@/components/ui/reveal';
import LinkButton from './primitives/LinkButton';
import { MediaFill, aspectOf } from './primitives/Media';
import { BrowserFrame, PhoneFrame } from './primitives/Frames';
import { BLEED } from './theme';

const rise = {
  hidden: { y: '105%' },
  visible: (i = 0) => ({ y: '0%', transition: { delay: 0.1 + i * 0.045, duration: 0.9, ease: [0.16, 1, 0.3, 1] } }),
};

// The page's one orchestrated load: title letters, then the tagline, the
// links, the spec rule and the media lifting its curtain.
const AT = { tagline: 0.45, media: 0.65, links: 0.75, spec: 0.85 };

/** Video or image heroes run edge to edge across the panel and grow from
 *  slightly inset to full bleed as they scroll up to the top. */
function HeroBand({ media }) {
  const ref = useRef(null);
  const amp = useAmount(1);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] });
  const scale = useTransform([scrollYProgress, amp], ([p, a]) => 1 - (1 - p) * 0.06 * a);
  return (
    <motion.div ref={ref} style={{ scale }} className={`relative mt-16 origin-top sm:mt-24 ${BLEED}`}>
      <Curtain delay={AT.media}>
        <div className="relative w-full" style={{ aspectRatio: aspectOf(media, '16 / 9') }}>
          <MediaFill media={media} priority sizes="100vw" sound={isVideo(media)} />
        </div>
      </Curtain>
    </motion.div>
  );
}

function HeroMedia({ hero }) {
  if (!hero?.media) return null;
  const { variant, media, url } = hero;
  if (variant === 'browser')
    return (
      <div className="mt-16 sm:mt-24">
        <BrowserFrame media={media} url={url} priority sizes="100vw" delay={AT.media} />
      </div>
    );
  if (variant === 'phone')
    return (
      <div className="mt-16 sm:mt-24">
        <PhoneFrame media={media} priority sizes="340px" delay={AT.media} />
      </div>
    );
  return <HeroBand media={media} />;
}

/** Year, role, platforms and (when it's up) a live status, in labelled
 *  columns. The dot is the only status dot on the page and means it. */
function Spec({ project }) {
  const rows = [
    { label: 'Year', value: project.year },
    { label: 'Role', value: project.role },
    { label: 'Platforms', value: project.platforms.join(', ') },
  ].filter((r) => r.value);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: AT.spec, duration: 0.8 }} className="mt-14 sm:mt-20">
      <Draw className="h-px w-full text-pd-line" delay={AT.spec} />
      <dl className="grid grid-cols-2 gap-x-8 gap-y-6 pt-6 md:grid-cols-4">
        {rows.map((r) => (
          <div key={r.label}>
            <dt className="text-sm text-pd-faint">{r.label}</dt>
            <dd className="mt-1.5 text-base leading-snug text-pd-fg">{r.value}</dd>
          </div>
        ))}
        {project.live ? (
          <div>
            <dt className="text-sm text-pd-faint">Status</dt>
            <dd className="mt-1.5 flex items-center gap-2.5 text-base text-pd-fg">
              <span aria-hidden className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pd-accent opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-pd-accent" />
              </span>
              Live
            </dd>
          </div>
        ) : null}
      </dl>
    </motion.div>
  );
}

/** Project header: the giant title, tagline and links, a spec row, then
 *  the hero media. */
export default function Hero({ project }) {
  const [primary, ...rest] = project.links;
  return (
    <header className="flex flex-col">
      <h1 className={`${thunder.className} mt-6 flex flex-wrap text-[clamp(5.5rem,19vw,19rem)] uppercase leading-[0.9] text-pd-fg`} aria-label={project.title}>
        {project.title.split('').map((char, i) => (
          // mask extends above/below the line box so tall glyphs never clip
          <span key={i} aria-hidden className="-my-[0.14em] inline-flex overflow-hidden py-[0.14em]">
            <motion.span variants={rise} custom={i} initial="hidden" animate="visible" className="inline-block">
              {char === ' ' ? ' ' : char}
            </motion.span>
          </span>
        ))}
      </h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
        {project.tagline ? (
          <Rise
            as="p"
            text={project.tagline}
            delay={AT.tagline}
            className="max-w-[22ch] text-balance text-[clamp(1.75rem,3.4vw,3rem)] font-light leading-[1.1] tracking-[-0.02em] text-pd-fg lg:col-span-7"
          />
        ) : null}
        {primary ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: AT.links, duration: 0.8, ease: EASE_OUT }}
            className="flex flex-wrap items-center gap-x-10 gap-y-6 lg:col-span-5 lg:justify-self-end"
          >
            <LinkButton link={primary} primary />
            {rest.map((link) => (
              <LinkButton key={link.href} link={link} />
            ))}
          </motion.div>
        ) : null}
      </div>

      <Spec project={project} />
      <HeroMedia hero={project.hero} />
    </header>
  );
}
