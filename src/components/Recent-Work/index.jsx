'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { featuredProjects } from '@/lib/projects';

// Featured projects (internal case-study pages) followed by the older
// builds that only link out.
const projects = [
  ...featuredProjects.map((project) => ({
    key: project.slug,
    name: project.name,
    image: project.image,
    kind: project.kind,
    blurb: project.blurb,
    tags: project.stack.slice(0, 2).join(' · '),
    href: `/projects/${project.slug}`,
    internal: true,
  })),
  {
    key: 'aelzel',
    name: 'Aelzel',
    image: '/videos/AF.gif',
    kind: 'E-commerce',
    blurb: 'Fashion e-commerce storefront',
    tags: 'Design & Development',
    href: 'https://github.com/Sammk21/AfStore',
    internal: false,
  },
  {
    key: 'dividebyzero',
    name: 'Divide by Zero',
    image: '/images/dividebyzero.webp',
    kind: 'E-commerce',
    blurb: 'Apparel e-commerce storefront',
    tags: 'Design & Development',
    href: 'https://github.com/Sammk21/dbz-store-of',
    internal: false,
  },
  {
    key: 'onlyeducation',
    name: 'Only Education',
    image: '/images/onlyeducation.webp',
    kind: 'Website',
    blurb: 'Education platform',
    tags: 'Development',
    href: 'https://onlyeducation.in',
    internal: false,
  },
];

const VIEWS = [
  { id: 'grid', label: 'Grid' },
  { id: 'list', label: 'Index' },
];

const TICKER = [
  'Available for freelance',
  'Next.js',
  'Medusa',
  'Strapi',
  'React Native',
];

const EASE = [0.16, 1, 0.3, 1];

const focusRing =
  'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff0000]';

