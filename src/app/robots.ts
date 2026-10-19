import { INDEXABLE, SITE_URL } from '@/lib/site';

// /robots.txt — production is open to crawlers apart from the API, the
// private onboarding flow and the review form (a thank-you form for clients,
// not a page worth ranking). Previews and local builds block everything.
export default function robots() {
  if (!INDEXABLE) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/onboarding', '/reviews'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
