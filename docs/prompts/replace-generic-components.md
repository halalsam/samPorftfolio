# Prompt: replace the generic components in samPorftfolio

Paste everything below the line into a new Claude Code session opened in `/Users/samkhan/work/samPorftfolio`.

---

You're redesigning the generic, templated-looking components in my portfolio, `/Users/samkhan/work/samPorftfolio`, into distinctive, purpose-built ones. The architecture and content model are already solid. This job is about how things look and move.

## First: load my anti-slop skills

Before writing any UI, load these installed skills and follow them strictly for every component:

1. **`frontend-design:frontend-design`** (plugin): distinctive, production-grade UI that avoids generic "AI slop" aesthetics.
2. **`anthropic-skills:frontend-design`**: same goal. Use both.
3. **`animate-text`** (`~/.agents/skills/animate-text`): for kinetic headings and text reveals.

These are banned unless there's a specific reason:
- grids of identical rounded cards
- "number + pill tag + title + body" cards
- seas of pill chips
- the same "01 — LABEL" eyebrow over a giant heading on every section
- decorative glow blobs
- one blur-fade-up reveal applied to everything
- stock browser/phone mockups
- rounded-pill buttons with an arrow everywhere

## The project

- **Stack:** Next.js 16 App Router in JavaScript, Tailwind 3, framer-motion, GSAP and Locomotive Scroll v5 (Lenis, exposed as `window.__lscroll`).
- **Fonts:** Thunder for display (`src/lib/fonts.js`) and Clash Display for body.
- **Existing look:** black rounded panels, a magnetic button, a glitch boot preloader and a drag slider for Recent Work.
- **Project pages are data-driven:** `src/content/projects/*.js` → `src/lib/content/normalize.js` → `src/components/project/BlockRenderer.jsx` → `src/components/project/blocks/*`. **Read `src/content/README.md` first.** `cms/strapi/` holds a Strapi v5 schema that mirrors the content exactly.
- **Theming:** each project sets its own theme through CSS variables `--pd-*`, exposed as Tailwind colours `pd-bg`, `pd-fg`, `pd-muted`, `pd-faint`, `pd-line`, `pd-surface`, `pd-accent`, `pd-accent-fg` and `pd-accent-soft` (see `components/project/theme.js`). GarageFlow and Lade are **light**; 36X, CK Darji and FirstMerge are **dark**. Accents vary, and `readableOn()` handles text contrast.

## Hard constraints

- **Keep the data contract.** Every block keeps the signature `({ block, meta })` and the fields in the README's block table. Don't rename or remove fields. If a design needs a new optional field, add it to `normalize.js`, the README table and the matching `cms/strapi/src/components/**.json` together.
- **Respect both themes.** Every component must work in light and dark themes with any accent colour, styled only through the `pd-*` tokens (no hard-coded page colours).
- **Don't touch** `components/project/blocks/Architecture.jsx` (it was just redesigned with me), the project facts and numbers in `src/content/projects/*`, the hero title's clipping fix (the padded per-letter masks in `Hero.jsx`) or the scroll restoration in `src/app/providers.js`.
- **Accessibility:** keep alt text, keyboard focus states and `prefers-reduced-motion` support.
- **Performance:** animate only `transform` and `opacity`, and keep videos playing only while on screen.
- **Verification:** don't drive the preview browser or take screenshots; I do the visual testing myself. Verify with a production build: `PATH=/opt/homebrew/opt/node@22/bin:$PATH npx next build`. The ESLint config is already broken (`@eslint/js` is missing), so leave it unless I ask. Don't commit.

## The generic components to replace

### Project pages (`src/components/project/`)

