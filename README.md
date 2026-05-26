# Boses — Eburon AI Companion

Real-time conversational AI companion powered by Google Gemini Live API, with Firebase Auth + Firestore for persistence and a web UI wrapped in a native-feeling mobile-frame interface.

## Stack

**Frontend:** React 19, TypeScript, Vite 6, Tailwind CSS 4, Motion, Lucide  
**Backend:** Express 5, esbuild, tsx  
**AI:** Google Gemini Live API (`@google/genai`) — bidirectional audio/video/text streaming  
**Database:** Firebase Auth + Firestore (non-default database)  
**State:** Zustand (4 stores — settings, UI, tools, log)  
**Infra:** Docker (multi-stage), docker-compose

## Quick Start

```bash
cp .env.example .env.local   # fill in your keys
npm install
npm run dev                   # → http://localhost:3000
```

## Required Environment Variables

```
GEMINI_API_KEY                # Google Gemini API key
VITE_FIREBASE_API_KEY         # Firebase Web App credentials (all VITE_FIREBASE_* vars)
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_DATABASE_URL
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
VITE_FIREBASE_FIRESTORE_DATABASE_ID
```

See `.env.example` for the full list including WhatsApp, Google OAuth, and Cartesia voice.

## Architecture

```
client (Vite SPA)          server (Express)
┌──────────────────┐       ┌───────────────────────┐
│  index.tsx        │       │  server.ts             │
│  App.tsx          │       │  ├── Vite middleware   │
│  EburonApp.tsx    │       │  ├── REST API (/api/*) │
│  ├── SkillsRail   │       │  ├── Static files      │
│  ├── Overlays     │       │  └── WS /api/live      │
│  ├── Chat         │       │       └── Gemini Live   │
│  └── Controls     │       │           proxy         │
└──────┬───────────┘       └──────┬────────────────┘
       │ HTTP / WS                │
       └──────────────────────────┘
              port 3000
```

### Key Design Decisions

- **Gemini API key stays server-side** — the client connects to `ws://host/api/live` and the Express server creates Gemini Live sessions server-side using `@google/genai`. The key is never in the client bundle.
- **Proxy Live Client** — `lib/genai-live-proxy.ts` is the client-side WebSocket wrapper that replaces the direct `GenAILiveClient`. Same typed events (`audio`, `content`, `toolcall`, etc.).
- **No router** — SPA with full-page overlays driven by `useUI.activeOverlay` Zustand state.
- **Overlay components** — 15 extracted panels: Profile, Settings, History, WhatsApp, Scanner, Picker, Tools, Meet, Auth, etc.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Express + Vite HMR at `localhost:3000` |
| `npm run build` | Vite build (client) + esbuild (server) → `dist/` |
| `npm run start` | `node dist/server.cjs` (production) |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

## Docker

```bash
docker compose up --build   # builds + runs on port 3000
```

Multi-stage Dockerfile: `node:22-alpine` build stage → runtime stage (non-root `app` user, only `dist/` + `package.json`).

## API Endpoints

| Path | Auth | Description |
|---|---|---|
| `GET /api/health` | — | Health check |
| `GET /api/config` | — | Runtime config (Gemini key status) |
| `GET /api/settings` | Firebase token | Read user settings from Firestore |
| `PUT /api/settings` | Firebase token | Write user settings to Firestore |
| `GET /api/memories` | Firebase token | Read user memories |
| `POST /api/memories` | Firebase token | Add a memory |
| `DELETE /api/memories/:id` | Firebase token | Delete a memory |
| `GET /api/search` | — | Google Custom Search proxy |
| `GET /api/whatsapp/connect` | — | WhatsApp Cloud API status |
| `POST /api/whatsapp/send` | Firebase token | Send WhatsApp message |
| `WS /api/live` | — | Gemini Live bidirectional proxy |

## Firebase Data Model

```
/users/{userId}
  ├── email, displayName, photoURL
  ├── settings: { personaName, userCallName, systemPrompt, voice, language, tools }
  ├── memories: [{ id, content, type, timestamp }]
  ├── history/{turnId}
  │     └── { role, text, isFinal, timestamp }
  ├── notes/{noteId}
  │     └── { title, content, ... }
  └── whatsapp_messages/{messageId}
        └── { phone, text, direction, status, ... }
```

## State Stores (Zustand)

| Store | Purpose |
|---|---|
| `useSettings` | Persona name, voice, language, system prompt |
| `useUI` | Active overlay, sidebar, workspace results |
| `useTools` | Dynamic function declarations (enable/disable/edit) |
| `useLogStore` | Conversation turn log |

## Persona Templates

- `personal-assistant` (default) — warm, professional, proactive
- `customer-support` — helpful, solution-oriented
- `navigation-system` — concise, directional
