import { image, video } from '../media';

// Sources: garageflow (Expo app) + garageflow-backend (NestJS API) repos —
// INTEGRATION.md, REQUIREMENTS.md, ARCHITECTURE.md, prisma/schema.prisma,
// openapi.json, render.yaml, git history (Oct 2026).

const P = '/projects/garageflow';

const garageflow = {
  slug: 'garageflow',
  kind: 'case-study',
  order: 2,
  title: 'GarageFlow',
  year: '2026',
  role: 'Design & full-stack — app + API',
  platforms: ['iOS', 'Android', 'API'],
  tagline: 'A car workshop, run from one live thread.',
  summary:
    'GarageFlow runs a car workshop from the phone: every job card is a live, WhatsApp-style thread where technicians post photos, voice notes and parts, managers approve estimates, and owners watch invoices, GST and cash flow update in real time.',
  live: false,
  links: [],
  cover: image(`${P}/poster-16x9.jpg`, 'GarageFlow — the job thread on three phones at once', 1600, 900),
  theme: { mode: 'light', accent: '#FF5A1F', background: '#F7F7F8', surface: '#FFFFFF' },
  hero: {
    variant: 'video',
    media: video(`${P}/reel-16x9.mp4`, {
      alt: 'GarageFlow product reel',
      width: 1280,
      height: 720,
      poster: image(`${P}/poster-16x9.jpg`, 'GarageFlow reel poster', 1600, 900),
    }),
  },
  seo: {
    title: 'GarageFlow — workshop management in one live thread',
    description: 'Expo + NestJS workshop app: realtime job threads, approvals, GST invoicing and finances for car workshops in India.',
  },
  blocks: [
    {
      __component: 'blocks.overview',
      navLabel: 'Overview',
      heading: 'Workshops run on WhatsApp chaos. This gives every car its own thread.',
      body: 'Indian car workshops coordinate over calls, paper job cards and a dozen WhatsApp groups. GarageFlow turns each job into one structured, **real-time thread**: the technician documents the work with photos and voice notes, parts land as priced line items, the manager approves the estimate from a push notification, and the owner sees the invoice, GST and collections without asking anyone.\n\nI designed and built both halves — the Expo mobile app and the NestJS API — contract-first, so the app and the server never drift.',
      facts: [
        { label: 'Role', value: 'Product design, mobile + backend' },
        { label: 'Built', value: '26 Jun → 10 Jul 2026' },
        { label: 'Platforms', value: 'iOS · Android · REST + WebSocket API' },
        { label: 'Users', value: 'Technicians, managers, owners' },
      ],
    },
    {
      __component: 'blocks.reel',
      navLabel: 'Reel',
      heading: 'One job. Three phones. Live.',
      caption: 'The reel follows a single Tata Nexon through the workshop — the same thread as the technician, the manager and the owner see it.',
      landscape: video(`${P}/reel-16x9.mp4`, { alt: 'GarageFlow reel, 16:9', width: 1280, height: 720, poster: image(`${P}/poster-16x9.jpg`, '', 1600, 900) }),
      portrait: video(`${P}/reel-9x16.mp4`, { alt: 'GarageFlow reel, 9:16', width: 720, height: 1280, poster: image(`${P}/poster-9x16.jpg`, '', 720, 1280) }),
    },
    {
      __component: 'blocks.features',
      navLabel: 'Product',
      heading: 'Built around the job thread',
      intro: 'Every feature hangs off one idea: the job card is a conversation, and the conversation is the record.',
      items: [
        { tag: 'Realtime', title: 'Live job thread', body: 'Comments, photos, voice notes, parts and status changes stream into a per-job room. WhatsApp-style ticks go from sending to sent to read; optimistic sends reconcile with the server echo.' },
        { tag: 'Approvals', title: 'Estimate → approval in a tap', body: 'Parts and labour roll up into an estimate; the manager gets a push, reviews the lines and approves or declines — the decision lands back in the thread and releases the job.' },
        { tag: 'Voice + media', title: 'Hands-dirty capture', body: 'Hold-to-record voice notes with lock and slide-to-cancel gestures, compressed photo uploads via presigned URLs, and before/after completion photos on delivery.' },
        { tag: 'Money', title: 'GST invoices & payments', body: 'Invoices split CGST/SGST for intra-state sales, record cash / UPI / card payments, render a PDF receipt and open the customer’s WhatsApp with the message pre-filled.' },
        { tag: 'Owner view', title: 'Finances that can’t go stale', body: 'Collections, receivables, expenses, GST reports and party ledgers are derived from invoices, payments and expenses — never stored as snapshots.' },
        { tag: 'Roles', title: 'RBAC end to end', body: 'Technician, manager and admin each get their own app shell; the API enforces the same roles with global guards, so a tech simply can’t reach finance.' },
      ],
    },
    {
      __component: 'blocks.brand',
      navLabel: 'Brand',
      heading: 'An identity for a workshop that talks',
      body: 'The app shipped with the default Expo icon, so I drew one: a garage-shaped chat bubble with typing dots — the workshop, mid-conversation. The wordmark is Satoshi Black, the same face as the app UI.',
      logo: image(`${P}/garageflow-lockup.svg`, 'GarageFlow logo lockup', 1400, 300),
      logoBackground: '#FFFFFF',
      palette: [
        { name: 'Signal orange', hex: '#FF5A1F' },
        { name: 'Approval purple', hex: '#6C2BD9' },
        { name: 'Ink', hex: '#1A1A1A' },
        { name: 'Canvas', hex: '#F7F7F8' },
        { name: 'Thread', hex: '#F0EEF6' },
        { name: 'WhatsApp', hex: '#25D366' },
      ],
      typefaces: [{ name: 'Satoshi', role: 'UI + wordmark — Regular to Black' }],
    },
    {
      __component: 'blocks.architecture',
      navLabel: 'Architecture',
      heading: 'Contract-first, realtime by default',
      intro: 'The mobile data model is the contract: `types/api.ts` defines every shape, and the backend’s serializers emit exactly that — money in paise in the database, rupees and Indian date strings on the wire. Hover a node to trace its connections.',
      layers: [
        {
          label: 'App',
          nodes: [
            // REST via the typed client, socket.io-client to the gateway, presigned PUTs straight to storage
            { key: 'app', icon: 'smartphone', name: 'Expo 56 app', tag: '3 roles', detail: 'RN 0.85 · NativeWind · Reanimated 4', highlight: true, connectsTo: ['api', 'socket', 'storage'] },
          ],
        },
        {
          label: 'API',
          nodes: [
            // Prisma, presign/upload (storage.service), Expo push (notifications.service), broadcasts via the gateway
            { key: 'api', icon: 'shield-check', name: 'NestJS API', tag: 'REST', detail: '14 modules · JWT + RBAC · OpenAPI', connectsTo: ['postgres', 'storage', 'push', 'socket'] },
            // job-events.gateway.ts: per-job rooms on the Redis adapter
            { key: 'socket', icon: 'radio', name: 'Socket.IO gateway', detail: 'per-job rooms · live timeline', connectsTo: ['redis'] },
          ],
        },
        {
          label: 'Data',
          nodes: [
            { key: 'postgres', icon: 'database', name: 'PostgreSQL 16', detail: 'Prisma · 19 models' },
            { key: 'redis', icon: 'zap', name: 'Redis 7', detail: 'Socket.IO pub/sub adapter' },
            { key: 'storage', icon: 'cloud-upload', name: 'S3 / R2', detail: 'presigned photo + voice uploads' },
          ],
        },
        {
          label: 'Delivery',
          nodes: [{ key: 'push', icon: 'bell', name: 'Expo Push', detail: 'approvals · status · delivery' }],
        },
      ],
      notes: [
        'Serializers are the only boundary between Prisma rows and the app contract.',
        'Deployed on Render (Singapore): a Docker web service with managed Postgres and Redis.',
      ],
    },
    {
      __component: 'blocks.stats',
      navLabel: 'Numbers',
      heading: 'Two repos, fifteen days',
      note: 'Counted from git, openapi.json and the Prisma schema.',
      items: [
        { value: 60, label: 'commits', detail: 'app + API, 26 Jun → 10 Jul 2026' },
        { value: 59, label: 'API endpoints', detail: 'OpenAPI contract' },
        { value: 19, label: 'data models', detail: 'Prisma · PostgreSQL' },
        { value: 22, label: 'screens', detail: 'Expo Router' },
        { value: 92, label: 'components', detail: 'feature-grouped' },
        { value: 3, label: 'roles', detail: 'tech · manager · admin' },
      ],
    },
    {
      __component: 'blocks.stack',
      heading: 'Stack',
      groups: [
        { label: 'Mobile', items: ['Expo 56', 'React Native 0.85', 'Expo Router', 'NativeWind', 'Reanimated 4', 'TanStack Query', 'FlashList', 'expo-audio', 'expo-print'] },
        { label: 'API', items: ['NestJS', 'Prisma', 'PostgreSQL 16', 'Redis 7', 'Socket.IO', 'JWT + rotating refresh', 'Swagger / OpenAPI'] },
        { label: 'Infra', items: ['Docker', 'Render', 'S3 / R2', 'Expo Push', 'EAS'] },
      ],
    },
    {
      __component: 'blocks.timeline',
      heading: 'How it came together',
      items: [
        { date: '26 Jun', title: 'App first, on mock data', body: 'The whole mobile app was designed and built against in-memory fixtures — the fixtures became the contract.' },
        { date: '27 Jun', title: 'API from an empty repo', body: 'NestJS + Prisma stood up to serve that exact contract, with RBAC, money in paise and Indian formatting in serializers.' },
        { date: 'Early Jul', title: 'Cut-over to live data', body: 'Mock → typed fetch client + TanStack Query; every screen reads live data, optimistic updates included.' },
        { date: '10 Jul', title: 'Realtime + push', body: 'Socket.IO job rooms with the Redis adapter, Expo push for approvals and deliveries.' },
      ],
    },
  ],
};

export default garageflow;