const ArrowUpRight = ({ size = 16, strokeWidth = 2, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

const ProjectLink = ({ project, ...props }) =>
  project.internal ? (
    <Link href={project.href} {...props} />
  ) : (
    <a href={project.href} target="_blank" rel="noreferrer" {...props} />
  );

const GridView = () => (
  <div className="grid grid-cols-1 gap-x-10 gap-y-[clamp(56px,8vw,96px)] min-[960px]:grid-cols-2 min-[960px]:pb-40">
    {projects.map((project, index) => (
      <ProjectLink
        key={project.key}
        project={project}
        className={`group flex min-w-0 flex-col gap-5 text-[#b9bcc1] ${focusRing} ${
          index % 2 === 1 ? 'min-[960px]:translate-y-40' : ''
        }`}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-[#141414]">
          <div className="absolute inset-0 transition-transform duration-1000 [transition-timing-function:cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-[1.06] [@media(hover:hover)]:group-focus-visible:scale-[1.06]">
            <Image
              src={project.image}
              alt={`${project.name} preview`}
              fill
              sizes="(min-width: 960px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <span className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 scale-[.6] items-center gap-2 whitespace-nowrap rounded-full bg-[#ff0000] px-6 py-4 text-base font-bold text-[#0A0A0A] opacity-0 [transition:opacity_.4s_ease,transform_.7s_cubic-bezier(.16,1,.3,1)] [@media(hover:hover)]:group-hover:scale-100 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:scale-100 [@media(hover:hover)]:group-focus-visible:opacity-100">
            View project
            <ArrowUpRight />
          </span>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 pt-1">
          <div className="flex min-w-0 flex-col gap-2 max-[560px]:w-full">
            <span className="text-2xl font-bold leading-none sm:text-3xl transition-transform [transition-duration:600ms] [transition-timing-function:cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none [@media(hover:hover)]:group-hover:translate-x-2">
              {project.name}
            </span>
            <span className="text-base text-[#b9bcc1]/60">{project.blurb}</span>
          </div>
          <div className="flex flex-col items-end gap-2.5 max-[560px]:flex-row max-[560px]:flex-wrap max-[560px]:items-start">
            <span className="rounded-full border border-[#2E2E2E] px-3 py-1.5 text-xs uppercase tracking-[0.08em]">
              {project.kind}
            </span>
            <span className="text-sm text-[#b9bcc1]/60">{project.tags}</span>
          </div>
        </div>
      </ProjectLink>
    ))}
  </div>
);

const ListView = () => {
  const [active, setActive] = useState(-1);
  const previewX = useMotionValue(0);
  const previewY = useMotionValue(0);
  const previewIndex = Math.max(active, 0);

  // The floating preview (380 × 285) stays centred on the pointer.
  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    previewX.set(e.clientX - rect.left - 190);
    previewY.set(e.clientY - rect.top - 142);
  };

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={() => setActive(-1)}
      className="relative border-b border-[#232323]"
    >
      {projects.map((project, index) => {
        const isActive = active === index;
        const dimmed = active !== -1 && !isActive;
        return (
          <ProjectLink
            key={project.key}
            project={project}
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            className={`grid grid-cols-[minmax(0,1fr)_auto_28px] items-center gap-x-8 gap-y-1.5 border-t border-[#232323] py-[clamp(20px,3vw,32px)] transition-colors duration-300 max-[959px]:grid-cols-[88px_minmax(0,1fr)_24px] max-[959px]:gap-x-4 ${focusRing} ${
              dimmed ? 'text-[#b9bcc1]/40' : 'text-[#b9bcc1]'
            }`}
          >
            <span
              aria-hidden="true"
              className="relative hidden aspect-[4/3] w-[88px] overflow-hidden rounded-md bg-[#141414] max-[959px]:col-start-1 max-[959px]:row-span-2 max-[959px]:row-start-1 max-[959px]:block"
            >
              <Image
                src={project.image}
                alt=""
                fill
                sizes="88px"
                className="object-cover"
              />
            </span>
            <span
              className={`min-w-0 text-[6.5vw] font-bold leading-none sm:text-[4.5vw] md:text-[3.5vw] transition-transform [transition-duration:600ms] [transition-timing-function:cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none max-[959px]:col-start-2 max-[959px]:row-start-1 max-[959px]:!translate-x-0 ${
                isActive ? 'translate-x-7' : ''
              }`}
            >
              {project.name}
            </span>
            <span className="flex flex-col items-end gap-1.5 text-sm text-[#b9bcc1]/60 max-[959px]:col-start-2 max-[959px]:row-start-2 max-[959px]:flex-row max-[959px]:flex-wrap max-[959px]:items-start max-[959px]:gap-x-2.5 max-[959px]:gap-y-1">
              <span className="text-[#b9bcc1]">{project.kind}</span>
              <span>{project.tags}</span>
            </span>
            <ArrowUpRight
              size={28}
              strokeWidth={1.6}
              className={`transition-colors duration-300 max-[959px]:col-start-3 max-[959px]:row-span-2 max-[959px]:row-start-1 ${
                isActive ? 'text-[#ff0000]' : 'text-[#b9bcc1]/40'
              }`}
            />
          </ProjectLink>
        );
      })}

      <motion.div
        aria-hidden="true"
        style={{ x: previewX, y: previewY, rotate: -4 }}
        initial={false}
        animate={{ opacity: active >= 0 ? 1 : 0, scale: active >= 0 ? 1 : 0.8 }}
        transition={{
          opacity: { duration: 0.3 },
          scale: { duration: 0.5, ease: EASE },
        }}
        className="pointer-events-none absolute left-0 top-0 z-[5] aspect-[4/3] w-[380px] overflow-hidden rounded-[10px] bg-[#141414] shadow-[0_40px_80px_rgba(0,0,0,0.6)] max-[959px]:hidden [@media(hover:none)]:hidden"
      >
        {/* Every preview is mounted up front so switching rows never waits
            on an image request. */}
        {projects.map((project, index) => (
          <Image
            key={project.key}
            src={project.image}
            alt=""
            fill
            sizes="380px"
            className={`object-cover ${
              index === previewIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </motion.div>
    </div>
  );
};

const RecentWork = () => {
  const [view, setView] = useState('grid');
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="work"
      className="-mx-10 overflow-hidden px-[clamp(20px,4.5vw,64px)] pt-[clamp(64px,9vw,96px)] text-[#b9bcc1]"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#232323] pb-5">
        <div className="flex items-center gap-3 text-sm uppercase tracking-[0.08em] text-[#b9bcc1]/60">
          <span className="h-2 w-2 rounded-full bg-[#ff0000]" />
          <span>Projects</span>
        </div>
        <div
          role="group"
          aria-label="Project layout"
          className="flex gap-1 rounded-full border border-[#2A2A2A] p-1 max-[560px]:w-full"
        >
          {VIEWS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={view === id}
              onClick={() => setView(id)}
              className={`min-h-[44px] rounded-full px-5 text-sm font-medium transition-colors duration-300 max-[560px]:flex-1 ${focusRing} ${
                view === id
                  ? 'bg-[#b9bcc1] text-[#0A0A0A]'
                  : 'bg-transparent text-[#b9bcc1]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-[clamp(28px,4vw,40px)] pb-[clamp(56px,8vw,96px)] pt-[clamp(40px,7vw,72px)]">
        <h2 className="text-[12vw] font-bold leading-none sm:text-[8vw]">
          Selected
          <br />
          Work
        </h2>
        <div className="flex max-w-[380px] flex-col gap-7">
          <p className="text-base font-medium text-[#b9bcc1]/80">
            A handful of storefronts, products and tools I’ve designed and
            shipped — built for speed, polish and the small details that make
            people stay.
          </p>
          <div className="flex items-center gap-2.5 text-sm uppercase tracking-[0.08em] text-[#b9bcc1]/60">
            <span>Hover to preview</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>
      </div>

      {view === 'grid' ? <GridView /> : <ListView />}

      <div className="flex flex-wrap items-center justify-between gap-10 pb-[clamp(72px,10vw,120px)] pt-[clamp(96px,13vw,160px)]">
        <p className="max-w-[900px] text-[6.5vw] font-bold leading-none sm:text-[4.5vw] md:text-[3.5vw]">
          Got a project in mind?
          <br />
          <span className="text-[#b9bcc1]/60">Let’s build it properly.</span>
        </p>
        <a
          href="mailto:05sameerk@gmail.com"
          className={`flex h-[180px] w-[180px] flex-col items-center justify-center gap-2 rounded-full bg-[#ff0000] text-lg font-bold text-[#0A0A0A] transition-transform [transition-duration:600ms] [transition-timing-function:cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none max-[560px]:h-[140px] max-[560px]:w-[140px] max-[560px]:text-base [@media(hover:hover)]:hover:-rotate-6 [@media(hover:hover)]:hover:scale-[1.08] ${focusRing}`}
        >
          <ArrowUpRight size={28} />
          <span>Let’s talk</span>
        </a>
      </div>

      <div
        aria-hidden="true"
        className="-mx-[clamp(20px,4.5vw,64px)] overflow-hidden border-t border-[#232323] py-[clamp(24px,3vw,36px)]"
      >
        <motion.div
          className="flex w-max"
          animate={reduceMotion ? undefined : { x: ['0%', '-50%'] }}
          transition={{ duration: 32, ease: 'linear', repeat: Infinity }}
        >
          {[...TICKER, ...TICKER].map((word, index) => (
            <span
              key={index}
              className="flex items-center gap-[clamp(20px,3vw,40px)] whitespace-nowrap pr-[clamp(20px,3vw,40px)] text-[6.5vw] font-bold leading-none sm:text-[4.5vw] md:text-[3.5vw]"
            >
              <span>{word}</span>
              <span className="h-3.5 w-3.5 rounded-full bg-[#ff0000]" />
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default RecentWork;
