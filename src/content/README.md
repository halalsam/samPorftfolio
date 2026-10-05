# Project content

Every project on the site comes from **one place**. Today that's the files in `projects/`; once Strapi is set up, it's the Strapi `project` collection.

Pages and components never import these files directly. They read through `src/lib/content`:

| Function | Used by |
|---|---|
| `getWorkCards()` | the home "Recent Work" slider (all projects) |
| `getCaseStudies()` / `getProject(slug)` | `/projects/[slug]` pages and their static params |
| `getAdjacentProjects(slug)` | the "03 / 05" counter and the "Next project" footer |

Both sources go through `lib/content/normalize.js`, so a block can't tell whether its data came from a file or from Strapi.

## Adding a case study

1. Put media in `public/projects/<slug>/`.
2. Create `projects/<slug>.js`. Copy `garageflow.js` as a starting point.
3. Add it to `projects/index.js`. On-site order comes from `order`, not from the list order.

```js
{
  slug, kind: 'case-study' | 'archive', order,
  title, year, role, platforms: [],
  tagline, summary, live, links: [{ label, href, kind: 'live'|'web'|'repo'|'store' }],
  cover,                          // card + social image
  theme: { mode: 'dark'|'light', accent, background, surface },
  hero:  { variant: 'video'|'image'|'browser'|'phone', media, url },
  seo:   { title, description },
  blocks: [ { __component: 'blocks.overview', navLabel: 'Overview', ... }, ... ],
}
```

Use `image(url, alt, w, h)` and `video(url, { alt, width, height, poster })` from `media.js` for media. Always give real dimensions, because they set aspect ratios and prevent layout shift.

### Every page is its own design

- **Theme:** `theme` turns into CSS variables (`--pd-*`), and text contrast against the accent is computed automatically.
- **Composition:** the order and mix of blocks is entirely up to each project.
- **Chapters:** any block with a `navLabel` gets an anchor, a running number ("02") and an entry in the chapter rail.
- **Archive entries:** `kind: 'archive'` entries have no blocks. They only appear in the slider and link out.

## Blocks

| `__component` | Fields |
|---|---|
| `blocks.overview` | `heading`, `body` (rich text), `facts[{label,value}]` |
| `blocks.reel` | `heading`, `caption`, `landscape` (16:9 video), `portrait` (9:16 video) |
| `blocks.media` | `heading`, `media`, `frame` (`none`/`browser`/`phone`), `url`, `caption`, `width` (`full`/`wide`/`narrow`), `sound` |
| `blocks.gallery` | `heading`, `columns` (1–4), `items[{media, frame, caption, url}]` |
| `blocks.features` | `heading`, `intro`, `items[{tag, title, body}]` |
| `blocks.stats` | `heading`, `note`, `items[{value, label, detail, prefix, suffix, decimals}]`. Numeric values count up; text values render as-is. |
| `blocks.stack` | `heading`, `groups[{label, items[]}]` |
| `blocks.architecture` | `heading`, `intro`, `layers[{label, nodes[{name, detail, highlight}]}]`, `notes[]` |
| `blocks.timeline` | `heading`, `items[{date, title, body}]` |
| `blocks.brand` | `heading`, `body`, `logo`, `logoBackground`, `palette[{name, hex}]`, `typefaces[{name, role}]` |
| `blocks.quote` | `quote`, `attribution`, `role` |
| `blocks.rich-text` | `heading`, `body` |
| `blocks.cta` | `heading`, `body`, `links[]` |

Any block can also take a `navLabel`.

**Rich text** fields accept either a string or Strapi's Blocks JSON. In a string, paragraphs are separated by blank lines, and `**bold**`, `` `code` `` and `[label](url)` work inline.

**Adding a new block type** takes four steps:

1. Add a component in `components/project/blocks/`.
2. Register it in `BlockRenderer.jsx`.
3. Add an entry in `lib/content/blocks.js`.
4. Add a schema in `cms/strapi/src/components/blocks/`.

Unknown block types are skipped in production and flagged in development.
