// Lenis base styles, shipped by Locomotive for the Lenis version it bundles.
import 'locomotive-scroll/locomotive-scroll.css';
import '@/styles/globals.css';
import Providers from './providers';
import JsonLd from '@/components/JsonLd';
import { INDEXABLE, SITE, SITE_URL, personJsonLd, websiteJsonLd } from '@/lib/site';

// Icons (favicon.ico, icon.svg, apple-icon.png), the OG image, sitemap,
// robots and manifest are file conventions in this folder. Pages build their
// own canonical/OG/Twitter fields with pageMetadata() from @/lib/site.
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE.title, template: `%s — ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE_URL }],
  creator: SITE.name,
  publisher: SITE.name,
  keywords: SITE.keywords,
  category: 'technology',
  referrer: 'origin-when-cross-origin',
  formatDetection: { telephone: false, address: false, email: false },
  robots: INDEXABLE
    ? { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } }
    : { index: false, follow: false },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : undefined,
  },
};

export const viewport = {
  themeColor: SITE.background,
  colorScheme: 'dark',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <JsonLd data={[websiteJsonLd(), personJsonLd()]} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
