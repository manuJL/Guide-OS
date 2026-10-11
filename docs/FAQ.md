# FAQ

The questions that keep coming up.

## What is GuideOS, exactly?

A small web app that teaches people how to use a phone. You ask for a task in plain language
and it walks you through it step by step on a simulated phone, highlighting what to tap and
reading the steps out loud. Real phone, real instructions — but the phone on screen is just for
practice, so nothing you do affects a real device.

## Who's it for?

Anyone who finds phones intimidating — first-time smartphone users, older users, people who
learn better by being shown than by reading a list. Also handy for walking someone through
something over the phone when you can't see their screen.

## What languages does it speak?

English, Hindi (हिन्दी), and Telugu (తెలుగు). It switches automatically if you type in Hindi or
Telugu, remembers your choice, and falls back to English for anything not translated yet. See
[INTERNATIONALIZATION.md](INTERNATIONALIZATION.md).

## Does it work offline?

Once the page has loaded, yes. There's no backend and no network calls. Narration and voice
input use browser APIs, so they work offline too.

## Is any of my data sent anywhere?

No. There's no server. It runs entirely in your browser. The only thing it stores is your
language choice, in your browser's localStorage.

## Why doesn't the microphone work in Firefox?

Firefox has never supported the Web Speech recognition API. Voice *input* is Chrome/Edge only
(Safari is partial). You can always type instead. Narration works fine in Firefox.

## The voice sounds robotic, or there's no voice for my language.

Voices come from your operating system, not the app. Many systems have no Hindi or Telugu
voice, so the browser substitutes the nearest one. Installing more voices is an OS setting —
the steps are in [VOICE-AND-SPEECH.md](VOICE-AND-SPEECH.md).

## What tasks does it know?

Three so far: sending a photo on WhatsApp, setting an alarm, and turning on Wi-Fi. It's built
so more are easy to add — see [ADDING-A-TUTORIAL.md](ADDING-A-TUTORIAL.md).

## Can I add a new task?

Yes, and it's mostly data entry. You write the steps in `src/tutorials.ts`, add keywords so the
classifier recognises the request, point each step at the id of a control on the phone, and add
the strings. The full walkthrough is in
[ADDING-A-TUTORIAL.md](ADDING-A-TUTORIAL.md).

## How do I run it?

```bash
git clone https://github.com/manuJL/guideos.git
cd guideos
npm install
npm run dev
```

You need Node 18+ and npm 9+. The [quickstart](QUICKSTART.md) covers installing Node on Linux,
Windows, and macOS.

## Does it need a server or database?

No. It's static files. Build with `npm run build` and host the `dist/` folder anywhere.

## What's it built with?

React 18 and TypeScript, bundled with Vite. Styling is plain CSS with design tokens. Icons come
from `react-icons`. Speech uses the browser's Web Speech API.

## There's no linter or tests?

Not yet. Type-checking (`npx tsc --noEmit`, or `npm run build`) is the current safety net.

## Why is `simple-icons` in package.json if it's unused?

Leftover from an earlier approach. The icons are now read through `react-icons`, so
`simple-icons` can be removed with `npm uninstall simple-icons` whenever convenient.

## I found a bug. What now?

Open an issue at <https://github.com/manuJL/guideos/issues> with what you expected, what
happened, and your browser. If it's about speech, mention your OS and which voices you have
installed — that's usually where the problem is.
