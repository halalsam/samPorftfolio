import { notFound } from 'next/navigation';
import Page from '@/components/Page';
import CustomCursor from '@/components/custom-crusor/Cursor';
import AppContext from '@/context/globalContext';
import ProjectPage from '@/components/project/ProjectPage';
import JsonLd from '@/components/JsonLd';
import { getAdjacentProjects, getCaseStudies, getProject } from '@/lib/content';
import { pageMetadata, projectJsonLd } from '@/lib/site';

type Params = { params: Promise<{ slug: string }> };

// Case studies are pre-rendered; with Strapi they refresh via ISR + the
// /api/revalidate webhook, and new slugs render on first request.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getCaseStudies()).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: 'Project not found', robots: { index: false } };
  // The OG/Twitter image comes from ./opengraph-image.ts.
  return pageMetadata({
    title: project.seo?.title ?? `${project.title} — ${project.tagline}`,
    description: project.seo?.description ?? project.summary,
    path: `/projects/${project.slug}`,
    type: 'article',
  });
}

export default async function ProjectRoute({ params }: Params) {
  const { slug } = await params;
  const [project, adjacent] = await Promise.all([getProject(slug), getAdjacentProjects(slug)]);
  if (!project) notFound();

  return (
    <AppContext>
      <JsonLd data={projectJsonLd(project)} />
      <div className="flex min-h-screen flex-col">
        <CustomCursor />
        <Page showPreloader={false}>
          <ProjectPage project={project} adjacent={adjacent} />
        </Page>
      </div>
    </AppContext>
  );
}
