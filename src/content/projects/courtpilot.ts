import { image } from '../media';

// Sources: court-pilot monorepo — README.md, docs/FRS.md, docs/ENGINE_SPEC.md,
// docs/MILESTONES.md (Decisions), packages/engine, packages/db, apps/desktop,
// git history (15–16 Oct 2026). Screens are real captures of the app running
// on the seeded demo club (`pnpm db:seed`).

const P = '/projects/courtpilot';

const courtpilot = {
  slug: 'courtpilot',
  kind: 'case-study',
  order: 6,
  title: 'CourtPilot',
  year: '2026',
  role: 'Product, engine & desktop app',
  platforms: ['Windows', 'Desktop', 'Offline'],
  tagline: 'Fair badminton nights, no peg board.',
  summary:
    'CourtPilot runs badminton club nights on one Windows PC, fully offline. Players check in, a skill-aware engine picks fair, balanced games of four, courts turn over by timer or as each game finishes, and a TV screen tells everyone where to go. Skill ratings learn from every result.',
  live: false,
  links: [],
  cover: image(`${P}/board-timer.jpg`, 'CourtPilot board — four courts in play, the waiting queue and the unavailable list', 1600, 1000),
  theme: { mode: 'light', accent: '#046C46', background: '#F4F6F5', surface: '#FFFFFF' },
  hero: {
    variant: 'image',
    media: image(`${P}/board-timer.jpg`, 'CourtPilot board in timer mode — every court explains its pick', 1600, 1000),
  },
  seo: {
    title: 'CourtPilot — offline court allocation for badminton clubs',
    description: 'Electron + React desktop app with a pure TypeScript allocation engine, OpenSkill ratings, SQLite crash recovery and a live TV display.',
  },
  blocks: [
    {
      __component: 'blocks.overview',
      navLabel: 'Overview',
      heading: 'Clubs still rotate players with a peg board. It isn’t fair, and everyone knows it.',
      body: 'A peg board depends on one volunteer, gives uneven court time, repeats the same partners and produces lopsided games. CourtPilot replaces it with a desktop app that checks players in, picks **balanced and varied foursomes** automatically, puts them on courts and shows the result on a big screen — all evening, with **zero internet**.\n\nI wrote the functional spec and engine spec, then built the whole thing: the allocation engine, the SQLite data layer, the Electron app, the TV display, licensing and the Windows installer.',
      facts: [
        { label: 'Role', value: 'Spec, engine, desktop app, packaging' },
        { label: 'Built', value: '15 → 16 Oct 2026, M0 → M10' },
        { label: 'Platform', value: 'Windows desktop · offline' },
        { label: 'Users', value: 'Club admins, volunteers, players' },
      ],
    },
    {
      __component: 'blocks.gallery',
      navLabel: 'Product',
      heading: 'One board for the operator, one screen for the hall',
      columns: 2,
      items: [
        { media: image(`${P}/court-zoom.jpg`, 'Round 1 court zoom — every court, its players and why it was picked', 1600, 1000), frame: 'none', caption: 'Timer mode: every court is picked at once and zoomed for the room.' },
        { media: image(`${P}/tv-display.jpg`, 'TV display showing four courts and the round timer', 1600, 900), frame: 'none', caption: 'The TV display — a second window, mirrored live from the main process.' },
        { media: image(`${P}/captain-suggest.jpg`, 'Game mode — the captain’s top three suggested teams with predicted balance', 1600, 1000), frame: 'none', caption: 'Game mode: the captain gets three ranked teams, each with its predicted balance.' },
        { media: image(`${P}/board-game.jpg`, 'Game mode board — per-court timers, the captain and the queue', 1600, 1000), frame: 'none', caption: 'Courts turn over independently as each game finishes.' },
      ],
    },
    {
      __component: 'blocks.features',
      navLabel: 'Features',
      heading: 'Built around a fair pick',
      intro: 'Every screen hangs off one question the engine answers in under 200 ms: who plays next, with whom, and against whom?',
      items: [
        { tag: 'Engine', title: 'Balanced, varied foursomes', body: 'A weighted cost — predicted balance, skill spread, partner and opponent repeats, mixed ratio, fixed pairings — scored over every split, then a greedy build and seeded local search.' },
        { tag: 'Ratings', title: 'Skill that learns', body: 'Players start from an admin grade of 1–10; OpenSkill ratings update after every result, so the engine’s idea of “even” sharpens week by week.' },
        { tag: 'Explained', title: 'Every court says why', body: '“Balanced 50–50 · Ana waited longest · First time Ana & Ben partner” — a short reason under each court, so nobody has to ask the volunteer.' },
        { tag: 'Two modes', title: 'Timer or game', body: 'Timer mode rotates every court together on a countdown. Game mode lets the captain pick a team — Suggest, Manual with live balance, or Auto — and courts turn over as games end.' },
        { tag: 'Overrides', title: 'The operator always wins', body: 'Drag players between courts, switch two players, lock a court, pause a player or sit them out, and undo — every change written to the database first.' },
        { tag: 'Club admin', title: 'Everything a club night needs', body: 'Barcode check-in cards and a USB scanner, CSV import, pairings and rules, fees by cash, card or UPI, reports with CSV export, and backup to a USB stick.' },
      ],
    },
    {
      __component: 'blocks.architecture',
      navLabel: 'Architecture',
      heading: 'A pure engine, a database that is the truth',
      intro: 'The engine is plain TypeScript with no I/O: time, the random seed and all state are passed in, so the same input always gives the same pick. The renderer never touches Node or the database — only typed tRPC procedures over Electron IPC. Hover a node to trace its connections.',
      layers: [
        {
          label: 'Screens',
          nodes: [
            { key: 'board', icon: 'monitor', name: 'Admin board', tag: 'React 18', detail: 'check-in · courts · overrides · admin', highlight: true, connectsTo: ['trpc'] },
            { key: 'tv', icon: 'tv', name: 'TV display', detail: 'second window · read-only', connectsTo: ['trpc'] },
          ],
        },
        {
          label: 'Main process',
          nodes: [
            // electron-trpc routers, zod-validated, over the sandboxed preload
            { key: 'trpc', icon: 'shield-check', name: 'tRPC over IPC', tag: 'zod', detail: 'contextIsolation · no Node in renderer', connectsTo: ['repos', 'timer'] },
            // round timer and per-court timers run in main so a closed window can't stop them
            { key: 'timer', icon: 'timer', name: 'Timer + scanner', detail: 'rounds turn in main · USB barcode', connectsTo: ['repos'] },
          ],
        },
        {
          label: 'Core',
          nodes: [
            { key: 'engine', icon: 'cpu', name: 'Allocation engine', tag: 'pure TS', detail: 'pickRound · suggestForCaptain · OpenSkill' },
            { key: 'repos', icon: 'layers', name: 'Repositories', detail: 'Drizzle · one transaction per action', connectsTo: ['engine', 'sqlite'] },
          ],
        },
        {
          label: 'Data',
          nodes: [{ key: 'sqlite', icon: 'database', name: 'SQLite', detail: 'WAL · synchronous FULL · crash recovery' }],
        },
      ],
      notes: [
        'Offline is enforced three ways: a CSP, a request filter that cancels anything not bundled, and lint bans on fetch and WebSocket.',
        'A crash test SIGKILLs a live session mid-round; the recovered state is byte-identical.',
      ],
    },
    {
      __component: 'blocks.rich-text',
      navLabel: 'Tuning',
      heading: 'Tuned by simulation, not by feel',
      body: 'Each simulated player gets a hidden “true skill”, results are decided by a logistic function of the skill gap, and whole sessions are replayed on fixed seeds. The acceptance bar is strict: games-played spread of **at most one**, nobody sitting out two rounds in a row, **80% of courts inside 40–60** predicted balance, no partner pair repeating more than twice, and ratings that rank players by true skill with a Spearman correlation of at least 0.8.\n\nThe spec’s default weights failed it — at the original selection penalty, balance won and some players fell three or four games behind. The fix was to raise three weights, confirm them on fresh seeds, and record every trade-off. Game mode got its own weights after the sim showed a fixed captain plus a FIFO queue can never hit the timer-mode bar; its threshold is now measured against a plain queue on the same seeds.',
    },
    {
      __component: 'blocks.media',
      heading: 'Every session is kept',
      media: image(`${P}/reports.jpg`, 'Reports — past sessions with games, winners and scores', 1600, 1000),
      frame: 'none',
      width: 'wide',
      caption: 'Reports: sessions, minutes and wins per player, and who still owes — everything exports to CSV.',
    },
    {
      __component: 'blocks.stats',
      navLabel: 'Numbers',
      heading: 'Spec to signed installer',
      note: 'Counted from the repo, the engine spec and the simulation suite.',
      items: [
        { value: 11, label: 'milestones', detail: 'M0 → M10, two days' },
        { value: 260, label: 'unit tests', detail: 'Vitest · engine, db, app' },
        { value: 14, label: 'end-to-end tests', detail: 'Playwright against Electron' },
        { value: 200, label: 'ms pick budget', prefix: '< ', detail: '16 courts · 100 players' },
        { value: 11, label: 'sim scenarios', detail: 'fairness · balance · learning' },
        { value: 0, label: 'network calls', detail: 'offline, enforced' },
      ],
    },
    {
      __component: 'blocks.stack',
      heading: 'Stack',
      groups: [
        { label: 'App', items: ['Electron 44', 'React 18', 'Vite', 'TypeScript (strict)', 'Tailwind v4', 'shadcn/ui', 'Zustand', 'dnd-kit'] },
        { label: 'Core', items: ['electron-trpc', 'zod', 'SQLite', 'better-sqlite3', 'Drizzle ORM', 'OpenSkill'] },
        { label: 'Quality + delivery', items: ['Vitest', 'Playwright', 'electron-builder (NSIS)', 'electron-updater', 'Ed25519 licences'] },
      ],
    },
    {
      __component: 'blocks.timeline',
      heading: 'How it came together',
      items: [
        { date: '11 Oct', title: 'Spec first', body: 'A functional spec split into MVP and Full Product, an engine spec with every cost term and acceptance threshold, and eleven milestones.' },
        { date: '15 Oct', title: 'Engine + simulator', body: 'Ratings, timer-mode picks and game-mode suggestions as pure TypeScript, tuned against the simulation suite before any UI existed.' },
        { date: '15 Oct', title: 'Data layer', body: 'Drizzle schema, embedded migrations, repositories, tRPC routers and crash recovery from rows, not snapshots.' },
        { date: '16 Oct', title: 'Board, modes, TV, reports', body: 'Check-in and overrides, timer and game mode end to end, the TV display, payments, reports and backup.' },
        { date: '16 Oct', title: 'Ship it', body: 'Offline Ed25519 licence activation, auto-updates, a soak test of four session-hours, and a signed one-click Windows installer.' },
      ],
    },
  ],
};

export default courtpilot;
