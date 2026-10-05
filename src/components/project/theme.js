// Turns a project's `theme` ({ mode, accent, background, surface }) into the
// CSS variables every block styles itself with (Tailwind `pd-*` colours).
// Contrast is computed, so any accent a CMS editor picks stays readable.

const hexToRgb = (hex) => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h.slice(0, 6);
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const luminance = (hex) => {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const rgba = (hex, a) => `rgba(${hexToRgb(hex).join(',')},${a})`;

const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const mix = (a, b, t) => {
  const to = hexToRgb(b);
  return `#${hexToRgb(a)
    .map((v, i) => Math.round(v + (to[i] - v) * t).toString(16).padStart(2, '0'))
    .join('')}`;
};

const INK = '#0A0A0A';

/** Text on a fill: whichever of ink or white has the higher contrast ratio. */
export const readableOn = (hex) => (contrast(hex, INK) >= contrast(hex, '#FFFFFF') ? INK : '#FFFFFF');

/** The accent used as text on the page, nudged toward the foreground until
 *  it reads at WCAG AA (4.5:1) against the background. */
const accentText = (accent, bg, fg) => {
  for (let i = 0; i <= 10; i++) {
    const c = mix(accent, fg, i / 10);
    if (contrast(c, bg) >= 4.5) return c;
  }
  return fg;
};

// Full-bleed to the project panel's edges; mirrors ProjectPage's padding.
export const BLEED = '-mx-5 sm:-mx-10 lg:-mx-14';

export function themeVars(theme) {
  const dark = theme.mode !== 'light';
  const fg = dark ? '#F5F4F5' : '#111111';
  return {
    '--pd-bg': theme.background,
    '--pd-fg': fg,
    '--pd-muted': rgba(fg, dark ? 0.62 : 0.62),
    '--pd-faint': rgba(fg, dark ? 0.38 : 0.42),
    '--pd-line': rgba(fg, dark ? 0.12 : 0.1),
    '--pd-surface': theme.surface ?? (dark ? rgba('#FFFFFF', 0.03) : '#FFFFFF'),
    '--pd-accent': theme.accent,
    '--pd-accent-fg': readableOn(theme.accent),
    '--pd-accent-text': accentText(theme.accent, theme.background, fg),
    '--pd-accent-soft': rgba(theme.accent, dark ? 0.14 : 0.1),
    colorScheme: dark ? 'dark' : 'light',
  };
}
