// The normalized content shape (see normalize.ts). Components only ever see
// these types, whichever source the data came from.

/** Unvalidated source JSON: a local content file or a Strapi REST response. */
export type Raw = Record<string, any>;

export interface Media {
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
  mime: string;
  poster?: Media | null;
}

/** Strapi v5 "Blocks" rich-text JSON, loosely: one node type for blocks,
 *  inline links and text leaves alike. */
export interface RichTextNode {
  type?: string;
  text?: string;
  url?: string;
  level?: number;
  format?: 'ordered' | 'unordered';
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  image?: { url?: string; alternativeText?: string | null };
  children?: RichTextNode[];
}

/** A plain string (blank-line paragraphs, light inline markup) or Blocks JSON. */
export type RichTextValue = string | RichTextNode[];

export type LinkKind = 'live' | 'web' | 'repo' | 'store';

export interface Link {
  label: string;
  href: string;
  kind: LinkKind;
}

export interface Theme {
  mode: 'light' | 'dark';
  accent: string;
  background: string;
  surface: string | null;
}

export type Frame = 'none' | 'browser' | 'phone';

export interface Hero {
  variant: 'video' | 'image' | 'browser' | 'phone';
  media: Media | null;
  url: string | null;
}

interface BlockBase {
  id: string;
  navLabel?: string;
}

export interface OverviewBlock extends BlockBase {
  __component: 'blocks.overview';
  heading?: string;
  body?: RichTextValue;
  facts: { label: string; value: string }[];
}

export interface ReelBlock extends BlockBase {
  __component: 'blocks.reel';
  heading?: string;
  caption?: string;
  landscape: Media | null;
  portrait: Media | null;
}

export interface MediaBlockData extends BlockBase {
  __component: 'blocks.media';
  heading?: string;
  media: Media | null;
  frame: Frame;
  url?: string;
  caption?: string;
  width: 'full' | 'wide' | 'narrow';
  sound?: boolean;
}

export interface GalleryItem {
  media: Media;
  frame: Frame;
  caption?: string;
  url?: string;
}

export interface GalleryBlock extends BlockBase {
  __component: 'blocks.gallery';
  heading?: string;
  columns: number;
  items: GalleryItem[];
}

export interface FeaturesBlock extends BlockBase {
  __component: 'blocks.features';
  heading?: string;
  intro?: string;
  items: { tag?: string; title: string; body?: RichTextValue }[];
}

export interface StatItem {
  value: number | string;
  label: string;
  detail?: string;
  prefix?: string;
  suffix?: string;
  decimals: number;
}

export interface StatsBlock extends BlockBase {
  __component: 'blocks.stats';
  heading?: string;
  note?: string;
  items: StatItem[];
}

export interface StackBlock extends BlockBase {
  __component: 'blocks.stack';
  heading?: string;
  groups: { label: string; items: string[] }[];
}

export interface ArchNode {
  key: string;
  name: string;
  detail?: string;
  icon: string | null;
  tag: string | null;
  highlight: boolean;
  connectsTo: string[];
}

export interface ArchLayer {
  label: string;
  nodes: ArchNode[];
}

export interface ArchitectureBlock extends BlockBase {
  __component: 'blocks.architecture';
  heading?: string;
  intro?: RichTextValue;
  layers: ArchLayer[];
  notes: string[];
}

export interface TimelineItem {
  date: string;
  title: string;
  body?: RichTextValue;
}

export interface TimelineBlock extends BlockBase {
  __component: 'blocks.timeline';
  heading?: string;
  items: TimelineItem[];
}

export interface Swatch {
  name: string;
  hex: string;
}

export interface BrandBlock extends BlockBase {
  __component: 'blocks.brand';
  heading?: string;
  body?: RichTextValue;
  logo: Media | null;
  logoBackground?: string;
  palette: Swatch[];
  typefaces: { name: string; role?: string }[];
}

export interface QuoteBlock extends BlockBase {
  __component: 'blocks.quote';
  quote: string;
  attribution?: string;
  role?: string;
}

export interface RichTextBlockData extends BlockBase {
  __component: 'blocks.rich-text';
  heading?: string;
  body?: RichTextValue;
}

export interface CtaBlock extends BlockBase {
  __component: 'blocks.cta';
  heading?: string;
  body?: RichTextValue;
  links: Link[];
}

export type Block =
  | OverviewBlock
  | ReelBlock
  | MediaBlockData
  | GalleryBlock
  | FeaturesBlock
  | StatsBlock
  | StackBlock
  | ArchitectureBlock
  | TimelineBlock
  | BrandBlock
  | QuoteBlock
  | RichTextBlockData
  | CtaBlock;

export type BlockUid = Block['__component'];

export interface Project {
  slug: string;
  kind: 'case-study' | 'archive';
  order: number;
  title: string;
  year: string;
  role: string;
  platforms: string[];
  tagline: string;
  summary: string;
  live: boolean;
  links: Link[];
  cover: Media | null;
  theme: Theme;
  hero: Hero | null;
  seo: { title: string | null; description: string | null } | null;
  blocks: Block[];
}

/** Header treatment a section opens with (see primitives/Section). */
export type SectionHeader = 'none' | 'runin' | 'poster' | 'margin';

/** Derived per block by chaptersOf() in BlockRenderer. */
export interface ChapterMeta {
  header: SectionHeader;
  anchor?: string;
  label?: string;
  number?: string;
}

export interface BlockProps<B extends Block> {
  block: B;
  meta: ChapterMeta;
}
