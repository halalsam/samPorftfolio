import { image } from '../media';

const ladeDigital = {
  slug: 'lade-digital',
  kind: 'case-study',
  order: 5,
  title: 'Lade Digital',
  year: '2025',
  role: 'Design & Development',
  platforms: ['Web'],
  tagline: 'Digital design & development agency.',
  summary:
    'A studio site for Lade Digital, an agency that helps companies build scalable digital products with thoughtful design systems and carefully crafted development. Built around a clean type-led layout with tactile 3D visuals.',
  live: true,
  links: [{ label: 'lade.digital', href: 'https://lade.digital/', kind: 'live' }],
  cover: image('/images/projects/lade.png', 'Lade Digital screenshot', 1440, 900),
  theme: { mode: 'light', accent: '#2F5FFF', background: '#F5F5F5', surface: '#FFFFFF' },
  hero: { variant: 'browser', media: image('/images/projects/lade.png', 'Lade Digital — studio site', 1440, 900), url: 'lade.digital' },
  blocks: [
    {
      __component: 'blocks.overview',
      navLabel: 'Overview',
      heading: 'Oversized type does the heavy lifting.',
      body: 'A studio site for Lade Digital, an agency that helps companies build scalable digital products with thoughtful design systems and carefully crafted development. Built around a clean **type-led layout** with tactile 3D visuals.',
      facts: [
        { label: 'Role', value: 'Design & Development' },
        { label: 'Year', value: '2025' },
      ],
    },
    {
      __component: 'blocks.features',
      navLabel: 'Highlights',
      heading: 'Highlights',
      items: [
        { title: 'Type-led minimalism', body: 'A restrained black-on-white system where oversized display type does the heavy lifting and every section breathes.' },
        { title: 'Living 3D moments', body: 'Interactive 3D visuals anchor the hero and project showcases, giving an otherwise minimal layout depth and motion.' },
        { title: 'Product-grade foundations', body: 'A component-driven build that scales from services to projects to blog while keeping performance and accessibility front of mind.' },
      ],
    },
    {
      __component: 'blocks.stack',
      heading: 'Stack',
      groups: [{ label: 'Built with', items: ['Next.js', 'Tailwind CSS', 'Framer Motion', 'Three.js'] }],
    },
  ],
};

export default ladeDigital;
