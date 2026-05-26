# AGENTS.md — Eburon AI Companion ("Boses")

## Stack
React 19 + TypeScript + Vite 6 + Tailwind CSS 4 + Express 5 + Firebase (Auth + Firestore) + Google Gemini Live API + Zustand + Motion + esbuild

## Quick start
```bash
npm install
cp .env.example .env.local   # then set GEMINI_API_KEY (required)
npm run dev                   # Express + Vite HMR at http://localhost:3000
```
- **Dev server**: `npm run dev` — runs `tsx server.ts` (Express with Vite middleware).
- **Build**: `npm run build` — `vite build` (client) + `esbuild server.ts --bundle --platform=node` (server) → `dist/`.
- **Production**: `npm run start` → `node dist/server.cjs`.
- **Lint**: `npm run lint` — ESLint (includes `firestore.rules` lint via `@firebase/eslint-plugin-security-rules`).
- No test framework exists. No CI or pre-commit hooks.

## Architecture
- **Entrypoints**: `index.tsx` (React root), `server.ts` (Express server), `App.tsx` (wraps with `LiveAPIProvider`)
- **State**: 4 zustand stores — `useSettings`, `useUI`, `useTools`, `useLogStore` (all in `lib/state.ts`)
- **Real-time AI**: `GenAILiveClient` (`lib/genai-live-client.ts`) wraps `@google/genai` SDK for bidirectional audio/video/text streaming with Gemini Live API
- **Audio**: AudioWorklet-based capture (`lib/audio-recorder.ts`) + playback (`lib/audio-streamer.ts`). PCM16 16kHz.
- **Google integration**: Firebase Auth with OAuth scopes for Calendar, Drive, Gmail, Tasks, Docs, Sheets, Slides, Forms, Contacts, Chat, Keep, Meet. APIs called directly via REST with `fetch` + Bearer token.
- **Tools/Personas**: Function declarations defined in `lib/state.ts` (`workspaceTools`) + `lib/tools/*.ts`. 3 persona templates: `personal-assistant` (default), `customer-support`, `navigation-system`.
- **Firestore structure**: `/users/{userId}` (profile, settings, memories), `/users/{userId}/history/{turnId}`, `/users/{userId}/notes/{noteId}`, `/users/{userId}/whatsapp_messages/{messageId}`. Schema governed by `firestore.rules` + `firebase-blueprint.json`.
- **Import alias**: `@/` → project root (configured in both `tsconfig.json` paths and `vite.config.ts` resolve alias).

## Critical quirks
- **Gemini API key** must be set in `.env.local` as `GEMINI_API_KEY`. Also injected via Vite as `process.env.GEMINI_API_KEY` and `process.env.API_KEY`.
- **Firebase config** falls back to `firebase-applet-config.json` when `VITE_FIREBASE_*` env vars are not set. The project ID is `gen-lang-client-0836251512`.
- **Default Live API model**: `gemini-3.1-flash-live-preview` (in `lib/constants.ts`). Available voices listed there too.
- **Firestore is initialized with `experimentalForceLongPolling: true`** (required for some environments). The `firestoreDatabaseId` from config is critical.
- **Tailwind v4**: uses `@tailwindcss/vite` plugin (no `tailwind.config.js` — v4 uses CSS-based config).
- **No router** — SPA with overlay panels managed by `useUI.activeOverlay`.
- **No typecheck script** — but TypeScript runs via Vite/esbuild. `tsc --noEmit` would be the command.
- **`npm run build` produces two outputs**: `dist/assets/` (client) + `dist/server.cjs` (server bundle).
- **`npm run preview` serves only the client** (Vite preview, no Express server).
