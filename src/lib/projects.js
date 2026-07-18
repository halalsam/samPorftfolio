// Central source of truth for portfolio projects.
// Consumed by the Recent-Work grid and the /projects/[slug] detail pages.

export const featuredProjects = [
  {
    slug: 'firstmerge',
    name: 'FirstMerge',
    url: 'firstmerge.vercel.app',
    href: 'https://firstmerge.vercel.app/',
    repo: null,
    live: true,
    image: '/images/projects/firstmerge.png',
    year: '2025',
    role: 'Design & Development',
    tagline: 'Find a good first issue worth your weekend.',
    summary:
      'FirstMerge scores every open-source “good first issue” before you spend a weekend on it — checking whether the issue is still unclaimed, the repo is active, and the maintainers actually merge outside contributions — and rolls it all into one Merge Score.',
    accent: '#2f6bff',
    background: '#0a0a0a',
    stack: ['Next.js', 'GitHub API', 'Tailwind CSS', 'Framer Motion'],
    highlights: [
      {
        title: 'The Merge Score',
        body: 'A single signal that blends claim status, repo activity, and maintainer merge behaviour so contributors invest time in work that actually lands.',
      },
      {
        title: 'Live issue intelligence',
        body: 'Thousands of issues tracked and verified continuously, filterable by language, size, popularity, and whether they are still unclaimed.',
      },
      {
        title: 'Signal-first interface',
        body: 'Grouped and list views surface “likely to merge”, “mixed”, and “risky” issues with per-issue reasoning, so the decision takes seconds.',
      },
    ],
    stats: [
      { value: '8,821', label: 'issues tracked' },
      { value: '6,206', label: 'likely to merge' },
      { value: '7,921', label: 'unclaimed right now' },
    ],
  },
  {
    slug: 'lade-digital',
    name: 'Lade Digital',
    url: 'lade.digital',
    href: 'https://lade.digital/',
    repo: null,
    live: true,
    image: '/images/projects/lade.png',
    year: '2025',
    role: 'Design & Development',
    tagline: 'Digital design & development agency.',
    summary:
      'A studio site for Lade Digital, an agency that helps companies build scalable digital products with thoughtful design systems and carefully crafted development. Built around a clean type-led layout with tactile 3D visuals.',
    accent: '#2f5fff',
    background: '#f5f5f5',
    stack: ['Next.js', 'Tailwind CSS', 'Framer Motion', 'Three.js'],
    highlights: [
      {
        title: 'Type-led minimalism',
        body: 'A restrained black-on-white system where oversized display type does the heavy lifting and every section breathes.',
      },
      {
        title: 'Living 3D moments',
        body: 'Interactive 3D visuals anchor the hero and project showcases, giving an otherwise minimal layout depth and motion.',
      },
      {
        title: 'Product-grade foundations',
        body: 'A component-driven build that scales from services to projects to blog while keeping performance and accessibility front of mind.',
      },
    ],
    stats: [
      { value: 'Design', label: 'systems' },
      { value: 'Dev', label: 'engineering' },
      { value: '3D', label: 'motion' },
    ],
  },
  {
    slug: '36x',
    name: '36X',
    url: 'live.36x.in',
    href: 'https://live.36x.in/',
    repo: null,
    live: true,
    image: '/images/projects/36x.jpg',
    year: '2025',
    role: 'Design & Development',
    tagline: 'Born on brick. Built for motion.',
    summary:
      '36X is a streetwear commerce experience — art meets apparel, straight from the underground up. The storefront leans into a gritty, cinematic dark aesthetic with a full collections, categories, and community flow.',
    accent: '#e8b84b',
    background: '#0b0b0d',
    stack: ['Next.js', 'Tailwind CSS', 'Framer Motion', 'Commerce'],
    highlights: [
      {
        title: 'Cinematic storefront',
        body: 'A moody, brick-and-light hero sets the streetwear tone before dropping shoppers into collections and drops.',
      },
      {
        title: 'Full commerce flow',
        body: 'Collections, categories, cart, and account sign-in wired into a cohesive shopping journey with region support.',
      },
      {
        title: 'Community at the core',
        body: 'A dedicated community surface treats the brand as a movement, not just a catalogue of products.',
      },
    ],
    stats: [
      { value: 'Art', label: 'meets apparel' },
      { value: 'Drops', label: 'collections' },
      { value: 'Community', label: 'first' },
    ],
  },
];

export function getProject(slug) {
  return featuredProjects.find((project) => project.slug === slug);
}
