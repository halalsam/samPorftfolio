import { BLOCKS } from './blocks';

// Strapi v5 source. Enabled when STRAPI_URL is set (see cms/strapi/README.md).
//   STRAPI_URL        e.g. https://cms.example.com   (no trailing slash needed)
//   STRAPI_API_TOKEN  read-only API token (optional for public content)
// Responses are cached and tagged 'projects'; POST /api/revalidate purges them.

export const STRAPI_URL = process.env.STRAPI_URL?.replace(/\/$/, '') || null;
const TOKEN = process.env.STRAPI_API_TOKEN;

/** Flattens a nested populate object into Strapi's bracket query syntax. */
function toQuery(obj, prefix = '') {
  const parts = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}[${k}]` : k;
    if (v !== null && typeof v === 'object') parts.push(...toQuery(v, key));
    else parts.push(`${encodeURIComponent(key).replace(/%5B/g, '[').replace(/%5D/g, ']')}=${encodeURIComponent(v)}`);
  }
  return parts;
}

const populate = {
  cover: true,
  theme: true,
  links: true,
  seo: true,
  hero: { populate: '*' },
  blocks: {
    on: Object.fromEntries(Object.entries(BLOCKS).map(([uid, def]) => [uid, { populate: def.populate }])),
  },
};

export async function fetchProjects() {
  if (!STRAPI_URL) throw new Error('STRAPI_URL is not set');
  const query = [...toQuery({ populate }), 'pagination[pageSize]=100', 'sort=order:asc'].join('&');
  const res = await fetch(`${STRAPI_URL}/api/projects?${query}`, {
    headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
    next: { revalidate: 300, tags: ['projects'] },
  });
  if (!res.ok) throw new Error(`Strapi responded ${res.status} ${res.statusText}`);
  const json = await res.json();
  return Array.isArray(json?.data) ? json.data : [];
}
