# Sangoku Solo Card Game

A single-player Three Kingdoms inspired card battler built with Next.js, TypeScript, Tailwind CSS, and Vitest.

## Getting Started

Install dependencies:

```sh
npm install
```

Run the development server:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

- `/` - title screen and rules summary
- `/game` - playable solo card battle
- `/result` - static result screen

## Scripts

- `npm run dev` - start local development
- `npm run lint` - run ESLint
- `npm test` - run Vitest tests

## Game Model

Each run starts with Liu Bei facing a sequence of enemy generals. Cards can attack, guard, heal, draw, or rally morale. The pure game engine in `lib/game/engine.ts` owns all rule changes so the UI stays thin.
