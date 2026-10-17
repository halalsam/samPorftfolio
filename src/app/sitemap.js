import { getCaseStudies } from '@/lib/content';
import { absoluteUrl } from '@/lib/site';

// /sitemap.xml — every indexable page. Archive projects link out to other
// sites, so only case studies (which live here) are listed. /reviews and
// /onboarding are left out on purpose; see robots.js.
export default async function sitemap() {
  const projects = await getCaseStudies();
  const now = new Date();
  const imageOf = (media) => (media && !media.mime?.startsWith('video/') ? [absoluteUrl(media.url)] : undefined);

  return [
    { url: absoluteUrl('/'), lastModified: now, changeFrequency: 'monthly', priority: 1, images: [absoluteUrl('/sam2.png')] },
    ...projects.map((p) => ({
      url: absoluteUrl(`/projects/${p.slug}`),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
      images: imageOf(p.cover),
    })),
    { url: absoluteUrl('/contact'), lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
  ];
}
