import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { MARK_PATHS, MARK_VIEWBOX } from '@/components/Logo';
import { SITE, SITE_URL } from '@/lib/site';

// Shared renderer for every Open Graph / Twitter card: the header logo
// top-left, one big title, and the page's accent along the bottom edge.

export const OG_SIZE = { width: 1200, height: 630 };

const FG = '#f5f4f5';
const MUTED = '#8a8a8a';

const fonts = async () => {
  const dir = join(process.cwd(), 'src/fonts');
  const [clash, thunder] = await Promise.all([
    readFile(join(dir, 'ClashDisplay/ClashDisplay-Bold.ttf')),
    readFile(join(dir, 'Thunder/Thunder-BlackLC.otf')),
  ]);
  return [
    { name: 'Clash', data: clash, weight: 700, style: 'normal' },
    { name: 'Thunder', data: thunder, weight: 900, style: 'normal' },
  ];
};

export async function renderOg({ eyebrow, title, subtitle, footnote, accent = SITE.signal, display = false }) {
  const host = new URL(SITE_URL).host;
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: SITE.background, color: FG, fontFamily: 'Clash', padding: '64px 72px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 64, lineHeight: 1, letterSpacing: '-0.02em' }}>sam</span>
            <svg width="32" height="32" viewBox={MARK_VIEWBOX} fill={FG}>
              {MARK_PATHS.map((d) => (
                <path key={d} d={d} />
              ))}
            </svg>
          </div>
          {eyebrow ? <span style={{ fontSize: 26, color: MUTED, marginTop: 8 }}>{eyebrow}</span> : null}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={
              display
                ? { fontFamily: 'Thunder', fontSize: title.length > 14 ? 150 : 210, lineHeight: 0.9, textTransform: 'uppercase' }
                : { fontSize: 76, lineHeight: 1.05, letterSpacing: '-0.02em', maxWidth: 980 }
            }
          >
            {title}
          </span>
          {subtitle ? <span style={{ fontSize: 34, color: MUTED, marginTop: 22, maxWidth: 980, lineHeight: 1.25 }}>{subtitle}</span> : null}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: MUTED, paddingBottom: 28 }}>
            <span>{footnote ?? SITE.name}</span>
            <span>{host}</span>
          </div>
          <div style={{ display: 'flex', height: 12, marginLeft: -72, marginRight: -72, background: accent }} />
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  );
}
