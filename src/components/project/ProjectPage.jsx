'use client';

import Link from 'next/link';
import { PiArrowLeftThin } from 'react-icons/pi';
import { themeVars } from './theme';
import Hero from './Hero';
import BlockRenderer, { chaptersOf } from './BlockRenderer';
import ChapterRail from './ChapterRail';
import NextProject from './NextProject';

/**
 * A case-study page, fully driven by one normalized project entry: its theme
 * becomes CSS variables, its blocks become sections, and the chrome (counter,
 * chapters, next project) is derived from the content.
 */
export default function ProjectPage({ project, adjacent }) {
  const chapterMeta = chaptersOf(project.blocks);
  const chapters = chapterMeta.filter((m) => m.anchor);

  return (
    <div
      style={themeVars(project.theme)}
      className="relative z-20 flex w-full flex-col overflow-x-clip rounded-[50px] bg-pd-bg px-5 pb-16 pt-10 text-pd-fg sm:px-10 sm:pt-14 lg:px-14"
    >
      <div className="flex items-center justify-between gap-4 text-sm">
        <Link
          href="/#work"
          className="group inline-flex items-center gap-2 text-pd-muted outline-none transition-colors hover:text-pd-fg focus-visible:text-pd-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pd-accent"
        >
          <PiArrowLeftThin className="text-lg transition-transform duration-300 group-hover:-translate-x-1 motion-reduce:transition-none" />
          All work
        </Link>
        {adjacent ? (
          <span className="tabular-nums text-pd-faint">
            Project {adjacent.index} of {adjacent.total}
          </span>
        ) : null}
      </div>

      <div className="mt-14">
        <Hero project={project} />
      </div>

      <BlockRenderer blocks={project.blocks} chapters={chapterMeta} />

      <NextProject next={adjacent?.next} />
      <ChapterRail chapters={chapters} />
    </div>
  );
}
