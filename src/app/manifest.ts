import { SITE } from '@/lib/site';

// /manifest.webmanifest — install name and icons, all cut from the header mark.
export default function manifest() {
  return {
    name: `${SITE.name} — Portfolio`,
    short_name: SITE.shortName,
    description: SITE.description,
    start_url: '/',
    display: 'standalone',
    background_color: SITE.background,
    theme_color: SITE.background,
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/brand/icon-192.png', type: 'image/png', sizes: '192x192' },
      { src: '/brand/icon-512.png', type: 'image/png', sizes: '512x512' },
      { src: '/brand/icon-maskable-512.png', type: 'image/png', sizes: '512x512', purpose: 'maskable' },
    ],
  };
}
