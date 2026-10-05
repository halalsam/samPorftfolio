import { image } from '../media';

// Earlier builds without a case study — they appear in the work slider and
// link out. Same entry shape, `kind: 'archive'`, no blocks.

const archive = [
  {
    slug: 'aelzel',
    kind: 'archive',
    order: 10,
    title: 'Aelzel',
    year: '2024',
    role: 'Design & Development',
    live: false,
    links: [{ label: 'GitHub', href: 'https://github.com/Sammk21/AfStore', kind: 'repo' }],
    cover: image('/videos/AF.gif', 'Aelzel store', 1200, 926),
    theme: { mode: 'dark', accent: '#D4A373' },
  },
  {
    slug: 'divide-by-zero',
    kind: 'archive',
    order: 11,
    title: 'Divide by Zero',
    year: '2024',
    role: 'Design & Development',
    live: false,
    links: [{ label: 'GitHub', href: 'https://github.com/Sammk21/dbz-store-of', kind: 'repo' }],
    cover: image('/images/dividebyzero.webp', 'Divide by Zero store', 480, 300),
    theme: { mode: 'dark', accent: '#8B5CF6' },
  },
  {
    slug: 'only-education',
    kind: 'archive',
    order: 12,
    title: 'Only Education',
    year: '2024',
    role: 'Development',
    live: true,
    links: [{ label: 'onlyeducation.in', href: 'https://onlyeducation.in', kind: 'live' }],
    cover: image('/images/onlyeducation.webp', 'Only Education', 480, 270),
    theme: { mode: 'dark', accent: '#38BDF8' },
  },
];

export default archive;
