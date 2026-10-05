import { cache } from 'react';
import * as local from './local';
import * as strapi from './strapi';
import { normalizeProject } from './normalize';

// The only API the app uses for project content. Pages and components never
// import src/content directly — swap the source here and nothing else moves.
//
// Source: Strapi when STRAPI_URL is set, otherwise the local files. If Strapi
// is unreachable the site falls back to local content instead of failing.

async function load() {
  if (strapi.STRAPI_URL) {
    try {
      const raw = await strapi.fetchProjects();
      return raw.map((p) => normalizeProject(p, { baseUrl: strapi.STRAPI_URL }));
    } catch (err) {
      console.warn(`[content] Strapi unavailable, using local content — ${err.message}`);
    }
  }
  const raw = await local.fetchProjects();
  return raw.map((p) => normalizeProject(p));
}

export const getProjects = cache(async () => {
  const all = await load();
  return all.filter((p) => p.slug).sort((a, b) => a.order - b.order);
});

export async function getCaseStudies() {
  return (await getProjects()).filter((p) => p.kind === 'case-study');
}

export async function getProject(slug) {
  return (await getCaseStudies()).find((p) => p.slug === slug) ?? null;
}

/** Position of a case study plus its neighbours (wrapping), for page chrome. */
export async function getAdjacentProjects(slug) {
  const list = await getCaseStudies();
  const i = list.findIndex((p) => p.slug === slug);
  if (i === -1) return null;
  const pick = (p) => ({ slug: p.slug, title: p.title, tagline: p.tagline, cover: p.cover, accent: p.theme.accent });
  return {
    index: i + 1,
    total: list.length,
    prev: pick(list[(i - 1 + list.length) % list.length]),
    next: pick(list[(i + 1) % list.length]),
  };
}

/** Lightweight cards for the home "Recent Work" slider. */
export async function getWorkCards() {
  const primary = (p) => p.links.find((l) => l.kind === 'live') ?? p.links[0] ?? null;
  return (await getProjects()).map((p) => {
    const link = primary(p);
    const internal = p.kind === 'case-study';
    return {
      key: p.slug,
      name: p.title,
      image: p.cover?.url ?? null,
      accent: p.theme.accent,
      role: p.role,
      year: p.year,
      href: internal ? `/projects/${p.slug}` : link?.href ?? '#',
      internal,
      live: p.live && Boolean(link),
      liveHref: p.live ? link?.href ?? null : null,
    };
  });
}
