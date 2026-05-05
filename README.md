# NovaCalc

Minimal desktop calculator with a modern UI.

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

Build artifacts:

- `dist/` — web build
- `release/` — desktop build
