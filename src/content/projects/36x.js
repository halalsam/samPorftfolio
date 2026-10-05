import { image, video } from '../media';

// Sources: 36x-medusa-strapi monorepo — 36x-frontend (Next.js), medusa/,
// strapi/, docker-compose.yml, traefik/, backup/, .github/workflows,
// DEPLOYMENT.md, git history Apr → Sep 2026 (278 commits).
// Screens are real captures of 36x.in.

const P = '/projects/36x';

const x36 = {
  slug: '36x',
  kind: 'case-study',
  order: 1,
  title: '36X',
  year: '2025—26',
  role: 'Full-stack + infrastructure',
  platforms: ['Web', 'Commerce', 'CMS', 'Self-hosted'],
  tagline: 'Born on brick. Built for motion.',
  summary:
    '36X is a streetwear label where art meets apparel. I built the whole thing — a cinematic Next.js storefront, a Medusa commerce engine, a Strapi CMS kept in two-way sync, and the self-hosted infrastructure underneath: twelve containers behind Traefik with zero-downtime deploys.',
  live: true,
  links: [
    { label: 'live.36x.in', href: 'https://live.36x.in/', kind: 'live' },
    { label: '36x.in', href: 'https://36x.in/', kind: 'web' },
  ],
  cover: image('/images/projects/36x.jpg', '36X storefront', 1440, 900),
  theme: { mode: 'dark', accent: '#8F9BFF', background: '#0B0B0D', surface: '#141518' },
  hero: {
    variant: 'video',
    media: video(`${P}/reel-16x9.mp4`, {
      alt: '36X product reel',
      width: 1280,
      height: 720,
      poster: image(`${P}/poster-16x9.jpg`, '36X reel poster', 1600, 900),
    }),
  },
  seo: {
    title: '36X — streetwear commerce, built end to end',
    description: 'Next.js storefront, Medusa v2 commerce, Strapi 5 CMS and self-hosted Docker/Traefik infrastructure with zero-downtime deploys.',
  },
  blocks: [
    {
      __component: 'blocks.overview',
      navLabel: 'Overview',
      heading: 'A streetwear brand needs a store that feels like the street.',
      body: '36X wanted drops, collections and a community to feel cinematic — brick walls, moon phases, graffiti — without giving up a fast, reliable commerce core. So the storefront is art-directed and motion-heavy, while everything behind it is boring in the best way: **typed commerce workflows, a CMS editors actually use, search that forgives typos, and infrastructure that deploys without dropping a request.**',
      facts: [
        { label: 'Role', value: 'Design, full-stack, DevOps' },
        { label: 'Storefront', value: 'Next.js 16 · React 19 · GSAP' },
        { label: 'Commerce', value: 'Medusa 2.13 · Strapi 5.41' },
        { label: 'Hosting', value: 'Self-hosted · Docker · Traefik' },
      ],
    },
    {
      __component: 'blocks.reel',
      navLabel: 'Reel',
      heading: 'One continuous camera, no cuts.',
      caption: 'A 60fps product reel: real storefront captures, rebuilt checkout and admin UI, and the infra dashboards — all values read from the repo.',
      landscape: video(`${P}/reel-16x9.mp4`, { alt: '36X reel, 16:9', width: 1280, height: 720, poster: image(`${P}/poster-16x9.jpg`, '', 1600, 900) }),
      portrait: video(`${P}/reel-9x16.mp4`, { alt: '36X reel, 9:16', width: 720, height: 1280, poster: image(`${P}/poster-9x16.jpg`, '', 720, 1280) }),
    },
    {
      __component: 'blocks.gallery',
      navLabel: 'Storefront',
      heading: 'The storefront',
      columns: 2,
      items: [
        { media: image(`${P}/home-desktop-top.jpg`, '36X home — Born on brick, built for motion', 1600, 1000), frame: 'browser', caption: 'Home', url: '36x.in' },
        { media: image(`${P}/collection-desktop-top.jpg`, '36X Moonphase collection', 1600, 1000), frame: 'browser', caption: 'Collection — Moonphase', url: '36x.in/collections/moonphase' },
        { media: image(`${P}/product-desktop-top.jpg`, '36X product page — Procrastination Tee', 1600, 1000), frame: 'browser', caption: 'Product', url: '36x.in/products/procrastination-tee' },
        { media: image(`${P}/timeline-desktop-top.jpg`, '36X collection timeline', 1600, 1000), frame: 'browser', caption: 'Collection timeline', url: '36x.in/collection-timeline' },
      ],
    },
    {
      __component: 'blocks.features',
      navLabel: 'Commerce',
      heading: 'Under the art direction',
      items: [
        { tag: 'Search', title: 'Typo-tolerant instant search', body: 'A custom Meilisearch module keeps the product index in sync from Medusa events and serves search through the store API.' },
        { tag: 'Checkout', title: 'Razorpay checkout', body: 'Multi-step checkout with pincode auto-fill, a custom Razorpay payment provider (UPI, cards, netbanking, wallets, EMI) and cash on delivery.' },
        { tag: 'Content ops', title: 'Two-way Strapi ⇄ Medusa sync', body: '24 event subscribers push products, variants, options, collections and categories into Strapi; a webhook brings edits back; a nightly job and an admin page run full syncs with live progress.' },
        { tag: 'Email', title: 'Transactional email', body: 'A Resend notification provider sends order-placed, status and transfer emails from Medusa workflows.' },
        { tag: 'Growth', title: 'Server-side conversions', body: 'A marketing-analytics module fires Google, Meta CAPI and TikTok Events from order subscribers — plus self-hosted Umami for privacy-friendly traffic.' },
        { tag: 'Editors', title: 'Draft previews + reviews', body: 'Strapi draft mode previews on the storefront, Google sign-in for customers, and moderated product reviews.' },
      ],
    },
    {
      __component: 'blocks.architecture',
      navLabel: 'Architecture',
      heading: 'How it’s wired',
      intro: 'Twelve Docker Compose services on one server behind Traefik, with health checks gating every dependency. Every line below is a real call in the code — hover a node to trace it.',
      layers: [
        {
          label: 'Client',
          nodes: [{ key: 'customer', icon: 'smartphone', name: 'Customer', detail: '36x.in', highlight: true, connectsTo: ['traefik'] }],
        },
        {
          label: 'Edge',
          nodes: [
            // routers in docker-compose.yml (frontend, medusa, strapi, umami)
            { key: 'traefik', icon: 'shield', name: 'Traefik v3', detail: 'TLS · Let’s Encrypt · HSTS · rate limit', highlight: true, connectsTo: ['storefront', 'medusa', 'strapi', 'umami'] },
          ],
        },
        {
          label: 'Apps',
          nodes: [
            // server-side fetches over the Docker network (MEDUSA_INTERNAL_URL, STRAPI_INTERNAL_URL)
            { key: 'storefront', icon: 'globe', name: 'Storefront', tag: '×2', detail: 'Next.js 16', connectsTo: ['medusa', 'strapi'] },
            // MEDUSA_WORKER_MODE=server: store API, /store/search, Razorpay, Google auth
            { key: 'medusa', icon: 'shopping-bag', name: 'Medusa API', tag: '×2', detail: 'Medusa 2.13 · server', connectsTo: ['pg-commerce', 'redis', 'meili', 'razorpay', 'oauth'] },
            // MEDUSA_WORKER_MODE=worker: subscribers + jobs (Strapi sync, search sync, emails, conversions)
            { key: 'worker', icon: 'cpu', name: 'Medusa worker', detail: 'subscribers · jobs', connectsTo: ['pg-commerce', 'redis', 'meili', 'strapi', 'resend', 'ads'] },
            // webhook back into Medusa: /webhooks/strapi
            { key: 'strapi', icon: 'file-text', name: 'Strapi 5', detail: 'headless CMS', connectsTo: ['pg-cms', 'medusa'] },
            { key: 'umami', icon: 'bar-chart', name: 'Umami', detail: 'self-hosted analytics', connectsTo: ['pg-analytics'] },
          ],
        },
        {
          label: 'Data',
          nodes: [
            { key: 'pg-commerce', icon: 'database', name: 'Postgres 16', detail: 'commerce', connectsTo: ['backups'] },
            { key: 'redis', icon: 'zap', name: 'Redis 7', detail: 'event bus + workflows' },
            { key: 'meili', icon: 'search', name: 'Meilisearch', detail: 'product index' },
            { key: 'pg-cms', icon: 'database', name: 'Postgres 16', detail: 'CMS', connectsTo: ['backups'] },
            { key: 'pg-analytics', icon: 'database', name: 'Postgres 16', detail: 'analytics' },
          ],
        },
        {
          label: 'Services',
          nodes: [
            { key: 'razorpay', icon: 'credit-card', name: 'Razorpay', detail: 'payments' },
            { key: 'oauth', icon: 'key-round', name: 'Google OAuth', detail: 'customer sign-in' },
            { key: 'resend', icon: 'mail', name: 'Resend', detail: 'order emails' },
            { key: 'ads', icon: 'megaphone', name: 'Meta · TikTok · GA4', detail: 'server-side conversions' },
            { key: 'backups', icon: 'archive', name: 'Backups', detail: 'pg_dump every 6h · S3 opt-in' },
          ],
        },
      ],
      notes: [
        'Push to main → paths-filter decides which services changed → SSH deploy rebuilds only those.',
        'Storefront and API roll out with docker-rollout: new replicas pass health checks before the old ones drain — zero downtime.',
      ],
    },
    {
      __component: 'blocks.stats',
      navLabel: 'Numbers',
      heading: 'By the numbers',
      note: 'Counted from the monorepo (Oct 2026).',
      items: [
        { value: 278, label: 'commits', detail: 'Apr → Sep 2026' },
        { value: 12, label: 'containers', detail: 'in production' },
        { value: 22, label: 'Medusa workflows', detail: '36 steps' },
        { value: 24, label: 'event subscribers', detail: 'Strapi + search sync' },
        { value: 15, label: 'storefront routes', detail: 'Next.js App Router' },
        { value: 15, label: 'CMS content types', detail: 'Strapi 5' },
      ],
    },
    {
      __component: 'blocks.gallery',
      heading: 'On the phone',
      columns: 3,
      items: [
        { media: image(`${P}/home-mobile-top.jpg`, '36X home on mobile', 600, 1298), frame: 'phone' },
        { media: image(`${P}/product-mobile-top.jpg`, '36X product on mobile', 600, 1298), frame: 'phone' },
        { media: image(`${P}/collection-mobile-top.jpg`, '36X collection on mobile', 600, 1298), frame: 'phone' },
      ],
    },
    {
      __component: 'blocks.brand',
      navLabel: 'Brand',
      heading: 'Concrete, ink and a blue that glows',
      body: 'The storefront runs on near-black surfaces with periwinkle accents and the electric brand blue from the logo tile. Display type is Bebas Neue; UI is Figtree; long copy is Raleway.',
      logo: image(`${P}/logo.svg`, '36X logo', 71, 32),
      logoBackground: '#081EC9',
      palette: [
        { name: 'Brand blue', hex: '#081EC9' },
        { name: 'Periwinkle', hex: '#5B6BFF' },
        { name: 'Haze', hex: '#8F9BFF' },
        { name: 'Ink', hex: '#0E0F11' },
        { name: 'Coal', hex: '#111111' },
        { name: 'Panel', hex: '#1A1C1F' },
      ],
      typefaces: [
        { name: 'Bebas Neue', role: 'Display' },
        { name: 'Figtree', role: 'UI' },
        { name: 'Raleway', role: 'Body' },
      ],
    },
    {
      __component: 'blocks.stack',
      heading: 'Stack',
      groups: [
        { label: 'Storefront', items: ['Next.js 16', 'React 19', 'Tailwind', 'GSAP', 'Framer Motion', 'shadcn/ui'] },
        { label: 'Commerce', items: ['Medusa 2.13', 'Strapi 5.41', 'Meilisearch', 'Razorpay', 'Resend', 'Redis'] },
        { label: 'Infra', items: ['Docker Compose', 'Traefik v3', 'Let’s Encrypt', 'PostgreSQL 16', 'GitHub Actions', 'docker-rollout', 'Umami'] },
      ],
    },
  ],
};

export default x36;
