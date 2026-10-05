'use client';

import { useState } from 'react';
import { thunder } from '@/lib/fonts';
import { Draw, Rise } from '@/components/ui/reveal';
import WipeText from '@/components/ui/wipe-text';
import { EMAIL, PHONE, SOCIALS } from '@/lib/contact';

const FOCUS = 'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal';

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const copy = () =>
    navigator.clipboard
      ?.writeText(EMAIL.label)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      })
      .catch(() => {});
  return (
    <button type="button" onClick={copy} className={`group text-sm text-white ${FOCUS}`}>
      <span className="relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100 motion-reduce:after:transition-none">
        {copied ? 'Copied' : 'Copy address'}
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Email address copied' : ''}
      </span>
    </button>
  );
}

/** One way to reach me: what it is, the address set large (it wipes to the
 *  signal red on hover or focus), and an optional action on the right. */
function Channel({ label, value, href, external = false, action = null }) {
  return (
    <li>
      <Draw className="h-px w-full text-white/15" />
      <div className="grid grid-cols-12 items-baseline gap-x-6 gap-y-2 py-7 sm:py-9">
        <span className="col-span-12 text-sm text-[#b9bcc1] sm:col-span-3">{label}</span>
        <a
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className={`group col-span-12 min-w-0 ${action ? 'sm:col-span-7' : 'sm:col-span-9'} ${FOCUS}`}
        >
          <WipeText color="#ff2b1f" className="break-words text-[clamp(1.5rem,3.6vw,3.5rem)] font-light leading-[1.05] tracking-[-0.02em] text-white">
            {value}
          </WipeText>
        </a>
        {action ? <div className="col-span-12 sm:col-span-2 sm:justify-self-end">{action}</div> : null}
      </div>
    </li>
  );
}

/** /contact — every channel from the footer, one per row, nothing invented. */
export default function ContactSheet() {
  return (
    <div className="pt-16 sm:pt-24">
      <Rise as="h1" text="Contact" className={`${thunder.className} text-[clamp(5.5rem,22vw,22rem)] uppercase leading-[0.86] text-white`} />
      <p className="mt-8 max-w-[24ch] text-[clamp(1.5rem,2.6vw,2.5rem)] font-light leading-[1.15] tracking-[-0.02em] text-white">
        Have something to build? Write to me.
      </p>

      <ul className="mt-16 sm:mt-24">
        <Channel label="Email" value={EMAIL.label} href={EMAIL.href} action={<CopyEmail />} />
        <Channel label="Phone" value={PHONE.label} href={PHONE.href} />
        {SOCIALS.map((s) => (
          <Channel key={s.label} label={s.label} value={`@${s.handle}`} href={s.href} external />
        ))}
      </ul>
      <Draw className="h-px w-full text-white/15" />
    </div>
  );
}
