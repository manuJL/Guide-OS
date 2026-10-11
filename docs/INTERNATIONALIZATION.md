# Internationalization

GuideOS speaks English, Hindi, and Telugu. This is how that works and how to add a fourth.

## Where the strings are

Everything user-facing lives in `src/i18n/strings.ts`. There's one dictionary per language —
`en`, `hi`, `te` — plus an `I18nStrings` type that lists every key. If a key is in the type,
the compiler will remind you to give it a value in the English dictionary.

Helper functions handle the fiddly bits:

- `t(lang)` returns a merged dictionary: the chosen language layered over English. So a key
  that's translated shows the translation, and a key that isn't falls back to English rather
  than rendering blank.
- `detectLanguage(text)` looks at a piece of text and guesses the language from its script.
- `saveLanguage(lang)` / `loadSavedLanguage()` persist the choice to localStorage under
  `guideos-lang`, so it's remembered on the next visit.

Components never hardcode sentences. They call `t(lang)` and read the key they need. That's
what makes adding a language a data change rather than a code hunt.

## Falling back to English

The fallback is the important part. Because `t()` merges over the English dictionary, a
half-translated language still works everywhere — some strings in Hindi, the rest in English.
You can ship a new language incrementally without anything looking broken.

## How detection works

When you type a message, `detectLanguage` scans it. If most of the characters are Devanagari,
it switches to Hindi; if they're Telugu script, it switches to Telugu. Latin text leaves the
current language alone. It's a script check, not real language identification, which is enough
for the cases this app handles (people typing in their own script).

If someone writes Hindi in Latin letters — "wifi kaise on karein" — detection won't catch it.
That's a known rough edge; the language picker is the escape hatch.

## Adding a language

Say you want to add Tamil. It's four steps.

**1. Add it to the `Language` type** in `src/types.ts`:

```ts
export type Language = 'en' | 'hi' | 'te' | 'ta';
```

**2. Add a dictionary** in `src/i18n/strings.ts`. You can start nearly empty — only the keys
you've translated:

```ts
const ta: Partial<I18nStrings> = {
  appName: 'கையேடுOS',
  // …whatever else you've done
};
```

**3. Wire it into `t()`** so the merge and fallback include it:

```ts
const dictionaries: Record<Language, Partial<I18nStrings>> = { en, hi, te, ta };
```

**4. Teach detection** — optionally — by extending `detectLanguage` with Tamil's Unicode
range so typed Tamil switches automatically.

If your language has a voice code, add it where speech codes are mapped (`speechLangCodes` in
`App.tsx` and `SPEECH_LANG_CODE` in `voice/useNarration.ts`) so narration uses the right
accent. See [VOICE-AND-SPEECH.md](VOICE-AND-SPEECH.md).

## Things to watch

- **Don't translate brand names.** WhatsApp, Google, and the like stay as they are in every
  language.
- **Word order matters.** Build sentences with the pieces in the order the language wants;
  don't assume English order with swapped words.
- **Keep it consistent.** If one string calls it "Wi-Fi" and another "wifi", the translations
  drift apart. Pick a spelling per language and stick to it.
- **Test the fallback.** Deliberately leave a key out of your new dictionary and confirm the
  English shows through — that's the safety net working.
