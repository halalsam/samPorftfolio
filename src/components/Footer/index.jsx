'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { thunder } from '@/lib/fonts';
import { useAmount } from '@/components/ui/reveal';
import WipeText from '@/components/ui/wipe-text';
import { EMAIL, PHONE, SOCIALS } from '@/lib/contact';
import { useYear } from '@/hooks/useYear';

const UNDERLINE =
  'relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100 motion-reduce:after:transition-none';
const FOCUS = 'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal';

/**
 * The sign-off. No slogan: one plain line, then the email set huge as the
 * thing to click (it wipes to the signal red), the phone, the socials. The
 * whole block drifts up into place as the footer scrolls in.
 */
export default function Footer() {
  const container = useRef(null);
  const year = useYear();
  const amp = useAmount(1);
  const { scrollYProgress } = useScroll({ target: container, offset: ['start end', 'end end'] });
  const y = useTransform([scrollYProgress, amp], ([p, a]) => (p - 1) * 140 * a);

  return (
    <footer ref={container} className="relative overflow-hidden">
      <motion.div style={{ y }} className="flex min-h-[100svh] flex-col justify-between gap-20 px-6 pb-8 pt-28 sm:px-10 sm:pt-36">
        <div>
          <p className="max-w-[22ch] text-[clamp(1.75rem,3.4vw,3.25rem)] font-light leading-[1.1] tracking-[-0.02em] text-white">
            Have something to build? Write to me.
          </p>
          <a href={EMAIL.href} className={`group mt-8 block w-fit max-w-full ${FOCUS}`}>
            <WipeText color="#ff2b1f" className={`${thunder.className} whitespace-nowrap text-[clamp(2.5rem,10vw,13rem)] leading-[0.95] text-white`}>
              {EMAIL.label}
            </WipeText>
          </a>
          <a href={PHONE.href} className={`group mt-8 inline-block text-[clamp(1.25rem,2vw,1.75rem)] text-white ${FOCUS}`}>
            <span className={UNDERLINE}>{PHONE.label}</span>
          </a>
        </div>

        <div className="flex flex-col gap-8 text-sm sm:flex-row sm:items-end sm:justify-between sm:text-base">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {SOCIALS.map(({ label, href }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" className={`group text-white ${FOCUS}`}>
                  <span className={UNDERLINE}>{label}</span>
                </a>
              </li>
            ))}
          </ul>
          <p>© {year} Sam. All rights reserved.</p>
        </div>
      </motion.div>
    </footer>
  );
}
