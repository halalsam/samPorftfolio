import { notFound } from 'next/navigation';
import Page from '@/components/Page';
import CustomCursor from '@/components/custom-crusor/Cursor';
import AppContext from '@/context/globalContext';
import ProjectPage from '@/components/project/ProjectPage';
import { getAdjacentProjects, getCaseStudies, getProject } from '@/lib/content';

// Case studies are pre-rendered; with Strapi they refresh via ISR + the
// /api/revalidate webhook, and new slugs render on first request.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getCaseStudies()).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: 'Sameer | Project' };
  const title = project.seo?.title ?? `${project.title} — ${project.tagline}`;
  const description = project.seo?.description ?? project.summary;
  const image = project.cover?.url;
  return {
    title: `Sameer | ${project.title}`,
    description,
    icons: { icon: '/favicon.ico' },
    openGraph: { title, description, type: 'article', images: image ? [{ url: image, width: project.cover.width ?? undefined, height: project.cover.height ?? undefined, alt: project.cover.alt }] : undefined },
    twitter: { card: 'summary_large_image', title, description, images: image ? [image] : undefined },
  };
}

export default async function ProjectRoute({ params }) {
  const { slug } = await params;
  const [project, adjacent] = await Promise.all([getProject(slug), getAdjacentProjects(slug)]);
  if (!project) notFound();

  return (
    <AppContext>
      <div className="flex min-h-screen flex-col">
        <CustomCursor />
        <Page showPreloader={false}>
          <ProjectPage project={project} adjacent={adjacent} />
        </Page>
      </div>
    </AppContext>
  );
}
