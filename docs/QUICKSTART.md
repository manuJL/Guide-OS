# Quickstart

This walks you from "I just cloned the repo" to "there's a phone on my screen" on Linux,
Windows, and macOS. The app itself is the same everywhere — the only real difference is how
you install Node.

You need two things: **Node.js 18 or newer** and **npm 9 or newer** (npm comes bundled with
Node, so installing Node usually sorts both).

## Install Node

### Linux

The cleanest route is a version manager, because your distro's Node is often too old.

With [nvm](https://github.com/nvm-sh/nvm):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
# close and reopen your terminal
nvm install 20
nvm use 20
node -v    # should print v20.x.x
```

On Ubuntu or Debian you can also use the NodeSource repo:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Fedora, RHEL, and friends:

```bash
sudo dnf install nodejs npm
```

Arch:

```bash
sudo pacman -S nodejs npm
```

### Windows

Grab the LTS installer from [nodejs.org](https://nodejs.org) and run it. Keep the defaults,
make sure "Add to PATH" is ticked, and after it finishes open a **new** PowerShell or Command
Prompt window so the updated PATH takes effect.

If you prefer package managers:

```powershell
winget install OpenJS.NodeJS.LTS
```

```powershell
choco install nodejs-lts
```

### macOS

Homebrew is the easy way:

```bash
brew install node
```

Or download the LTS `.pkg` from [nodejs.org](https://nodejs.org) and run the installer. nvm
works here too if you'd rather manage versions.

## Check it worked

```bash
node -v
npm -v
```

You should see something like `v20.11.0` and `10.2.4`. Anything 18+ / 9+ is fine.

## Get GuideOS running

```bash
git clone https://github.com/manuJL/guideos.git
cd guideos
npm install
npm run dev
```

`npm install` pulls down React, Vite, TypeScript, and the icon packages — a minute or two,
depending on your connection. Then `npm run dev` starts the dev server and prints a local
URL, usually http://localhost:5173. Open it in your browser.

You'll land on the chat screen with the simulated phone beside it. Type "how do I send a
photo on WhatsApp?" or hit **Give me manual**, and you'll see it in action.

To stop the server, press `Ctrl+C` in the terminal.

## Making a build

```bash
npm run build
npm run preview
```

`build` runs the TypeScript checker first and then bundles everything into `dist/`. If the
type-check fails, the build stops — that's on purpose, it's how we catch mistakes.
`preview` serves that built output so you can sanity-check it before shipping.

## Troubleshooting

**`node: command not found`** — Node isn't installed, or your terminal hasn't picked up the
PATH change. Close and reopen the terminal. On Windows, make sure you opened a *new* window
after installing.

**`npm: command not found`** — same story, but if Node is definitely installed you can try
reinstalling it; some minimal Linux setups ship Node without npm.

**`EACCES` permission errors on Linux/macOS** — you used `sudo npm install`. Don't. Either use
nvm (which avoids the problem entirely) or fix npm's permissions following the
[npm docs](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally).

**Port 5173 is already in use** — either close whatever's on it or run
`npm run dev -- --port 3000` to use a different port.

**The page is blank** — open the browser console (F12). Usually it's a build error. Delete
`node_modules` and `package-lock.json`, then `npm install` again.

**Voice input does nothing** — speech recognition only works in Chromium-based browsers
(Chrome, Edge) and partly in Safari. Firefox doesn't support it; you can still type. Check
your mic permission too.

**No sound when it narrates** — check the browser tab isn't muted, your system volume is up,
and you've interacted with the page at least once. Some browsers block audio until you click
something. Also worth checking that your OS actually has a voice installed for the language
you picked — see [VOICE-AND-SPEECH.md](VOICE-AND-SPEECH.md).

## What next

- Wondering how it works under the hood? → [ARCHITECTURE.md](ARCHITECTURE.md)
- Want to add a new task? → [ADDING-A-TUTORIAL.md](ADDING-A-TUTORIAL.md)
- Confused about the voices? → [VOICE-AND-SPEECH.md](VOICE-AND-SPEECH.md)
