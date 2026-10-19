// Local media helpers. They return the same normalized shape the Strapi
// adapter produces from upload-plugin files, so blocks never care where a
// file came from: { url, alt, width, height, mime, poster }.

import type { Media } from '@/lib/content/types';

export const image = (url: string, alt: string, width: number, height: number): Media => ({
  url,
  alt,
  width,
  height,
  mime: url.endsWith('.png') ? 'image/png' : url.endsWith('.svg') ? 'image/svg+xml' : url.endsWith('.webp') ? 'image/webp' : url.endsWith('.gif') ? 'image/gif' : 'image/jpeg',
});

export const video = (
  url: string,
  { alt, width, height, poster }: { alt: string; width: number; height: number; poster?: Media | null },
): Media => ({
  url,
  alt,
  width,
  height,
  mime: 'video/mp4',
  poster: poster ?? null,
});
