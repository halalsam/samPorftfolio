'use client';

import { useActionState, useEffect, useState } from 'react';
import { thunder } from '@/lib/fonts';
import { Draw, Rise } from '@/components/ui/reveal';
import WipeText from '@/components/ui/wipe-text';
import { submitEnquiry } from '@/actions/enquiry.actions';
import { NEED_OPTIONS } from '@/lib/enquiry';
import { EMAIL } from '@/lib/contact';

const FOCUS = 'outline-hidden focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal';

// Fields are bare type on a hairline that turns signal red on focus, so they
// sit in the same rows as the channels above.
const INPUT =
  'w-full border-0 border-b border-white/25 bg-transparent px-0 pb-3 text-[clamp(1.25rem,2.2vw,2rem)] font-light leading-tight tracking-[-0.01em] text-white outline-hidden transition-colors duration-300 placeholder:text-white/30 focus:border-signal aria-invalid:border-signal motion-reduce:transition-none';

const initialState = { status: 'idle' };

/** One question: label on the left, field on the right, error under it. */
function Row({ id, label, optional = false, error, children }) {
  return (
    <li>
      <Draw className="h-px w-full text-white/15" />
      <div className="grid grid-cols-12 items-baseline gap-x-6 gap-y-3 py-7 sm:py-9">
        <label htmlFor={id} className="col-span-12 text-sm text-[#b9bcc1] sm:col-span-3">
          {label}
          {optional ? <span className="text-white/40"> (optional)</span> : null}
        </label>
        <div className="col-span-12 min-w-0 sm:col-span-9">
          {children}
          {error ? (
            <p id={`${id}-error`} className="mt-3 text-sm text-signal">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </li>
  );
}

/** /contact enquiry — emails me through the submitEnquiry server action. */
export default function EnquiryForm() {
  const [state, formAction, pending] = useActionState(submitEnquiry, initialState);
  // Stamped once on the client, so the server can drop instant (bot) submits.
  const [startedAt, setStartedAt] = useState('');
  useEffect(() => setStartedAt(String(Date.now())), []);

  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};
  const field = (name) => ({
    id: `enquiry-${name}`,
    name,
    defaultValue: values[name] ?? '',
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `enquiry-${name}-error` : undefined,
  });

  return (
    <section className="mt-24 sm:mt-36">
      <Rise as="h2" text="Enquire" className={`${thunder.className} text-[clamp(4rem,14vw,14rem)] uppercase leading-[0.86] text-white`} />
      <p className="mt-6 max-w-[28ch] text-[clamp(1.25rem,2.2vw,2rem)] font-light leading-[1.2] tracking-[-0.02em] text-white">
        Or tell me about the project here.
      </p>

      {state.status === 'success' ? (
        <div className="mt-16 sm:mt-24" role="status">
          <Draw className="h-px w-full text-white/15" />
          <div className="grid grid-cols-12 gap-x-6 gap-y-3 py-7 sm:py-9">
            <span className="col-span-12 text-sm text-signal sm:col-span-3">Sent</span>
            <p className="col-span-12 text-[clamp(1.5rem,3.6vw,3.5rem)] font-light leading-[1.05] tracking-[-0.02em] text-white sm:col-span-9">
              Thanks. Your message is with me, and I&rsquo;ll reply to the email you gave.
            </p>
          </div>
          <Draw className="h-px w-full text-white/15" />
        </div>
      ) : (
        <form action={formAction} noValidate className="mt-16 sm:mt-24">
          {/* Spam traps: a field people never see, and when the form mounted. */}
          <div aria-hidden="true" className="absolute left-[-10000px] h-px w-px overflow-hidden">
            <label htmlFor="enquiry-fax">Leave this empty</label>
            <input id="enquiry-fax" type="text" name="contact_me_by_fax" tabIndex={-1} autoComplete="off" defaultValue="" />
          </div>
          <input type="hidden" name="started_at" value={startedAt} />

          <ul>
            <Row id="enquiry-name" label="Name" error={errors.name}>
              <input {...field('name')} type="text" autoComplete="name" required maxLength={100} placeholder="Your name" className={INPUT} />
            </Row>
            <Row id="enquiry-email" label="Email" error={errors.email}>
              <input {...field('email')} type="email" autoComplete="email" required placeholder="you@company.com" className={INPUT} />
            </Row>
            <Row id="enquiry-need" label="What you need" error={errors.need}>
              <select {...field('need')} required className={`${INPUT} cursor-pointer scheme-dark`}>
                <option value="" disabled>
                  Choose one
                </option>
                {NEED_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className="bg-[#100f0f]">
                    {o.label}
                  </option>
                ))}
              </select>
            </Row>
            <Row id="enquiry-budget" label="Budget" optional error={errors.budget}>
              <input {...field('budget')} type="text" maxLength={80} placeholder="A rough range is fine" className={INPUT} />
            </Row>
            <Row id="enquiry-message" label="Message" error={errors.message}>
              <textarea {...field('message')} required rows={5} maxLength={5000} placeholder="What are you building, and by when?" className={`${INPUT} resize-y`} />
            </Row>
          </ul>
          <Draw className="h-px w-full text-white/15" />

          <div className="grid grid-cols-12 items-baseline gap-x-6 gap-y-4 py-7 sm:py-9">
            <div className="col-span-12 sm:col-span-3" aria-live="polite">
              {state.status === 'error' && state.message ? (
                <p className="text-sm text-signal">
                  {state.message}{' '}
                  <a href={EMAIL.href} className={`underline underline-offset-4 ${FOCUS}`}>
                    {EMAIL.label}
                  </a>
                </p>
              ) : null}
            </div>
            <div className="col-span-12 sm:col-span-9">
              <button type="submit" disabled={pending} className={`group text-left disabled:cursor-wait disabled:opacity-60 ${FOCUS}`}>
                <WipeText color="#ff2b1f" className="text-[clamp(1.5rem,3.6vw,3.5rem)] font-light leading-[1.05] tracking-[-0.02em] text-white">
                  {pending ? 'Sending…' : 'Send enquiry →'}
                </WipeText>
              </button>
            </div>
          </div>
        </form>
      )}
    </section>
  );
}
