# Adding a tutorial

The tasks in GuideOS are just data. Adding one is mostly a matter of writing down the steps,
teaching the app to recognise the request, and making sure the controls you point at have ids.

Let's add a "Turn on Bluetooth" tutorial as an example.

## 1. Add the id to the types

Open `src/types.ts` and add your task to `TutorialId`:

```ts
export type TutorialId = 'send-photo' | 'set-alarm' | 'turn-on-wifi' | 'turn-on-bluetooth';
```

Adding it here is what lets the rest of the code know the task exists.

## 2. Write the tutorial

In `src/tutorials.ts`, add an entry to the tutorial list. Every step needs an id, an
instruction in all three languages, the id of the control to tap, and (optionally) a "why".

```ts
{
  id: 'turn-on-bluetooth',
  steps: [
    {
      id: 'bt-1',
      instruction: {
        en: 'Open Settings from the home screen.',
        hi: 'होम स्क्रीन से Settings खोलें।',
        te: 'హోమ్ స్క్రీన్ నుండి Settings తెరవండి।',
      },
      targetElementId: 'app-settings',
      why: {
        en: 'Settings is where most system controls live.',
        hi: 'Settings में ज़्यादातर सिस्टम कंट्रोल होते हैं।',
        te: 'Settings లో చాలా సిస్టమ్ నియంత్రణలు ఉంటాయి।',
      },
    },
    {
      id: 'bt-2',
      instruction: {
        en: 'Tap the Bluetooth row to turn it on.',
        hi: 'Bluetooth चालू करने के लिए उस पर टैप करें।',
        te: 'Bluetooth ఆన్ చేయడానికి దానిపై నొక్కండి।',
      },
      targetElementId: 'setting-bluetooth-toggle',
    },
    {
      id: 'bt-3',
      instruction: {
        en: 'That\'s it — Bluetooth is on.',
        hi: 'बस इतना ही — Bluetooth चालू है।',
        te: 'అంతే — Bluetooth ఆన్‌లో ఉంది।',
      },
      targetElementId: '',
    },
  ],
}
```

A few things to notice:

- The last step has an **empty** `targetElementId`. That's how you mark the finish — there's
  nothing left to tap.
- Every step has a unique id (`bt-1`, `bt-2`, …). They don't have to follow that pattern, but
  keeping them grouped by task makes them easy to find.
- You can leave `why` off entirely if a step doesn't need an explanation.

## 3. Make the controls findable

The highlight only works if the phone actually has an element with the id you named. Two cases:

- **An existing control.** `app-settings` and the other home icons already exist on the phone,
  so you can point at them right away. Reuse is good.
- **A new control.** If you're adding a Bluetooth row to the Settings screen, open
  `src/PhoneSimulator.tsx`, find the settings screen markup, and give the row
  `id="setting-bluetooth-toggle"`. Follow the pattern the Wi-Fi toggle already uses —
  including the `onClick` that flips the state.

Remember: ids are a contract. If you rename one later, come back here and update
`tutorials.ts`.

## 4. Teach the classifier to recognise it

Open `src/intentClassifier.ts`. Intent matching is keyword-based, so add your intent with a
set of words that should trigger it:

```ts
{
  intent: 'turn-on-bluetooth',
  keywords: ['bluetooth', 'pair headphones', 'connect headphones', 'turn on bluetooth'],
}
```

Score the words to fit how people actually talk. "Bluetooth" alone is a strong signal;
phrasing like "connect my headphones" is a good secondary. Keep the list focused — an
overly broad keyword steals matches from other intents.

Add the same intent to `IntentType` in `src/types.ts`, then handle it in `processRequest` in
`App.tsx` the way the existing tasks are handled — starting the tutorial when it matches.

## 5. Add it to the manual menu

The **Give me manual** picker shows the available tasks. Open the task picker (rendered from
`GuidePanel.tsx` through `App.tsx`) and add an entry for your task, using a label pulled from
the i18n strings.

If your task introduces a screen the phone doesn't have yet, add it to `PhoneSimulator.tsx`
too, so the steps have something to highlight.

## 6. Add the strings

Any text the picker or chat shows needs to live in `src/i18n/strings.ts`. Add the key to the
`I18nStrings` type, then give it an English value at minimum. Hindi and Telugu are nice to
have; without them, `t()` falls back to English automatically.

```ts
// in the type
turnOnBluetooth: string;

// in the dictionaries
turnOnBluetooth: 'Turn on Bluetooth',
```

## 7. Check it

```bash
npm run dev
```

Ask for it in the chat — "turn on bluetooth" — and watch the highlight land where you expect.
Tap the right control and the step should advance; tap the wrong one and you should get the
nudge, not a crash.

Before committing, run:

```bash
npx tsc --noEmit
npm run build
```

## Gotchas

- **The highlight does nothing.** Nine times out of ten it's a mismatched id — the tutorial
  points at an id the phone doesn't have. Check both files.
- **The classifier never fires.** Your keywords are too narrow, or another intent is winning
  the score. Try adding a phrase a real person would use.
- **A step won't advance.** Make sure the control's `onClick` actually calls the handler that
  moves the tutorial forward, the same way the existing steps do.
- **The completion message doesn't play again** if the user changes language on the done
  screen. That's a known limitation, not something your tutorial introduced.
