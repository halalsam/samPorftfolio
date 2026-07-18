import { notFound } from 'next/navigation';
import Page from '@/components/Page';
import CustomCursor from '@/components/custom-crusor/Cursor';
import AppContext from '@/context/globalContext';
import ProjectDetail from '@/components/Project-Detail';
import { featuredProjects, getProject } from '@/lib/projects';

export function generateStaticParams() {
  return featuredProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: 'Sameer | Project' };
  return {
    title: `Sameer | ${project.name}`,
    description: project.summary,
    icons: { icon: '/favicon.ico' },
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <AppContext>
      <div className="flex min-h-screen flex-col">
        <CustomCursor />
        <Page showPreloader={false}>
          <ProjectDetail project={project} />
        </Page>
      </div>
    </AppContext>
  );
}
