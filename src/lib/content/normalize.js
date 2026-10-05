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

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/** Strapi v4 wrapped relations in { data: { attributes } }; v5 is flat. Accept both. */
const unwrap = (v) => {
  if (isObj(v) && 'data' in v) v = v.data;
  if (isObj(v) && isObj(v.attributes)) return { id: v.id, ...v.attributes };
  return v;
};

const absolute = (url, baseUrl) => {
  if (!url) return url;
  if (/^https?:\/\//.test(url) || !baseUrl) return url;
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

const guessMime = (url = '') => {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase();
  return (
    { mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime', png: 'image/png', svg: 'image/svg+xml', webp: 'image/webp', gif: 'image/gif', avif: 'image/avif' }[ext] ?? 'image/jpeg'
  );
};

export function normalizeMedia(raw, baseUrl, poster) {
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

export const isVideo = (media) => Boolean(media?.mime?.startsWith('video/'));

/** "a, b\nc" → ['a','b','c']; arrays pass through. CMS text fields stay friendly.
 *  `sep` lets sentence lists (notes) split on new lines only. */
const list = (v, sep = /[\n,]/) => {
  if (Array.isArray(v)) return v.map((x) => (isObj(x) ? x.value ?? x.name ?? x.label ?? '' : String(x))).filter(Boolean);
  if (typeof v === 'string') return v.split(sep).map((s) => s.trim()).filter(Boolean);
  return [];
};

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const num = (v) => {
  if (typeof v === 'number') return v;
  if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v.replace(/,/g, '')))) return Number(v.replace(/,/g, ''));
  return v;
};

const BLOCK_NORMALIZERS = {
  'blocks.reel': (b, base) => ({
    ...b,
    landscape: normalizeMedia(b.landscape, base, b.landscapePoster),
    portrait: normalizeMedia(b.portrait, base, b.portraitPoster),
  }),
  'blocks.media': (b, base) => ({ ...b, media: normalizeMedia(b.media, base, b.poster), frame: b.frame ?? 'none', width: b.width ?? 'full' }),
  'blocks.gallery': (b, base) => ({
    ...b,
    columns: Number(b.columns) || 2,
    items: (b.items ?? []).map((it) => ({ ...it, media: normalizeMedia(it.media, base, it.poster), frame: it.frame ?? 'none' })).filter((it) => it.media),
  }),
  'blocks.brand': (b, base) => ({
    ...b,
    logo: normalizeMedia(b.logo, base),
    palette: (b.palette ?? []).filter((s) => s?.hex),
    typefaces: b.typefaces ?? [],
  }),
  'blocks.stack': (b) => ({ ...b, groups: (b.groups ?? []).map((g) => ({ ...g, items: list(g.items) })) }),
  'blocks.stats': (b) => ({ ...b, items: (b.items ?? []).map((s) => ({ ...s, value: num(s.value), decimals: Number(s.decimals) || 0 })) }),
  'blocks.architecture': (b) => ({
    ...b,
    layers: (b.layers ?? []).map((l) => ({
      ...l,
      nodes: (l.nodes ?? []).map((n) => ({
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

export function normalizeBlocks(blocks, baseUrl) {
  if (!Array.isArray(blocks)) return [];
  return blocks
    .filter((b) => isObj(b) && typeof b.__component === 'string')
    .map((b, i) => {
      const fn = BLOCK_NORMALIZERS[b.__component];
      const out = fn ? fn(b, baseUrl) : b;
      return { ...out, id: `${b.__component}-${b.id ?? i}` };
    });
}

const DEFAULT_ACCENT = '#E46060';

export function normalizeTheme(t = {}) {
  const mode = t.mode === 'light' ? 'light' : 'dark';
  return {
    mode,
    accent: t.accent || DEFAULT_ACCENT,
    background: t.background || (mode === 'light' ? '#F5F5F5' : '#000000'),
    surface: t.surface || null,
  };
}

export function normalizeProject(raw, { baseUrl } = {}) {
  const p = unwrap(raw);
  const links = (p.links ?? []).filter((l) => l?.href).map((l) => ({ label: l.label || l.href, href: l.href, kind: l.kind || 'web' }));
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
