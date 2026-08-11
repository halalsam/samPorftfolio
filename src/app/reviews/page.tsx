"use client";

import { useActionState, useState } from "react";
import { submitReview, type ReviewFormState } from "./actions";

const initialState: ReviewFormState = { status: "idle" };

export default function ReviewPage() {
  const [state, formAction, pending] = useActionState(
    submitReview,
    initialState
  );
  const [rating, setRating] = useState(0);

  if (state.status === "success") {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="font-mono text-sm text-white/40 mb-4">
            {"> submission received"}
          </p>
          <h1 className="text-3xl font-semibold mb-3">Thank you.</h1>
          <p className="text-white/60">
            Your review's been logged. Appreciate you taking the time.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-xl mx-auto">
        <p className="font-mono text-sm text-white/40 mb-4">
          {"> leave a review"}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight mb-2">
          How'd it go?
        </h1>
        <p className="text-white/60 mb-12">
          A few quick questions about the project we built together.
        </p>

        <form action={formAction} className="space-y-8">
          <Field label="Name" error={state.fieldErrors?.name}>
            <input
              name="name"
              type="text"
              placeholder="Your name"
              className="field-input"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <Field label="Email" error={state.fieldErrors?.email}>
              <input
                name="email"
                type="email"
                placeholder="you@company.com"
                className="field-input"
              />
            </Field>
            <Field label="Phone" error={state.fieldErrors?.phone}>
              <input
                name="phone"
                type="tel"
                placeholder="+91 00000 00000"
                className="field-input"
              />
            </Field>
          </div>

          <Field label="Project" error={state.fieldErrors?.project}>
            <input
              name="project"
              type="text"
              placeholder="e.g. 36X"
              className="field-input"
            />
          </Field>

          <Field label="Rating" error={state.fieldErrors?.rating}>
            <input type="hidden" name="rating" value={rating} />
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  aria-pressed={rating === n}
                  className={`h-10 w-10 border text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${
                    n <= rating
                      ? "border-white bg-white text-black"
                      : "border-white/20 text-white/40 hover:border-white/50"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Feedback" error={state.fieldErrors?.feedback}>
            <textarea
              name="feedback"
              rows={5}
              placeholder="What worked well, what could've been better..."
              className="field-input resize-none"
            />
          </Field>

          {state.status === "error" && state.message && (
            <p className="text-sm text-red-400">{state.message}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full sm:w-auto px-8 py-3 bg-white text-black font-medium tracking-tight hover:bg-white/85 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
          >
            {pending ? "Sending..." : "Submit review"}
          </button>
        </form>
      </div>

      <style jsx global>{`
        .field-input {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0.75rem 1rem;
          color: white;
          outline: none;
          transition: border-color 0.15s ease;
        }
        .field-input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }
        .field-input:focus {
          border-color: rgba(255, 255, 255, 0.8);
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block font-mono text-xs uppercase tracking-wider text-white/40 mb-2">
        {label}
      </span>
      {children}
      {error && <span className="block text-xs text-red-400 mt-1">{error}</span>}
    </label>
  );
}
