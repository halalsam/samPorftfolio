'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PiArrowUpRightThin, PiArrowLeftThin } from 'react-icons/pi';
import { Github } from 'lucide-react';
import BlurFade from '../ui/blur-fade';
import { Badge } from '../ui/badge';
import MagneticButton from '../Common/magnetic-button';

const fadeUp = {
  hidden: { y: 24, opacity: 0 },
  visible: (i = 0) => ({
    y: 0,
    opacity: 1,
    transition: { delay: 0.15 + i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
};

const ProjectDetail = ({ project }) => {
  const title = project.name;

  return (
    <div className="relative z-20 flex h-full w-full flex-col overflow-x-clip rounded-b-[50px] rounded-t-[50px] bg-[#000] px-6 py-16 sm:px-10">
      {/* Back link */}
      <BlurFade inView>
        <MagneticButton>
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-x-2 rounded-full border border-white/15 px-5 py-3 text-sm text-white/70 transition-colors hover:text-white"
          >
            <PiArrowLeftThin className="text-lg" />
            Back to work
          </Link>
        </MagneticButton>
      </BlurFade>

      {/* Header */}
      <header className="mt-14 flex flex-col gap-y-6">
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/40">
          <span>{project.year}</span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span>{project.role}</span>
          {project.live ? (
            <>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span className="flex items-center gap-x-2 normal-case tracking-normal">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
                </span>
                Live
              </span>
            </>
          ) : null}
        </div>

        <div className="flex">
          {title.split('').map((char, index) => (
            <span
              key={index}
              className="relative inline-flex overflow-hidden text-[16vw] font-bold leading-[0.95] text-white sm:text-[9vw]"
            >
              <motion.span
                className="inline-block"
                variants={fadeUp}
                custom={index}
                initial="hidden"
                animate="visible"
              >
                {char === ' ' ? ' ' : char}
              </motion.span>
            </span>
          ))}
        </div>

        <motion.p
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="visible"
          className="max-w-[24ch] text-xl font-medium text-white/80 sm:text-3xl"
        >
          {project.tagline}
        </motion.p>

        <motion.div
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="visible"
          className="mt-2 flex flex-wrap items-center gap-3"
        >
          <MagneticButton>
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-x-2 rounded-full px-6 py-4 text-base font-semibold text-black transition-transform"
              style={{ backgroundColor: project.accent }}
            >
              Visit live site
              <PiArrowUpRightThin className="text-xl transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </MagneticButton>
          {project.repo ? (
            <MagneticButton>
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-x-2 rounded-full border border-white/15 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-white/5"
              >
                <Github size={20} />
                Source
              </a>
            </MagneticButton>
          ) : null}
        </motion.div>
      </header>

      {/* Hero image */}
      <BlurFade delay={0.2} inView className="mt-16">
        <div
          className="relative aspect-[16/10] w-full overflow-hidden rounded-[28px] border border-white/10"
          style={{ backgroundColor: project.background }}
        >
          <Image
            src={project.image}
            alt={`${project.name} screenshot`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
        </div>
      </BlurFade>

      {/* Overview + meta */}
      <section className="mt-20 flex flex-col gap-y-12 lg:grid lg:grid-cols-12 lg:gap-x-16">
        <div className="lg:col-span-7">
          <BlurFade inView>
            <h2 className="text-sm uppercase tracking-[0.2em] text-white/40">
              Overview
            </h2>
            <p className="mt-6 text-2xl font-medium leading-[1.4] text-white/85 sm:text-3xl">
              {project.summary}
            </p>
          </BlurFade>
        </div>

        <div className="flex flex-col gap-y-10 lg:col-span-5">
          <BlurFade inView>
            <h3 className="text-sm uppercase tracking-[0.2em] text-white/40">
              Stack
            </h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <Badge
                  key={tech}
                  variant="outline"
                  className="border-white/15 px-4 py-2 text-sm text-white/70"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </BlurFade>

          <BlurFade inView>
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
              {project.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-y-1">
                  <span
                    className="text-2xl font-bold sm:text-3xl"
                    style={{ color: project.accent }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-xs text-white/50">{stat.label}</span>
                </div>
              ))}
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Highlights */}
      <section className="mt-24">
        <BlurFade inView>
          <h2 className="text-[10vw] font-bold leading-none text-white sm:text-[5vw]">
            Highlights.
          </h2>
        </BlurFade>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {project.highlights.map((highlight, index) => (
            <BlurFade key={highlight.title} delay={index * 0.08} inView>
              <div className="flex h-full flex-col gap-y-4 rounded-3xl border border-white/10 bg-white/[0.02] p-8 transition-colors hover:border-white/20">
                <span
                  className="text-sm font-semibold"
                  style={{ color: project.accent }}
                >
                  0{index + 1}
                </span>
                <h3 className="text-2xl font-bold text-white">
                  {highlight.title}
                </h3>
                <p className="text-base leading-[1.5] text-white/60">
                  {highlight.body}
                </p>
              </div>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mt-28 flex flex-col items-start gap-y-6 border-t border-white/10 pt-16">
        <BlurFade inView>
          <p className="text-4xl font-bold leading-tight text-white sm:text-6xl">
            Want to see it in motion?
          </p>
        </BlurFade>
        <BlurFade delay={0.1} inView>
          <MagneticButton>
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-x-3 rounded-full px-8 py-5 text-lg font-semibold text-black"
              style={{ backgroundColor: project.accent }}
            >
              Open {project.url}
              <PiArrowUpRightThin className="text-2xl transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </MagneticButton>
        </BlurFade>
      </section>
    </div>
  );
};

export default ProjectDetail;
