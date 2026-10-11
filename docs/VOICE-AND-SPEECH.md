# Voice and speech

GuideOS talks and listens. Both use the browser's built-in Web Speech API — there's no cloud
service involved and no audio ever leaves your machine.

The two features are separate, so one can work while the other doesn't:

- **Listening** (speech to text) lets you *speak* your request. Chrome and Edge only, basically.
- **Narration** (text to speech) reads the steps *out loud*. Works almost everywhere.

## Narration

Narration is handled by `voice/useNarration.ts`, a small hook around `speechSynthesis`. It
picks a voice matching the current language and speaks each step. `App.tsx` decides *when* to
speak, through one effect keyed on the tutorial, step, language, and voice settings — so
replaying, pausing, muting, and switching steps all funnel through the same place instead of
scattered `speak()` calls.

The controls you'll see:

- **Replay** — say the current step again.
- **Pause / resume** — freeze the voice mid-flow.
- **Mute** — silence it until you turn it back on.

Language maps to a BCP-47 voice code: `en-IN` for English, `hi-IN` for Hindi, `te-IN` for
Telugu. Using the `-IN` variants nudges the browser toward an Indian-accented voice where one
exists.

## Listening

Speaking your request uses `SpeechRecognition` (or `webkitSpeechRecognition`). Press the mic,
talk, and the transcript drops into the chat box as if you'd typed it.

It needs two things to work: a browser that supports it, and permission to use your
microphone. GuideOS only requests the mic when you actually press the button, not on load.

## What works where

| | Chrome / Edge | Safari | Firefox |
| --- | --- | --- | --- |
| App + guided manual | yes | yes | yes |
| Narration | yes | yes | yes |
| Listening | yes | partial | no |

Firefox has never shipped speech recognition, so the mic won't work there — typing does. Safari
supports it in recent versions but can be inconsistent. If the API is missing, GuideOS tells
you instead of silently failing.

## When it doesn't work

**No audio at all.** Work through these in order: the tab isn't muted, the system volume is
up, and you've clicked somewhere on the page (browsers block audio until a user gesture). If
narration is toggled off or muted, turn it back on.

**The voice is missing or wrong.** Voices come from your operating system, not GuideOS. Many
systems ship English voices but no Hindi or Telugu ones. If your language has no voice, the
browser falls back to the closest it has — a Hindi string spoken by an English voice, for
example. Installing a voice is an OS-level job:

- **Linux** — install `speech-dispatcher` and a voice package, e.g.
  `sudo apt install speech-dispatcher`. Voices show up per engine.
- **Windows** — Settings → Time & Language → Speech → Manage voices → Add voices.
- **macOS** — System Settings → Accessibility → Spoken Content → System Voice → Manage Voices.

After installing, reload the page so the browser picks up the new voices.

**The mic does nothing.** Check the browser is Chrome or Edge, that you've granted mic
permission (the padlock icon in the address bar), and that you're on `https://` or
`localhost` — recognition needs a secure context.

**It listens but the words are wrong.** Background noise, an unclear accent, or a language
mismatch between what you're saying and what's selected. Try again closer to the mic, or just
type it.

**It says a step twice in development.** That's React StrictMode running effects twice in dev
mode. The `lastSpokenKeyRef` guard handles the normal case; you won't see it in a production
build.