| # | File | Why it reads as generic | Direction for the replacement |
|---|---|---|---|
| 1 | `primitives/Section.jsx` | Every block opens with the same "01 — LABEL" rule, a giant h2 and an intro paragraph, so the page rhythm is monotone | A section system with 2–3 distinct header treatments (for example a marginal side label, a run-in heading, an oversized index), assigned so neighbouring sections don't look alike. Keep the `meta.anchor`/`number`/`label` chapter data. |
| 2 | `blocks/Features.jsx` | A 3-column grid of identical rounded cards with number, pill tag, title and body: the classic slop pattern | Editorial: for example an index list with tags as row labels and expanding rows, or a sticky heading beside a flowing list |
| 3 | `blocks/Stats.jsx` | A bordered metric grid of big number, label and caption | Something specific to the numbers: set inline in a sentence, a ledger/tally strip or an annotated ticker. Keep `Counter.jsx` count-up and the `note` source line. |
| 4 | `blocks/Stack.jsx` | A group label followed by rows of pill chips | A typeset tech index, credits-roll or colophon style |
| 5 | `blocks/Overview.jsx` | A 7/5 split of paragraph plus a facts list | A stronger opener, for example the heading as a statement with the facts as a marginal spec sheet |
| 6 | `blocks/Timeline.jsx` | Dots on a vertical rail | For example a horizontal, scroll-scrubbed timeline or a dated log |
| 7 | `blocks/Brand.jsx` | A logo tile, a uniform swatch grid and a typeface list | A specimen sheet: swatches sized by importance, the logo on its brand colour, typeface names set large. Keep click-to-copy hex. |
| 8 | `blocks/Gallery.jsx` | A uniform grid of framed screenshots | A composed layout (staggered or overlapping, varied scale) or a drag strip reusing Recent Work's drag pattern. Respect `frame` types. |
| 9 | `blocks/Reel.jsx` | An 8/4 split of video and phone | Treat the reel as the hero, for example cinema mode with the 9:16 cut docked or toggled. Keep the sound toggle and play-in-view. |
| 10 | `blocks/MediaBlock.jsx` + `primitives/Frames.jsx` | Stock traffic-light browser and black-bezel phone mockups | Bespoke, minimal, theme-aware frames that suit the portfolio |
| 11 | `blocks/Quote.jsx`, `blocks/Cta.jsx`, `blocks/RichTextBlock.jsx` | Generic (a big quote mark, a tinted CTA box, plain prose). Unused today, but available in the CMS. | Give each a distinctive design |
| 12 | `Hero.jsx` | A dot-separated meta row, an accent glow blob and pill CTAs | Rework the meta row, CTAs and media presentation. Keep the Thunder title rise and its clipping fix. |
| 13 | `primitives/LinkButton.jsx` | A rounded pill with an arrow, used everywhere | A new link and button language shared across project pages |
| 14 | `ChapterRail.jsx`, `NextProject.jsx` | Common patterns | Refine them to match the new system |
| 15 | `components/ui/blur-fade.jsx` (used by every block) | One identical blur-fade-up reveal everywhere | A small motion vocabulary of 2–3 reveal types, used deliberately |

### Site-wide

| # | File | Why it reads as generic | Direction |
|---|---|---|---|
| 16 | `components/Footer/index.jsx` | "LET'S GET YOU IN CREATIVE SPACE", pure `#ff0000`, pill email and phone buttons | A footer with a point of view. Keep the existing contact details exactly as they are. |
| 17 | `components/Header/index.jsx` | A stale "©2024" and a generic "Available for freelance work" | Rework it; make the year dynamic |
| 18 | `components/About-me/index.jsx` | Stacked "services" cards and logo marquee rows | Rethink it while keeping its content |
| 19 | `src/app/contact/page.js` | A stub that only renders the word "Contact" | Build a real contact page using only the contact details already in the Footer |

### Keep (already distinctive)

The glitch boot preloader (`pre-loader`), the Recent Work drag slider, the Architecture graph, the magnetic button, the custom cursor, `Counter.jsx`, `RichText.jsx` (rendering logic) and the `Media.jsx` play-in-view logic.

### Delete (dead code: confirm nothing imports them, then remove)

- `components/ui/badge.jsx`
- `components/ui/safari.jsx`
- `components/loader/`
- `components/Layout/Home/` (the old hero, its stickers and font)
- `components/Common/button/` (only used by the old hero)
- `src/context/pageContext.jsx`

Also check whether the `components/index.js` barrel is still needed.

## How to work

1. Load the skills, then read `src/content/README.md`, `src/content/projects/36x.js` (the richest entry) and every file listed above.
2. **Before building**, show me a short design direction:
   - one paragraph on the overall system: type scale, layout grid, motion vocabulary, link language
   - one line per component describing its replacement
   Wait for my OK.
3. Replace components **in place** (same paths and exports) so the content files, `BlockRenderer` registry and Strapi schema keep working. Keep the files small and focused.
4. Run a production build after each group (project blocks, then project chrome, then site-wide) and fix anything it reports.
5. Finish with a list of what changed per file, any new optional content fields (with the README and Strapi updates you made), and the pages I should look at.
