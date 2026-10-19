import { image, video } from '../media';

// Sources: prmpt repo — src/App.tsx, src/assets.ts, src/layout.ts,
// public/frames, git history (21 Jul 2026). The reel and screens are real
// captures of the production build; the cursor sweep is scripted.

const P = '/projects/prmpt';

const prmpt = {
  slug: 'prmpt',
  kind: 'case-study',
  order: 7,
  title: 'prmpt',
  year: '2026',
  role: 'Design & front-end',
  platforms: ['Web'],
  tagline: 'A drop page you steer with the cursor.',
  summary:
    'prmpt is a landing page for an “archive collection” drop. Move the cursor and the model turns to follow it; scroll and a black gallery panel slides over the hero, product shots swell as they pass the centre of the screen, and the page ends on an oversized “view” button.',
  live: false,
  links: [{ label: 'GitHub', href: 'https://github.com/halalsam/prmpt', kind: 'repo' }],
  cover: image(`${P}/hero-center.jpg`, 'prmpt — the archive collection hero', 1600, 1000),
  theme: { mode: 'light', accent: '#0A0A0A', background: '#FFFFFF', surface: '#F3F3F3' },
  hero: {
    variant: 'image',
    media: image(`${P}/hero-center.jpg`, 'prmpt — the archive collection hero, cursor at rest in the centre', 1600, 1000),
  },
  seo: {
    title: 'prmpt — a cursor-driven fashion drop page',
    description: 'React 19 + GSAP landing page: cursor-scrubbed WebP frame sequences on canvas, a scroll-choreographed gallery and exclusion-blended type.',
  },
  blocks: [
    {
      __component: 'blocks.overview',
      navLabel: 'Overview',
      heading: 'A product page that looks back at you.',
      body: 'Fashion drops live or die on the first few seconds. prmpt makes the hero **respond to the visitor**: the cursor’s distance from the centre of the screen scrubs one of two turntable shots, so the model turns left or right to follow it. Every line of type sits on top in `mix-blend-mode: exclusion`, so it stays readable over white backgrounds and black clothing alike.\n\nThe rest of the page is one long scroll choreography — gallery, outro, call to action — driven from a single animation loop.',
      facts: [
        { label: 'Role', value: 'Design & front-end' },
        { label: 'Built', value: '21 Jul 2026' },
        { label: 'Stack', value: 'React 19 · GSAP · Motion' },
      ],
    },
    {
      __component: 'blocks.media',
      navLabel: 'Reel',
      heading: 'Steer it left, steer it right.',
      media: video(`${P}/reel-16x9.mp4`, {
        alt: 'The cursor sweeping left and right while the model turns to follow it',
        width: 1280,
        height: 720,
        poster: image(`${P}/poster-16x9.jpg`, '', 1280, 720),
      }),
      frame: 'browser',
      url: 'prmpt',
      caption: 'A scripted cursor sweep over the production build. On touch screens there is no cursor, so the two shots play back to back on a loop.',
    },
    {
      __component: 'blocks.gallery',
      navLabel: 'Screens',
      heading: 'One hero, every angle',
      columns: 2,
      items: [
        { media: image(`${P}/hero-scrub-left.jpg`, 'Cursor left of centre — the model turns one way', 1600, 1000), frame: 'browser', caption: 'Cursor left of centre', url: 'prmpt' },
        { media: image(`${P}/hero-scrub-right.jpg`, 'Cursor at the right edge — the model turns the other way', 1600, 1000), frame: 'browser', caption: 'Cursor at the right edge', url: 'prmpt' },
      ],
    },
    {
      __component: 'blocks.features',
      navLabel: 'Interaction',
      heading: 'The details that make it feel physical',
      items: [
        { tag: 'Cursor', title: 'Scrub with a dead zone', body: 'Left of centre plays one shot, right of centre the other. Near the middle a dead zone parks the last-active shot on its first frame, so crossing the centre never snaps back to frame zero.' },
        { tag: 'Scroll', title: 'Panel, gallery, outro', body: 'A ScrollTrigger scrub slides a black panel up over the hero. A per-frame loop then scrolls the gallery under it and fades a white overlay, the product info and the “view” pill in for the outro.' },
        { tag: 'Gallery', title: 'Cards that breathe', body: 'Each card scales to full size as its centre crosses the middle of the viewport, holds briefly, then shrinks away toward its own corner. The scattered grid rebuilds for 2, 3 or 4 columns.' },
        { tag: 'Type', title: 'Exclusion-blended UI', body: 'Logo, nav, caption, price and footer all blend with exclusion, so one white type colour works over every frame of the footage and every gallery image.' },
        { tag: 'Touch', title: 'No cursor? It plays itself', body: 'Touch devices auto-play both shots back to back at 24 fps. With reduced motion on, the hero holds its first frame.' },
        { tag: 'Detail', title: 'A symbol that ticks', body: 'The small badge above the collection name swaps symbols while the page scrolls, throttled to every 80 ms so it flickers without thrashing.' },
      ],
    },
    {
      __component: 'blocks.rich-text',
      navLabel: 'Frames',
      heading: 'Why the video isn’t a video',
      body: 'The first build scrubbed two `<video>` elements by setting `currentTime` on every mouse move. Each move is a seek, and a fast sweep made the footage jitter behind the cursor.\n\nThe hero now ships each shot as **121 WebP frames** (1280×714, about 1.9 MB per side), decoded up front and drawn to a canvas with `object-fit: cover` maths at a capped device pixel ratio. Jumping to any frame is just a `drawImage`, so the scrub tracks the cursor exactly — and the frames are lighter than the source MP4s they replaced.',
    },
    {
      __component: 'blocks.media',
      heading: 'Same page, phone-sized',
      media: image(`${P}/mobile.jpg`, 'prmpt on a phone — logo, caption and the auto-playing hero', 780, 1688),
      frame: 'phone',
      width: 'narrow',
      caption: 'Below 1024 px the hero moves under the caption, the custom cursor is dropped and the type scales down.',
    },
    {
      __component: 'blocks.stats',
      navLabel: 'Numbers',
      heading: 'Small surface, lots of motion',
      note: 'Counted from the repo.',
      items: [
        { value: 242, label: 'hero frames', detail: '121 per side · WebP' },
        { value: 24, label: 'fps', detail: 'native frame rate' },
        { value: 10, label: 'gallery shots', detail: 'scattered grid' },
        { value: 1, label: 'animation loop', detail: 'gsap.ticker drives it all' },
      ],
    },
    {
      __component: 'blocks.stack',
      heading: 'Stack',
      groups: [{ label: 'Built with', items: ['React 19', 'TypeScript', 'Vite 6', 'Tailwind CSS v4', 'GSAP + ScrollTrigger', 'Motion', 'Canvas 2D'] }],
    },
  ],
};

export default prmpt;
