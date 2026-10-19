import { OG_SIZE, renderOg } from '@/lib/og';
import { getCaseStudies, getProject } from '@/lib/content';
import { SITE } from '@/lib/site';

export const alt = `Case study by ${SITE.name}`;
export const size = OG_SIZE;
export const contentType = 'image/png';

// Rendered at build time alongside the case-study pages.
export async function generateStaticParams() {
  return (await getCaseStudies()).map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return renderOg({ title: SITE.title });
  return renderOg({
    eyebrow: ['Case study', project.year].filter(Boolean).join(' · '),
    title: project.title,
    subtitle: project.tagline,
    footnote: project.role,
    accent: project.theme?.accent,
    display: true,
  });
}
