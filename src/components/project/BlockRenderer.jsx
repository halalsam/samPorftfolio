import Overview from './blocks/Overview';
import Reel from './blocks/Reel';
import MediaBlock from './blocks/MediaBlock';
import Gallery from './blocks/Gallery';
import Features from './blocks/Features';
import Stats from './blocks/Stats';
import Stack from './blocks/Stack';
import Architecture from './blocks/Architecture';
import Timeline from './blocks/Timeline';
import Brand from './blocks/Brand';
import Quote from './blocks/Quote';
import RichTextBlock from './blocks/RichTextBlock';
import Cta from './blocks/Cta';

// __component (Strapi dynamic-zone UID) → React component.
// Adding a block = one entry here + one in lib/content/blocks.js + its
// Strapi component schema in cms/strapi.
export const REGISTRY = {
  'blocks.overview': Overview,
  'blocks.reel': Reel,
  'blocks.media': MediaBlock,
  'blocks.gallery': Gallery,
  'blocks.features': Features,
  'blocks.stats': Stats,
  'blocks.stack': Stack,
  'blocks.architecture': Architecture,
  'blocks.timeline': Timeline,
  'blocks.brand': Brand,
  'blocks.quote': Quote,
  'blocks.rich-text': RichTextBlock,
  'blocks.cta': Cta,
};

// Header treatment each block would like, best first (see primitives/Section).
// chaptersOf() takes the first one that differs from the previous section's,
// so neighbours never open the same way. Unlisted blocks (Architecture) get
// the full-width pair.
const HEADERS = {
  'blocks.overview': ['none'],
  'blocks.reel': ['runin', 'poster'],
  'blocks.media': ['runin', 'poster'],
  'blocks.gallery': ['runin', 'poster'],
  'blocks.features': ['margin', 'runin'],
  'blocks.stats': ['poster', 'runin'],
  'blocks.stack': ['runin', 'margin'],
  'blocks.timeline': ['poster', 'runin'],
  'blocks.brand': ['runin', 'poster'],
  'blocks.quote': ['none'],
  'blocks.rich-text': ['margin', 'runin'],
  'blocks.cta': ['none'],
};
const FULL_WIDTH = ['poster', 'runin'];

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/**
 * Section meta is derived, never authored. Every block gets a `header`
 * treatment; blocks with a `navLabel` also get an anchor, a running number
 * and a slot in the chapter rail.
 */
export function chaptersOf(blocks) {
  let n = 0;
  let prev = null;
  return blocks.map((b) => {
    const prefs = HEADERS[b.__component] ?? FULL_WIDTH;
    const header = prefs.find((h) => h !== prev) ?? prefs[0];
    prev = header;
    if (!b.navLabel) return { header };
    return { header, anchor: slugify(b.navLabel), label: b.navLabel, number: String(++n).padStart(2, '0') };
  });
}

export default function BlockRenderer({ blocks, chapters }) {
  return blocks.map((block, i) => {
    const Component = REGISTRY[block.__component];
    if (!Component) {
      // A CMS can ship a component before the site knows it — skip it in
      // production, flag it in development.
      if (process.env.NODE_ENV !== 'production') {
        return (
          <div key={block.id} className="mt-16 rounded-2xl border border-dashed border-pd-line p-6 font-mono text-sm text-pd-muted">
            Unknown block “{block.__component}” — add it to components/project/BlockRenderer.jsx
          </div>
        );
      }
      return null;
    }
    return <Component key={block.id} block={block} meta={chapters[i]} />;
  });
}
