import { EMAIL, SOCIALS } from '@/lib/contact';

// One place for who the site is about and where it lives. Metadata, the
// sitemap, robots, the manifest, OG images and JSON-LD all read from here.

// Absolute base for canonical URLs, the sitemap and OG images. Set
// NEXT_PUBLIC_SITE_URL in production; on Vercel the production domain is
// picked up automatically.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000')
).replace(/\/$/, '');

// Only the production deployment may be indexed; previews and local builds
// tell crawlers to stay out so they never compete with the real site.
export const INDEXABLE = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === 'production' : process.env.NODE_ENV === 'production';

export const SITE = {
  name: 'Sameer Khan',
  shortName: 'sam',
  alternateNames: ['Sam', 'Sammk21'],
  jobTitle: 'Full-Stack Developer & Designer',
  title: 'Sameer Khan (Sam) — Full-Stack Developer & Designer',
  description:
    'Sam (Sameer Khan) — full-stack developer & designer building web apps, mobile apps and backends with Next.js, NestJS and React Native. Open to freelance.',
  locale: 'en_US',
  background: '#100f0f',
  signal: '#ff2b1f',
  keywords: [
    'Sameer Khan',
    'Sam',
    'full-stack developer',
    'freelance developer',
    'web developer',
    'frontend developer',
    'Next.js developer',
    'React developer',
    'React Native developer',
    'NestJS developer',
    'Node.js developer',
    'UI designer',
    'motion design',
    'portfolio',
  ],
  knowsAbout: [
    'Next.js',
    'React',
    'React Native',
    'Expo',
    'NestJS',
    'Node.js',
    'TypeScript',
    'PostgreSQL',
    'Redis',
    'Strapi',
    'Medusa',
    'DevOps',
    'Linux',
    'UI design',
    'Motion design',
  ],
};

export const absoluteUrl = (path = '/') => (/^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`);

/**
 * Full metadata for a page. Next shallow-merges `openGraph` and `twitter`
 * per segment, so every page builds complete objects here instead of
 * relying on the root layout's (which would be replaced, not merged).
 * Canonical and og:url are always the page's own path.
 */
export function pageMetadata({ title, description = SITE.description, path = '/', type = 'website', absoluteTitle = false }) {
  const ogTitle = absoluteTitle || !title ? title ?? SITE.title : `${title} — ${SITE.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { type, url: path, siteName: SITE.name, locale: SITE.locale, title: ogTitle, description },
    twitter: { card: 'summary_large_image', title: ogTitle, description },
  };
}

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export const personJsonLd = () => ({
  '@type': 'Person',
  '@id': PERSON_ID,
  name: SITE.name,
  alternateName: SITE.alternateNames,
  url: SITE_URL,
  email: EMAIL.href,
  jobTitle: SITE.jobTitle,
  description: SITE.description,
  image: absoluteUrl('/sam2.png'),
  knowsAbout: SITE.knowsAbout,
  sameAs: SOCIALS.map((s) => s.href),
});

export const websiteJsonLd = () => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE_URL,
  name: SITE.name,
  alternateName: SITE.alternateNames,
  description: SITE.description,
  inLanguage: 'en',
  publisher: { '@id': PERSON_ID },
});

export const profilePageJsonLd = (projects = []) => ({
  '@type': 'ProfilePage',
  '@id': `${SITE_URL}/#profile`,
  url: SITE_URL,
  name: SITE.title,
  isPartOf: { '@id': WEBSITE_ID },
  mainEntity: { '@id': PERSON_ID },
  hasPart: projects.map((p) => ({ '@id': `${absoluteUrl(`/projects/${p.slug}`)}#work` })),
});

export const projectJsonLd = (project) => {
  const url = absoluteUrl(`/projects/${project.slug}`);
  const image = project.cover && !project.cover.mime?.startsWith('video/') ? absoluteUrl(project.cover.url) : undefined;
  return [
    {
      '@type': 'CreativeWork',
      '@id': `${url}#work`,
      url,
      name: project.title,
      headline: project.seo?.title ?? `${project.title} — ${project.tagline}`,
      description: project.seo?.description ?? project.summary,
      abstract: project.tagline,
      image,
      dateCreated: project.year || undefined,
      keywords: project.platforms?.join(', ') || undefined,
      creator: { '@id': PERSON_ID },
      author: { '@id': PERSON_ID },
      isPartOf: { '@id': WEBSITE_ID },
      inLanguage: 'en',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Work', item: absoluteUrl('/#work') },
        { '@type': 'ListItem', position: 3, name: project.title, item: url },
      ],
    },
  ];
};
