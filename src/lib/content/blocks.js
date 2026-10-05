// Block registry — the list of page-builder components a project can use.
// Shared by the Strapi adapter (what to populate), the normalizer and the
// React renderer. Names follow Strapi's `category.component` UID convention so
// the local content and a Strapi dynamic zone are the same JSON.
//
// `populate` is the Strapi v5 populate fragment for that component inside the
// `blocks` dynamic zone ('*' = one level; an object = nested components).

export const BLOCKS = {
  'blocks.overview': { label: 'Overview', populate: '*' },
  'blocks.reel': { label: 'Reel', populate: '*' },
  'blocks.media': { label: 'Media', populate: '*' },
  'blocks.gallery': { label: 'Gallery', populate: { items: { populate: '*' } } },
  'blocks.features': { label: 'Features', populate: '*' },
  'blocks.stats': { label: 'Stats', populate: '*' },
  'blocks.stack': { label: 'Stack', populate: '*' },
  'blocks.architecture': { label: 'Architecture', populate: { layers: { populate: '*' } } },
  'blocks.timeline': { label: 'Timeline', populate: '*' },
  'blocks.brand': { label: 'Brand', populate: '*' },
  'blocks.quote': { label: 'Quote', populate: '*' },
  'blocks.rich-text': { label: 'Rich text', populate: '*' },
  'blocks.cta': { label: 'Call to action', populate: '*' },
};

export const BLOCK_UIDS = Object.keys(BLOCKS);
