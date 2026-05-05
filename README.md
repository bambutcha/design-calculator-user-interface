# NovaCalc

Minimal desktop calculator with a modern UI.

[![Release Build](https://github.com/bambutcha/design-calculator-user-interface/actions/workflows/release.yml/badge.svg)](https://github.com/bambutcha/design-calculator-user-interface/actions/workflows/release.yml)
![Version](https://img.shields.io/badge/version-0.1.2-7c7de6)
![Platform](https://img.shields.io/badge/platform-Linux%20%7C%20Windows-1f2937)

## Stack

- React + Vite + TypeScript
- Tailwind CSS
- Framer Motion
- Electron

## Features

- Clean, responsive calculator interface
- Calculator-style percent mode
- History panel with restore
- Light/Dark theme toggle
- Desktop packaging for Linux/Windows

## Development

```bash
npm install
npm run dev
```

## Run As Desktop App

```bash
npm run desktop:dev
```

## Production Build

```bash
npm run build
npm run desktop:build
```

## Tests

```bash
npm test
```

## CI Releases

- On each `v*` tag push, GitHub Actions builds:
  - Linux: `AppImage`
  - Windows: `NSIS` installer
- Artifacts are uploaded in the workflow run.
- The workflow also publishes binaries to **GitHub Releases** automatically.

Tag example:

```bash
git tag v0.1.2
git push origin v0.1.2
```

Build artifacts:

- `dist/` — web build
- `release/` — desktop build

## Documentation

- `docs/architecture.md`
- `docs/user-guide.md`
- `docs/settings.md`
- `docs/criteria-evaluation.md`
