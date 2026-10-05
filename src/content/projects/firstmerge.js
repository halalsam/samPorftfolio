import { image } from '../media';

const firstmerge = {
  slug: 'firstmerge',
  kind: 'case-study',
  order: 4,
  title: 'FirstMerge',
  year: '2025',
  role: 'Design & Development',
  platforms: ['Web'],
  tagline: 'Find a good first issue worth your weekend.',
  summary:
    'FirstMerge scores every open-source “good first issue” before you spend a weekend on it — checking whether the issue is still unclaimed, the repo is active, and the maintainers actually merge outside contributions — and rolls it all into one Merge Score.',
  live: true,
  links: [{ label: 'firstmerge.vercel.app', href: 'https://firstmerge.vercel.app/', kind: 'live' }],
  cover: image('/images/projects/firstmerge.png', 'FirstMerge screenshot', 1440, 900),
  theme: { mode: 'dark', accent: '#2F6BFF', background: '#0A0A0A', surface: '#121214' },
  hero: { variant: 'browser', media: image('/images/projects/firstmerge.png', 'FirstMerge — issue list with Merge Scores', 1440, 900), url: 'firstmerge.vercel.app' },
  blocks: [
    {
      __component: 'blocks.overview',
      navLabel: 'Overview',
      heading: 'Contribute where it will actually land.',
      body: 'FirstMerge scores every open-source “good first issue” before you spend a weekend on it — checking whether the issue is still unclaimed, the repo is active, and the maintainers actually merge outside contributions — and rolls it all into one **Merge Score**.',
      facts: [
        { label: 'Role', value: 'Design & Development' },
        { label: 'Year', value: '2025' },
        { label: 'Data', value: 'GitHub API' },
      ],
    },
    {
      __component: 'blocks.features',
      navLabel: 'Highlights',
      heading: 'Highlights',
      items: [
        { title: 'The Merge Score', body: 'A single signal that blends claim status, repo activity, and maintainer merge behaviour so contributors invest time in work that actually lands.' },
        { title: 'Live issue intelligence', body: 'Thousands of issues tracked and verified continuously, filterable by language, size, popularity, and whether they are still unclaimed.' },
        { title: 'Signal-first interface', body: 'Grouped and list views surface “likely to merge”, “mixed”, and “risky” issues with per-issue reasoning, so the decision takes seconds.' },
      ],
    },
    {
      __component: 'blocks.stats',
      navLabel: 'Numbers',
      heading: 'At the time of writing',
      items: [
        { value: 8821, label: 'issues tracked' },
        { value: 6206, label: 'likely to merge' },
        { value: 7921, label: 'unclaimed right now' },
      ],
    },
    {
      __component: 'blocks.stack',
      heading: 'Stack',
      groups: [{ label: 'Built with', items: ['Next.js', 'GitHub API', 'Tailwind CSS', 'Framer Motion'] }],
    },
  ],
};

export default firstmerge;
