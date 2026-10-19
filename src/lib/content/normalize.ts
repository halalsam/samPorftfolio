// One normalizer for every source. Local content and Strapi v5 REST responses
// both pass through here, so components only ever see this shape:
//
// Project {
//   slug, kind: 'case-study' | 'archive', order, title, year, role,
//   platforms: string[], tagline, summary, live: boolean,
//   links: { label, href, kind }[], cover: Media | null,
//   theme: { mode, accent, background, surface },
//   hero: { variant: 'video' | 'image' | 'browser' | 'phone', media, url } | null,
//   seo: { title, description } | null,
//   blocks: { __component, id, ...fields }[]
// }
// Media { url, alt, width, height, mime, poster: Media | null }
// (typed in ./types)

import type { Block, Link, LinkKind, Media, Project, Raw, Theme } from './types';

const isObj = (v: unknown): v is Raw => v !== null && typeof v === 'object' && !Array.isArray(v);

/** Strapi v4 wrapped relations in { data: { attributes } }; v5 is flat. Accept both. */
const unwrap = (v: unknown): unknown => {
  if (isObj(v) && 'data' in v) v = v.data;
  if (isObj(v) && isObj(v.attributes)) return { id: v.id, ...v.attributes };
  return v;
};

const absolute = (url: string, baseUrl?: string | null) => {
  if (!url) return url;
  if (/^https?:\/\//.test(url) || !baseUrl) return url;
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

const guessMime = (url = '') => {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase() ?? '';
  return (
    ({ mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime', png: 'image/png', svg: 'image/svg+xml', webp: 'image/webp', gif: 'image/gif', avif: 'image/avif' } as Record<string, string>)[ext] ?? 'image/jpeg'
  );
};

export function normalizeMedia(raw: unknown, baseUrl?: string | null, poster?: unknown): Media | null {
  const m = unwrap(raw);
  if (!isObj(m) || !m.url) return null;
  return {
    url: absolute(m.url, baseUrl),
    alt: m.alt ?? m.alternativeText ?? m.caption ?? '',
    width: m.width ?? null,
    height: m.height ?? null,
    mime: m.mime ?? guessMime(m.url),
    poster: normalizeMedia(poster ?? m.poster, baseUrl),
  };
}

export const isVideo = (media: Media | null | undefined) => Boolean(media?.mime?.startsWith('video/'));

/** "a, b\nc" → ['a','b','c']; arrays pass through. CMS text fields stay friendly.
 *  `sep` lets sentence lists (notes) split on new lines only. */
const list = (v: unknown, sep: RegExp = /[\n,]/): string[] => {
  if (Array.isArray(v)) return v.map((x) => (isObj(x) ? x.value ?? x.name ?? x.label ?? '' : String(x))).filter(Boolean);
  if (typeof v === 'string') return v.split(sep).map((s) => s.trim()).filter(Boolean);
  return [];
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const num = (v: unknown) => {
  if (typeof v === 'number') return v;
  if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v.replace(/,/g, '')))) return Number(v.replace(/,/g, ''));
  return v;
};

const BLOCK_NORMALIZERS: Record<string, (b: Raw, base?: string | null) => Raw> = {
  'blocks.reel': (b, base) => ({
    ...b,
    landscape: normalizeMedia(b.landscape, base, b.landscapePoster),
    portrait: normalizeMedia(b.portrait, base, b.portraitPoster),
  }),
  'blocks.media': (b, base) => ({ ...b, media: normalizeMedia(b.media, base, b.poster), frame: b.frame ?? 'none', width: b.width ?? 'full' }),
  'blocks.gallery': (b, base) => ({
    ...b,
    columns: Number(b.columns) || 2,
    items: (b.items ?? []).map((it: Raw) => ({ ...it, media: normalizeMedia(it.media, base, it.poster), frame: it.frame ?? 'none' })).filter((it: Raw) => it.media),
  }),
  'blocks.brand': (b, base) => ({
    ...b,
    logo: normalizeMedia(b.logo, base),
    palette: (b.palette ?? []).filter((s: Raw | null) => s?.hex),
    typefaces: b.typefaces ?? [],
  }),
  'blocks.stack': (b) => ({ ...b, groups: (b.groups ?? []).map((g: Raw) => ({ ...g, items: list(g.items) })) }),
  'blocks.stats': (b) => ({ ...b, items: (b.items ?? []).map((s: Raw) => ({ ...s, value: num(s.value), decimals: Number(s.decimals) || 0 })) }),
  'blocks.architecture': (b) => ({
    ...b,
    layers: (b.layers ?? []).map((l: Raw) => ({
      ...l,
      nodes: (l.nodes ?? []).map((n: Raw) => ({
        ...n,
        key: n.key || slug(n.name ?? ''),
        icon: n.icon ?? null,
        tag: n.tag ?? null,
        highlight: Boolean(n.highlight),
        connectsTo: list(n.connectsTo),
      })),
    })),
    notes: list(b.notes, /\n/),
  }),
  'blocks.overview': (b) => ({ ...b, facts: b.facts ?? [] }),
  'blocks.features': (b) => ({ ...b, items: b.items ?? [] }),
  'blocks.timeline': (b) => ({ ...b, items: b.items ?? [] }),
  'blocks.cta': (b) => ({ ...b, links: b.links ?? [] }),
};

export function normalizeBlocks(blocks: unknown, baseUrl?: string | null): Block[] {
  if (!Array.isArray(blocks)) return [];
  return blocks
    .filter((b): b is Raw => isObj(b) && typeof b.__component === 'string')
    .map((b, i) => {
      const fn = BLOCK_NORMALIZERS[b.__component];
      const out = fn ? fn(b, baseUrl) : b;
      // Shape is the block's normalizer's (or the source's, for blocks the
      // site doesn't know yet; BlockRenderer skips those).
      return { ...out, id: `${b.__component}-${b.id ?? i}` } as Block;
    });
}

const DEFAULT_ACCENT = '#E46060';

export function normalizeTheme(t: Raw = {}): Theme {
  const mode = t.mode === 'light' ? 'light' : 'dark';
  return {
    mode,
    accent: t.accent || DEFAULT_ACCENT,
    background: t.background || (mode === 'light' ? '#F5F5F5' : '#000000'),
    surface: t.surface || null,
  };
}

export function normalizeProject(raw: unknown, { baseUrl }: { baseUrl?: string | null } = {}): Project {
  const u = unwrap(raw);
  const p: Raw = isObj(u) ? u : {};
  const links: Link[] = (p.links ?? [])
    .filter((l: Raw | null) => l?.href)
    .map((l: Raw) => ({ label: l.label || l.href, href: l.href, kind: (l.kind || 'web') as LinkKind }));
  const hero = isObj(p.hero)
    ? { variant: p.hero.variant || 'image', media: normalizeMedia(p.hero.media, baseUrl, p.hero.poster), url: p.hero.url ?? null }
    : null;
  return {
    slug: p.slug,
    kind: p.kind === 'archive' ? 'archive' : 'case-study',
    order: Number.isFinite(Number(p.order)) ? Number(p.order) : 99,
    title: p.title ?? p.name ?? p.slug,
    year: p.year ? String(p.year) : '',
    role: p.role ?? '',
    platforms: list(p.platforms),
    tagline: p.tagline ?? '',
    summary: p.summary ?? '',
    live: Boolean(p.live),
    links,
    cover: normalizeMedia(p.cover, baseUrl),
    theme: normalizeTheme(p.theme ?? {}),
    hero,
    seo: isObj(p.seo) ? { title: p.seo.title ?? null, description: p.seo.description ?? null } : null,
    blocks: normalizeBlocks(p.blocks, baseUrl),
  };
}
