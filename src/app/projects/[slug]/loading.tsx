// Shown the instant a case-study link is clicked, while the page streams in.
// It traces the project hero's layout (top bar, title, tagline and links,
// spec row, media band) so the real page lands in the same places. Each
// project has its own theme, which isn't known yet, so it stays neutral on
// the site's background. It fades in after a short delay, so fast
// navigations never flash it.

const BAR = 'bg-white/[0.06] animate-pulse motion-reduce:animate-none';

export default function Loading() {
  return (
    <main className="py-2" role="status" aria-live="polite">
      <span className="sr-only">Loading project</span>
      <div
        aria-hidden
        className="flex w-full flex-col overflow-hidden rounded-[50px] bg-white/[0.025] px-5 pb-16 pt-10 animate-in fade-in fill-mode-both delay-150 duration-500 motion-reduce:animate-none sm:px-10 sm:pt-14 lg:px-14"
      >
        <div className="flex items-center justify-between gap-4">
          <div className={`h-4 w-20 ${BAR}`} />
          <div className={`h-4 w-24 ${BAR}`} />
        </div>

        <div className="mt-14">
          <div className={`mt-6 h-[clamp(5rem,17vw,17rem)] w-[min(100%,72%)] ${BAR}`} />

          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="flex flex-col gap-3 lg:col-span-7">
              <div className={`h-[clamp(1.6rem,3vw,2.6rem)] w-[min(100%,26rem)] ${BAR}`} />
              <div className={`h-[clamp(1.6rem,3vw,2.6rem)] w-[min(80%,18rem)] ${BAR}`} />
            </div>
            <div className={`h-[4.75rem] w-full max-w-[15rem] lg:col-span-5 lg:justify-self-end ${BAR}`} />
          </div>

          <div className="mt-14 sm:mt-20">
            <div className="h-px w-full bg-white/[0.08]" />
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 pt-6 md:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-2.5">
                  <div className={`h-3 w-12 ${BAR}`} />
                  <div className={`h-4 w-28 ${BAR}`} />
                </div>
              ))}
            </div>
          </div>

          <div className={`-mx-5 mt-16 aspect-[16/9] sm:-mx-10 sm:mt-24 lg:-mx-14 ${BAR}`} />
        </div>
      </div>
    </main>
  );
}
