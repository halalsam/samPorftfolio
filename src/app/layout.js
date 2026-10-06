// Lenis base styles, shipped by Locomotive for the Lenis version it bundles.
import 'locomotive-scroll/locomotive-scroll.css';
import '@/styles/globals.css';
import Providers from './providers';

// Absolute base for Open Graph / Twitter images. Set NEXT_PUBLIC_SITE_URL in
// production; on Vercel the production domain is picked up automatically.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Sameer',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
