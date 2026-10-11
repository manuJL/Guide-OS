# GuideOS docs

Everything about the project, in one place. If you just want to run it, go straight to the
[quickstart](QUICKSTART.md).

- [Quickstart](QUICKSTART.md) — install Node and get GuideOS running on Linux, Windows, or macOS
- [Architecture](ARCHITECTURE.md) — how the pieces fit together and where the state lives
- [User guide](USER-GUIDE.md) — how to actually use the app, no code involved
- [Development](DEVELOPMENT.md) — scripts, conventions, deployment
- [Adding a tutorial](ADDING-A-TUTORIAL.md) — teach GuideOS a new task
- [Internationalization](INTERNATIONALIZATION.md) — languages, and how to add another
- [Voice and speech](VOICE-AND-SPEECH.md) — narration, the microphone, browser quirks
- [FAQ](FAQ.md) — short answers to the usual questions

The [main README](../README.md) has the overview and a shorter quick start.

Quick orientation: it's React + TypeScript on Vite, all state sits in `src/App.tsx`, the
tasks are data in `src/tutorials.ts`, the languages are English/Hindi/Telugu, and there's no
backend of any kind.
