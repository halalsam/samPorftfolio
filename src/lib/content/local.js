import projects from '@/content/projects';

// Local source: the files in src/content/projects. Same shape as Strapi.
export async function fetchProjects() {
  return projects;
}
