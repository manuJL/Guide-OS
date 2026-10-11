# Architecture

Short version: it's a single-page React app with no backend, and almost all the logic lives
in one file, `src/App.tsx`. Everything else either describes data or draws pixels.

Let's go through it properly.

## The shape of it

```
src/
├── main.tsx               # mounts <App />, imports the styles
├── App.tsx                # state + orchestration (the brain)
├── PhoneSimulator.tsx     # the phone, every screen (presentational)
├── components/
│   └── GuidePanel.tsx     # the manual panel (presentational)
├── voice/
│   └── useNarration.ts    # text-to-speech hook
├── i18n/
│   └── strings.ts         # translations + the t() helper
├── intentClassifier.ts    # turns a sentence into an intent
├── tutorials.ts           # the tutorial data
├── phoneData.ts           # sample contacts and photos
├── photoScenes.tsx        # SVG thumbnails for the gallery
├── icons.tsx              # brand marks and glyphs
├── types.ts               # shared types
└── styles.css             # all the styling
```

`main.tsx` is tiny — it creates the React root and renders `<App />`. From there, `App.tsx`
is in charge.

## App.tsx owns everything

There's no Redux, no context, no store. Every piece of state sits in `App.tsx` as a
`useState`, and gets handed down as props:

- `lang` — the current language, and `loadSavedLanguage` reads the saved choice from
  localStorage on first render.
- `messages` — the chat transcript, an array of `ChatMessage`.
- `inputText`, `isThinking` — the input box and the "thinking…" pause.
- `phoneScreen` — which phone screen is showing.
- `tutorialState` — the running tutorial, if any: its id, the current step, and whether
  it's done.
- `pendingTutorialId` — set when someone asks for a task while another is still open, so we
  can ask "switch to this one?".
- `voiceState` — whether narration is enabled, muted, or paused.
- `showWhy` — whether the "why this step" blurb is expanded.
- `showTaskPicker` — whether the "pick a task" menu is open.
- `selectedPhoto`, `phoneToast`, `alarmHour`, `alarmMinute`, `alarmAmPm` — bits of phone UI
  state that the phone itself doesn't own.

`PhoneSimulator.tsx` and `GuidePanel.tsx` don't hold state of their own. They render what
they're given and call callbacks like `onSend`, `onStartTutorial`, or `onToggleWhy` when
something happens. Keeping them dumb makes them easy to reason about.

## How a request flows

When you send a message or press the mic, it lands in `processRequest(text)` in `App.tsx`.
Roughly:

1. **Add your message** to the chat so it appears immediately.
2. **Show "thinking…"** for a short, deliberate beat — a real pause makes the reply feel
   considered rather than instant.
3. **Classify the intent.** `classifyIntent(text)` in `intentClassifier.ts` scores the text
   against keyword sets for each intent and returns the best match. If nothing scores, it
   checks one last thing — whether the message reads like a request for a manual at all
   (`'manual'`). If even that misses, the intent is `'unknown'`.
4. **Respond.**
   - A known task → start the tutorial (or, if one's already running, stash it in
     `pendingTutorialId` and ask whether to switch).
   - `'manual'` → open the task picker.
   - `'unknown'` → say you didn't catch that and suggest what you *can* do.

The `'manual'` branch is deliberately checked last and only when it's the best fit, so
phrases like "how do I edit a photo" still route to the photo tutorial rather than the menu.

## The tutorial engine

A tutorial is data, not code. Each one in `src/tutorials.ts` looks like this:

```ts
{
  id: 'send-photo',
  steps: [
    {
      id: 'sp-1',
      instruction: { en: 'Open WhatsApp.', hi: '…', te: '…' },
      targetElementId: 'app-whatsapp',
      why: { en: '…', hi: '…', te: '…' },
    },
    // …
  ],
}
```

The important field is `targetElementId`. It's the `id` of the control on the phone the user
is meant to tap. `PhoneSimulator.tsx` reads the current step and gives that element a
`.tutorial-highlight` class with a pulsing glow, while dimming the rest via `.tutorial-dim`.

When you click something, `App.tsx` checks whether it matches the current step's target:

- **It matches** → advance to the next step, or finish if it was the last one.
- **It doesn't** → show a gentle nudge, and don't advance. No harsh error, just a hint.

Two small rules worth knowing:

- A step with an **empty** `targetElementId` is the completion step — nothing to tap.
- Targets whose id **starts with** `gallery-photo-` match *any* gallery photo, so the user
  can pick whichever picture they like.

This is why the element ids matter so much. Rename a control on the phone and you have to
rename it in the tutorial data too, or the highlight has nothing to point at.

## Narration

Speech is handled by `voice/useNarration.ts`, a hook that wraps the browser's
`speechSynthesis`. It maps the current language to a BCP-47 voice code (`en-IN`, `hi-IN`,
`te-IN`), picks a matching voice if the system has one, and speaks.

`App.tsx` drives it through a single `useEffect`, keyed on
`tutorialId : stepIndex : lang : auto : muted`. Change any of those and it re-evaluates
whether to speak. Two refs keep it from misbehaving: `lastSpokenKeyRef` stops the same line
being spoken twice (React StrictMode runs effects twice in dev), and `completionSpokenRef`
makes sure the "you're done" line plays exactly once.

## Internationalization

Every user-facing string lives in `src/i18n/strings.ts`. The `t(lang)` helper returns the
English dictionary merged with the chosen language's, so any key we haven't translated yet
quietly falls back to English instead of showing a blank.

Language detection is simple: if your typed message is mostly Devanagari, switch to Hindi; if
mostly Telugu script, switch to Telugu. Your pick is saved to localStorage under
`guideos-lang` and restored next time. More detail in
[INTERNATIONALIZATION.md](INTERNATIONALIZATION.md).

## Styling

One hand-written `styles.css`, no framework. It starts with design tokens — colours, radii,
spacing, font sizes — as CSS custom properties, and everything else references those. The
highlight sits just *outside* each control using `box-shadow` and `outline` so it never
covers a logo, and `@media (prefers-reduced-motion: reduce)` turns off the pulsing for anyone
who's asked for less motion.

There are a couple of responsive breakpoints (around 1220px and 560px) that slim down things
like the alarm time picker so they don't overflow on narrow screens.

## What it deliberately isn't

No router — the phone screens are just branches on `phoneScreen`. No backend, no fetching,
no persistence beyond the saved language. No tests or linter yet; `tsc` is the safety net.
That keeps the whole thing approachable, which was the point.
