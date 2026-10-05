import { image, video } from '../media';

// Sources: ck-darji-app repo — app/, src/api/*.api.ts (33 endpoints),
// constants/theme.ts, .github/workflows (Android AAB + iOS TestFlight),
// app.json v4.1.0, git history Apr → Sep 2026 (84 commits).

const P = '/projects/ck-darji';

const ckDarji = {
  slug: 'ck-darji',
  kind: 'case-study',
  order: 3,
  title: 'CK Darji',
  year: '2026',
  role: 'Mobile app — design & build',
  platforms: ['iOS', 'Android'],
  tagline: 'The classroom, in every student’s pocket — and every parent’s.',
  summary:
    'The official app for CK Darji Commerce Classes, a Mumbai coaching institute for CA, ACCA, FYJC and SYJC. One React Native codebase serves two apps in one — students get lectures, notes, tests and attendance; parents get fees, results and push updates for every child.',
  live: true,
  links: [{ label: 'ckdarjicommerceclasses.com', href: 'https://www.ckdarjicommerceclasses.com/', kind: 'web' }],
  cover: image(`${P}/poster-16x9.jpg`, 'CK Darji app — student dashboard', 1600, 900),
  theme: { mode: 'dark', accent: '#91F78E', background: '#070A24', surface: '#10143A' },
  hero: {
    variant: 'video',
    media: video(`${P}/reel-16x9.mp4`, {
      alt: 'CK Darji app reel',
      width: 1280,
      height: 720,
      poster: image(`${P}/poster-16x9.jpg`, 'CK Darji reel poster', 1600, 900),
    }),
  },
  seo: {
    title: 'CK Darji — student & parent app for a commerce coaching institute',
    description: 'Expo / React Native app with OTP login, protected lectures and notes, tests, attendance, fees and push notifications.',
  },
  blocks: [
    {
      __component: 'blocks.overview',
      navLabel: 'Overview',
      heading: 'Two apps in one: students learn, parents stay in the loop.',
      body: 'CK Darji Commerce Classes teaches thousands of commerce students across FYJC, SYJC, CA and ACCA. I designed and built the mobile app that carries the classroom home: **OTP sign-in by role**, a student side for lectures, notes, tests and attendance, and a parent side that follows every child’s results, attendance and fee instalments.\n\nThe app ships to both stores from one Expo codebase, with signed Android builds and TestFlight uploads automated in CI.',
      facts: [
        { label: 'Role', value: 'Mobile app — design & development' },
        { label: 'Client', value: 'CK Darji Commerce Classes, Mumbai' },
        { label: 'Platforms', value: 'iOS · Android' },
        { label: 'Version', value: '4.1.0' },
      ],
    },
    {
      __component: 'blocks.reel',
      navLabel: 'Reel',
      heading: 'Chaotic, fast, on the beat.',
      caption: 'A 150 BPM product reel — every screen rebuilt from the app’s own code and design tokens, with demo data only.',
      landscape: video(`${P}/reel-16x9.mp4`, { alt: 'CK Darji reel, 16:9', width: 1280, height: 720, poster: image(`${P}/poster-16x9.jpg`, '', 1600, 900) }),
      portrait: video(`${P}/reel-9x16.mp4`, { alt: 'CK Darji reel, 9:16', width: 720, height: 1280, poster: image(`${P}/poster-9x16.jpg`, '', 720, 1280) }),
    },
    {
      __component: 'blocks.features',
      navLabel: 'Product',
      heading: 'What students and parents get',
      items: [
        { tag: 'Auth', title: 'OTP sign-in by role', body: 'Pick Student or Parent, enter a registered mobile number, verify a 6-digit code — routing lands each role in its own tab app.' },
        { tag: 'Student', title: 'Today at a glance', body: 'Attendance, overall score, today’s classes with a live “Now” badge and the next exam countdown on one dashboard.' },
        { tag: 'Protected', title: 'Lectures & notes that stay in the app', body: 'YouTube-backed video lectures and a PDF library, both with screen capture and recording blocked while open.' },
        { tag: 'Progress', title: 'Tests & attendance', body: 'Upcoming and completed exams with results, a month calendar of attendance and subject-wise percentages.' },
        { tag: 'Parent', title: 'Every child, one app', body: 'Switch between children, follow results and attendance, and track fees — instalment plan, paid vs due, full payment history.' },
        { tag: 'Push', title: 'Notifications that route', body: 'Expo push for results and notices; tapping a notification opens the right screen, and tokens rotate on login and logout.' },
      ],
    },
    {
      __component: 'blocks.architecture',
      navLabel: 'Architecture',
      heading: 'One codebase, two stores, zero manual builds',
      intro: 'Students and parents share one Expo app; a hardened Axios client talks to the institute’s REST API, and releases are built and signed in GitHub Actions. Hover a node to trace its connections.',
      layers: [
        {
          label: 'App',
          nodes: [
            { key: 'student', icon: 'graduation-cap', name: 'Student app', detail: 'lectures · notes · tests', connectsTo: ['client'] },
            { key: 'parent', icon: 'users', name: 'Parent app', detail: 'fees · results · attendance', connectsTo: ['client'] },
          ],
        },
        {
          label: 'Client',
          nodes: [
            // src/api/client.ts — Bearer header, 401/403 → refresh → retry with a mutex queue; tokens via token.service (SecureStore)
            { key: 'client', icon: 'plug', name: 'Axios client', tag: 'JWT', detail: 'refresh-token mutex queue', highlight: true, connectsTo: ['api', 'vault'] },
            { key: 'vault', icon: 'lock', name: 'SecureStore', detail: 'access + refresh tokens' },
          ],
        },
        {
          label: 'API',
          nodes: [{ key: 'api', icon: 'server', name: 'Institute API', tag: '33', detail: 'auth · dashboards · tests · fees', connectsTo: ['push'] }],
        },
        {
          label: 'Delivery',
          nodes: [{ key: 'push', icon: 'bell', name: 'Expo Push', detail: 'results · notices' }],
        },
      ],
      notes: [
        'Android builds a signed AAB + APK and verifies both signatures in CI; iOS builds locally on Xcode 26 with EAS and submits to TestFlight.',
        'Lectures and PDF notes block screenshots and screen recording while they are open.',
      ],
    },
    {
      __component: 'blocks.brand',
      navLabel: 'Brand',
      heading: 'Navy, mint and a monogram that points up',
      body: 'The app’s design system is a Material-style token set built around the institute’s navy, with mint for progress and maroon for urgency. Headlines are Manrope ExtraBold; body copy is Inter.',
      logo: image(`${P}/logo-navy.png`, 'CK Darji Commerce Classes logo', 1423, 946),
      logoBackground: '#FBF8FF',
      palette: [
        { name: 'Primary navy', hex: '#1A237E' },
        { name: 'Logo navy', hex: '#213569' },
        { name: 'Growth green', hex: '#006E1C' },
        { name: 'Mint', hex: '#91F78E' },
        { name: 'Maroon', hex: '#650025' },
        { name: 'Lavender', hex: '#E1DFFF' },
      ],
      typefaces: [
        { name: 'Manrope', role: 'Headlines — 600 to 800' },
        { name: 'Inter', role: 'Body + UI — 400 to 700' },
      ],
    },
    {
      __component: 'blocks.stats',
      navLabel: 'Numbers',
      heading: 'Shipped and maintained',
      note: 'Counted from the repo (Oct 2026).',
      items: [
        { value: 14, label: 'screens', detail: 'student + parent + public' },
        { value: 2, label: 'apps in one', detail: 'student · parent' },
        { value: 33, label: 'API endpoints', detail: 'integrated' },
        { value: 84, label: 'commits', detail: 'Apr → Sep 2026' },
        { value: 4.1, label: 'current version', detail: 'App Store + Play Store', decimals: 1, prefix: 'v' },
      ],
    },
    {
      __component: 'blocks.stack',
      heading: 'Stack',
      groups: [
        { label: 'App', items: ['Expo 54', 'React Native 0.81', 'Expo Router', 'TypeScript', 'react-native-pdf', 'WebView (YouTube nocookie)', 'expo-screen-capture'] },
        { label: 'Data', items: ['Axios', 'JWT + refresh queue', 'Expo SecureStore', 'Expo Notifications'] },
        { label: 'Release', items: ['GitHub Actions', 'EAS (local)', 'TestFlight', 'Signed AAB'] },
      ],
    },
  ],
};

export default ckDarji;
