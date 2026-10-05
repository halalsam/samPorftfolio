// Local media helpers. They return the same normalized shape the Strapi
// adapter produces from upload-plugin files, so blocks never care where a
// file came from: { url, alt, width, height, mime, poster }.

export const image = (url, alt, width, height) => ({
  url,
  alt,
  width,
  height,
  mime: url.endsWith('.png') ? 'image/png' : url.endsWith('.svg') ? 'image/svg+xml' : url.endsWith('.webp') ? 'image/webp' : url.endsWith('.gif') ? 'image/gif' : 'image/jpeg',
});

export const video = (url, { alt, width, height, poster }) => ({
  url,
  alt,
  width,
  height,
  mime: 'video/mp4',
  poster: poster ?? null,
});
