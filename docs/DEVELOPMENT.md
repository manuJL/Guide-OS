# Development

The working notes: scripts, conventions, and how to ship it.

## Requirements

Node 18+ and npm 9+. The current setup leans on `fetch`-free, modern browser APIs, so there's
nothing exotic to install beyond that.

## Commands

```bash
npm run dev       # dev server with hot reload, usually on :5173
npm run build     # tsc type-check, then vite build → dist/
npm run preview   # serve the dist/ build locally
npx tsc --noEmit  # type-check only
```

There's no `lint` or `test` script. Type-checking is the main guardrail, and the build runs it
for you.

## Conventions

A few things we've settled on, mostly so the codebase stays easy to follow:

- **State lives in `App.tsx`.** `PhoneSimulator.tsx` and `GuidePanel.tsx` are presentational
  — props in, callbacks out. Resist the urge to give them their own `useState` for app-level
  things.
- **Component files** use `PascalCase.tsx`. Non-component modules are `camelCase.ts`
  (`intentClassifier.ts`, `phoneData.ts`) or a folder with a hook inside (`voice/useNarration.ts`).
- **Element ids are a contract.** Tutorials point at phone controls by id. If you rename one
  on the phone, update `src/tutorials.ts` in the same change or highlighting breaks. Keep ids
  kebab-case and descriptive (`setting-wifi-toggle`).
- **All user-facing text goes through `t()`.** Never hardcode a sentence in a component; add
  it to `src/i18n/strings.ts` with at least an English entry. Brand names like "WhatsApp" and
  "Google" stay as they are.
- **Styling is one `styles.css` with tokens.** Use the custom properties (`--space-*`,
  `--text-*`, the radius variables) rather than magic numbers, so things stay consistent. Keep
  touch targets at 44px or larger.
- **Icons come from `react-icons`.** Brand marks via Simple Icons (`react-icons/si`),
  everything else via Material (`react-icons/md`), re-exported from `src/icons.tsx`. Don't
  invent or inline new logos; keep the existing export names so imports don't churn.

## Adding a feature

1. Work out whether it's data or behaviour. A new task is mostly data (see
   [ADDING-A-TUTORIAL.md](ADDING-A-TUTORIAL.md)); new UI usually means state in `App.tsx`
   wired to props.
2. Add any strings to the i18n dictionaries first — it's easier than retrofitting them.
3. Keep the phone's ids in sync with anything that references them.
4. Run `npx tsc --noEmit` as you go, and `npm run build` before you commit.

## Deploying

`npm run build` produces a `dist/` folder of static files. There's no server component, so
any static host works.

**Netlify / Vercel** — connect the repo and set:

- Build command: `npm run build`
- Publish directory: `dist`

**GitHub Pages** — build locally, then push `dist/` to a `gh-pages` branch. If you serve it
from a subpath (like `https://user.github.io/guideos/`), set Vite's `base` in
`vite.config.ts` to that subpath first:

```ts
export default defineConfig({ base: '/guideos/', plugins: [react()] })
```

**nginx / S3 / anywhere else** — upload `dist/`. Since it's a single-page app, point unknown
paths back at `index.html` if you add any client-side routing later (there isn't any today).

## Debugging tips

- The browser console is your friend — React warnings and speech errors both show up there.
- If narration fires twice in dev, that's React StrictMode double-invoking effects;
  `lastSpokenKeyRef` already handles the normal case, but it's worth knowing.
- `npm run build` failing on a type error while `dev` seemed fine is expected — `dev` skips
  the type-check for speed.
