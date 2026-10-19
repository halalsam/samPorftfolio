import { OG_SIZE, renderOg } from '@/lib/og';
import { SITE } from '@/lib/site';

export const alt = SITE.title;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOg({
    eyebrow: 'Portfolio',
    title: 'Full-stack developer & designer.',
    subtitle: 'Web apps, mobile apps and the servers behind them — designed, built and shipped.',
    footnote: `${SITE.name} · Taking on freelance projects`,
  });
}
