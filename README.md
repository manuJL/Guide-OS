# GuideOS

GuideOS teaches people how to use their phone.

You tell it what you want to do — in English, Hindi, or Telugu, by typing or speaking — and
it walks you through the steps one at a time, on a little phone that lights up the exact
button you're supposed to press. It reads each step out loud, too, and waits for you to
actually do it before moving on.

That's the whole idea. Most instructions assume you already know where the settings live
and which icon is which. GuideOS doesn't. It shows you, one tap at a time, and explains why
each step matters if you're curious. It was built with first-time smartphone users in mind —
and for anyone trying to walk a parent through something over the phone.

There's no account and no server. Once the page loads, it runs entirely in your browser.

## What you can do right now

Ask for help in plain language and GuideOS will recognise the task, or offer you a menu if
you're not sure what to ask for. There's a **Give me manual** button for exactly that.

It currently knows three tasks:

| Task | Steps |
| --- | --- |
| Send a photo on WhatsApp | 7 |
| Set an alarm | 5 |
| Turn on Wi-Fi | 4 |

Along the way you get a guided manual panel (step counter, progress, the instruction,
what to tap, an optional "why this step"), a pulsing highlight around the control you need,
and speech controls to replay, pause, mute, or turn the voice off.

## What's inside

- **Three languages** — English, हिन्दी, and తెలుగు. It switches automatically if you write
  in Hindi or Telugu, remembers your choice next visit, and quietly falls back to English
  for anything not translated yet.
- **Voice in and voice out** — speak your request with the microphone, and hear the steps
  read back through the browser's speech engine.
- **A simulated phone** — home screen, WhatsApp, Clock, and Settings, with a status bar, a
  dynamic island, and smooth transitions between screens. It's for practice; nothing you do
  touches a real device.
- **Highlighting that doesn't get in the way** — the glow sits just outside the control, so
  the logo is never covered.
- **An accessible, calm interface** — a deep navy theme with restrained blue-and-violet
  accents, consistent corner radii and spacing, 44px touch targets, visible focus rings, and
  respect for your system's reduced-motion setting.

## Running it

You'll need [Node.js](https://nodejs.org) 18 or newer and npm 9+. Then:

```bash
git clone https://github.com/manuJL/guideos.git
cd guideos
npm install
npm run dev
```

Open the URL it prints (usually http://localhost:5173). That's it.

If you're on Linux, Windows, or macOS and want the fuller walkthrough — including how to
install Node if you don't have it — see [docs/QUICKSTART.md](docs/QUICKSTART.md).

To make a production build:

```bash
npm run build     # type-checks, then writes static files to dist/
npm run preview   # serve that build locally to check it
```

The `dist/` folder is plain static files, so you can drop it on GitHub Pages, Netlify,
Vercel, nginx, S3 — wherever.

## Built with

React 18 and TypeScript, bundled by Vite. Icons come from `react-icons` (Simple Icons for
brand marks, Material icons for the generic glyphs). Voice uses the browser's Web Speech
API. Styling is hand-written CSS with design tokens — no framework.

One note: `simple-icons` is still listed in `package.json`, but nothing imports it anymore,
since the icons are read through `react-icons`. You can remove it if you like.

## Where things live

```
guideos/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── docs/                      # the full docs, start at docs/README.md
└── src/
    ├── main.tsx               # entry point
    ├── App.tsx                # the shell; holds all the app state
    ├── PhoneSimulator.tsx     # the simulated phone (every screen)
    ├── components/
    │   └── GuidePanel.tsx     # the guided manual panel
    ├── voice/
    │   └── useNarration.ts    # text-to-speech
    ├── i18n/
    │   └── strings.ts         # translations + t()
    ├── intentClassifier.ts    # figures out what the user asked for
    ├── tutorials.ts           # the tutorial data
    ├── phoneData.ts           # sample contacts and photos
    ├── photoScenes.tsx        # SVG thumbnails for the gallery
    ├── icons.tsx              # brand marks and glyphs
    ├── types.ts
    └── styles.css
```

## Commands

| Command | Does |
| --- | --- |
| `npm run dev` | dev server with live reload |
| `npm run build` | type-check with `tsc`, then build with Vite |
| `npm run preview` | serve the built app locally |
| `npx tsc --noEmit` | just type-check |

There's no linter or test runner set up yet. Type-checking is what we rely on.

## How it fits together

Everything hangs off `App.tsx`, which owns the state — chat, the tutorial engine, which
phone screen is showing, voice, all of it. `PhoneSimulator` and `GuidePanel` are purely
presentational: they take props and call back.

A tutorial is just data in `src/tutorials.ts`. Each step names the id of the control the
user should tap, and the phone tags its elements with matching ids. Tap the right one and
the step advances; tap anything else and you get a gentle nudge. That id pairing is the
one rule worth respecting, because it's what makes the highlighting work.

If you want the details — the request flow, the state machine, the narration effect — they're
in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Browsers

The app and narration work pretty much everywhere. Voice input is the exception; it relies
on the browser's speech recognition, which is mostly a Chrome and Edge thing.

| | Chrome / Edge | Safari | Firefox |
| --- | --- | --- | --- |
| App + guided manual | yes | yes | yes |
| Narration (text to speech) | yes | yes | yes |
| Voice input | yes | partial | no — typing still works |

When voice input isn't available, GuideOS says so and you type instead.

## Docs

Everything else is in [`docs/`](docs/README.md):

- [Quickstart for Linux, Windows, and macOS](docs/QUICKSTART.md)
- [Architecture](docs/ARCHITECTURE.md)
- [User guide](docs/USER-GUIDE.md)
- [Development](docs/DEVELOPMENT.md)
- [Adding a tutorial](docs/ADDING-A-TUTORIAL.md)
- [Internationalization](docs/INTERNATIONALIZATION.md)
- [Voice and speech](docs/VOICE-AND-SPEECH.md)
- [FAQ](docs/FAQ.md)

## Contributing

Branch off `main`, keep changes focused, and leave the state in `App.tsx` while the
components stay presentational. Run `npx tsc --noEmit` and `npm run build` before you
commit, and update the matching doc under `docs/` if you change how something behaves.

## License

There's no license file yet, so for now this is all rights reserved. If you plan to open it
up, add a `LICENSE`.
