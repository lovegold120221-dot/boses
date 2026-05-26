# TODO — Beatrice / Eburon App Production Readiness

## 0. Immediate Security Fixes

- [ ] Rotate the exposed Gemini API key.
- [ ] Rotate any exposed Firebase / Google / WhatsApp keys found in `.env` or config files.
- [ ] Remove `.env` from all exported zips and public builds.
- [ ] Add `.env` to `.gitignore`.
- [ ] Move all sensitive API calls to the backend.
- [ ] Stop exposing Gemini API keys in the browser bundle.
- [ ] Restrict Firebase and Google API keys by domain, app, and allowed APIs.
- [ ] Audit all committed config files for secrets before redeployment.

---

## 1. Backend / Architecture

- [ ] Move Gemini Live connection behind a backend endpoint.
- [ ] Create `/api/live/session` or WebSocket endpoint for Gemini Live sessions.
- [ ] Make the frontend send only text/audio/control events to the backend.
- [ ] Let the backend own Gemini, Eburon Agent, Codex, and other CLI/API execution.
- [ ] Add proper backend authentication middleware.
- [ ] Add CORS restrictions.
- [ ] Add rate limiting.
- [ ] Add structured logging.
- [ ] Add backend error handling.
- [ ] Add request body size limits.
- [ ] Add environment variable validation.
- [ ] Add audit logging for sensitive actions.
- [ ] Add command timeout handling for CLI execution.
- [ ] Prevent raw user input from being passed directly into shell commands.
- [ ] Use argument arrays instead of shell interpolation for CLI commands.
- [ ] Add an allowed-command list for Eburon Agent / CLI execution.
- [ ] Stream CLI stdout/stderr safely back to the frontend.
- [ ] Build the VPS mission-control layer for Eburon Agent.
- [ ] Decide final runtime model:
  - [ ] Gemini Live only
  - [ ] Eburon CLI only
  - [ ] Hybrid Gemini Live + Eburon Agent backend

---

## 2. Gemini Live / AI Runtime

- [ ] Remove direct browser-side Gemini client initialization.
- [ ] Remove `GEMINI_API_KEY` from frontend code.
- [ ] Move `LiveAPIProvider` session creation to backend.
- [ ] Add backend-owned session lifecycle management.
- [ ] Add reconnection handling.
- [ ] Add proper voice session error states.
- [ ] Add permission-denied handling for microphone access.
- [ ] Add user-visible connection status.
- [ ] Add backend proxy for audio streaming.
- [ ] Add privacy controls for camera/screen sharing.
- [ ] Add bandwidth controls for screen/camera frame sending.
- [ ] Connect editable `systemPrompt` setting to the actual model `systemInstruction`.
- [ ] Add a safe runtime prompt composer:
  - [ ] base Beatrice system prompt
  - [ ] user preferences
  - [ ] connected tools
  - [ ] current session context
  - [ ] safety/tool rules

---

## 3. Google OAuth / Workspace

- [ ] Stop storing Google OAuth `accessToken` in Firestore.
- [ ] Keep short-lived access tokens in memory only on the client.
- [ ] Store refresh tokens only on the backend, encrypted.
- [ ] Scope Google OAuth permissions narrowly.
- [ ] Add user confirmation before destructive Google actions.
- [ ] Replace generic `fetch_google_api` with safer specific tools.
- [ ] Allowlist Google API domains only:
  - [ ] `https://www.googleapis.com/*`
  - [ ] `https://gmail.googleapis.com/*`
  - [ ] `https://www.googleapis.com/calendar/*`
  - [ ] approved Drive/Docs/Sheets endpoints
- [ ] Reject non-Google URLs in Google API tool calls.
- [ ] Split Google tools into explicit operations:
  - [ ] `list_calendar_events`
  - [ ] `create_calendar_event`
  - [ ] `draft_gmail`
  - [ ] `send_gmail`
  - [ ] `list_drive_files`
  - [ ] `read_google_doc`
  - [ ] `read_google_sheet`
  - [ ] `create_google_task`
- [ ] Require confirmation before:
  - [ ] sending Gmail
  - [ ] deleting files
  - [ ] sharing Drive files
  - [ ] changing calendar events
  - [ ] inviting external users

---

## 4. Firebase / Firestore

- [ ] Fix named Firestore database handling.
- [ ] Copy `firestoreDatabaseId` from `firebase-applet-config.json` into Firebase initialization.
- [ ] Use the named Firestore database instead of accidentally using the default database.
- [ ] Update backend Admin SDK to use the same Firestore database.
- [ ] Review Firestore rules.
- [ ] Confirm profile creation is allowed by rules.
- [ ] Confirm memory creation is allowed by rules.
- [ ] Remove access token fields from user documents.
- [ ] Create a safe user profile schema.
- [ ] Create a safe memory schema.
- [ ] Add created/updated timestamps consistently.
- [ ] Add server-owned fields where needed.
- [ ] Prevent users from writing privileged fields.
- [ ] Add emulator or staging rules testing.

---

## 5. Authentication

- [ ] Fix email/password signup flow.
- [ ] Add confirm password validation.
- [ ] Save display name during signup.
- [ ] Add proper auth error messages.
- [ ] Add loading states.
- [ ] Add logout confirmation if needed.
- [ ] Add session expiration handling.
- [ ] Add profile refresh after login.
- [ ] Ensure Google login does not store unsafe tokens in Firestore.

---

## 6. Conversation History

- [ ] Replace placeholder history overlay.
- [ ] Build real conversation persistence.
- [ ] Add conversation list endpoint.
- [ ] Add conversation detail endpoint.
- [ ] Add delete/archive conversation support.
- [ ] Add search conversation support.
- [ ] Add timestamps and titles.
- [ ] Store model/tool metadata if useful.
- [ ] Add frontend UI for recent conversations.
- [ ] Remove fake “No recent history” state when data exists.

---

## 7. Memory System

- [ ] Confirm memory writes work with Firestore rules.
- [ ] Create one consistent memory data model.
- [ ] Add memory list endpoint or client query.
- [ ] Add memory edit/delete.
- [ ] Add memory enable/disable toggle.
- [ ] Add clear memory UI.
- [ ] Add user confirmation for sensitive memory saves.
- [ ] Ensure Beatrice applies memory silently and safely.
- [ ] Do not store temporary or sensitive facts unless explicitly requested.

---

## 8. Tool System

- [ ] Render the real tool editor/sidebar instead of placeholder “All tools active.”
- [ ] Connect tool availability to actual backend capabilities.
- [ ] Add clear states:
  - [ ] Connected
  - [ ] Partially connected
  - [ ] Not connected
  - [ ] Needs backend
  - [ ] Requires login
  - [ ] Demo only
- [ ] Remove tools that have no handler.
- [ ] Add handlers for declared tools:
  - [ ] `extract_tasks`
  - [ ] `start_return`
  - [ ] `get_order_status`
  - [ ] `speak_to_representative`
  - [ ] `find_route`
  - [ ] `find_nearby_places`
  - [ ] `get_traffic_info`
- [ ] Add schema validation for all tool calls.
- [ ] Add confirmation rules for tools that send, delete, publish, or modify data.
- [ ] Log tool calls safely without secrets.

---

## 9. Google Drive / Docs / Sheets / Slides

- [ ] Finish Google Drive picker integration.
- [ ] Remove duplicated picker logic.
- [ ] Connect visible picker overlay to real Google Picker.
- [ ] Remove fake recent files from picker UI.
- [ ] Finish `list_drive_files`.
- [ ] Finish `read_google_doc`.
- [ ] Add save artifact to Drive.
- [ ] Replace fake `alert('Saved to Google Drive!')`.
- [ ] Add real Drive upload/create endpoint.
- [ ] Add Drive folder selection.
- [ ] Add share permissions UI.
- [ ] Add safe confirmation before external sharing.
- [ ] Add real Google Docs creation.
- [ ] Add real Google Sheets creation.
- [ ] Add real Google Slides deck creation.
- [ ] Replace prompt-only Slides behavior with Slides API tool.
- [ ] Add export/download formats:
  - [ ] PDF
  - [ ] DOCX
  - [ ] HTML
  - [ ] Markdown
  - [ ] PPTX where applicable

---

## 10. Gmail

- [ ] Build dedicated Gmail tools instead of relying on generic Google API fetch.
- [ ] Add inbox search.
- [ ] Add email read.
- [ ] Add draft email.
- [ ] Add send email with confirmation.
- [ ] Add reply-to-thread support.
- [ ] Add attachments support if needed.
- [ ] Add clear warning before sending externally.
- [ ] Add UI for Gmail action results.

---

## 11. Calendar

- [ ] Add calendar event search.
- [ ] Add calendar event read.
- [ ] Improve `create_calendar_event`.
- [ ] Add attendee handling.
- [ ] Add timezone handling.
- [ ] Add event update.
- [ ] Add event delete with confirmation.
- [ ] Add confirmation before inviting attendees.
- [ ] Add UI for created event links.

---

## 12. Tasks / Contacts

- [ ] Finish Google Tasks integration.
- [ ] Add due date handling.
- [ ] Add task list selection.
- [ ] Add complete task action.
- [ ] Add delete task action with confirmation.
- [ ] Finish Contacts integration.
- [ ] Add contact search UI.
- [ ] Add contact picker for email/calendar actions.
- [ ] Prevent accidental external sends.

---

## 13. WhatsApp

- [ ] Confirm Meta Cloud API environment variables are present.
- [ ] Keep WhatsApp access token backend-only.
- [ ] Finish `/api/whatsapp/send`.
- [ ] Add webhook verification endpoint.
- [ ] Add inbound message handler.
- [ ] Add message status callback handling.
- [ ] Add delivery/read status tracking.
- [ ] Add template message support.
- [ ] Add media message support if needed.
- [ ] Add retry/error handling.
- [ ] Replace fake QR connection UI.
- [ ] Clarify that Meta Cloud API does not use normal WhatsApp Web QR pairing.
- [ ] Add real onboarding/setup state for business phone number.
- [ ] Add conversation storage.
- [ ] Add UI for inbound/outbound WhatsApp messages.
- [ ] Require confirmation before sending WhatsApp messages.

---

## 14. Google Search / Web Search

- [ ] Fix mismatch where `google_search` is declared but filtered out.
- [ ] Decide whether search should be:
  - [ ] backend Google Custom Search
  - [ ] Gemini grounding/search
  - [ ] separate search provider
- [ ] Wire `/api/search` to the model/tool system.
- [ ] Add search result rendering.
- [ ] Add source citations/links.
- [ ] Remove `google_search` declaration if not implemented.

---

## 15. Scanner

- [ ] Fix scanner TypeScript issue around `tracker: true`.
- [ ] Confirm QR/barcode scanning works on mobile.
- [ ] Add camera permission error UI.
- [ ] Add product lookup backend.
- [ ] Add nutrition lookup if desired.
- [ ] Add nearby availability lookup if desired.
- [ ] Add scan history.
- [ ] Add manual barcode input fallback.

---

## 16. Location / Map

- [ ] Improve geolocation permission handling.
- [ ] Add clear location privacy notice.
- [ ] Add routing/directions service.
- [ ] Implement `find_route`.
- [ ] Implement `find_nearby_places`.
- [ ] Implement `get_traffic_info`.
- [ ] Add map search UI.
- [ ] Add fallback when geolocation is blocked.
- [ ] Add mobile-safe map overlay layout.

---

## 17. Artifact System

- [ ] Replace fake Save to Drive button.
- [ ] Replace fake Edit Artifact button.
- [ ] Replace fake Share Artifact button.
- [ ] Add real artifact persistence.
- [ ] Add artifact database schema.
- [ ] Add artifact edit mode.
- [ ] Add artifact version history.
- [ ] Add artifact share flow.
- [ ] Add Drive export.
- [ ] Add true `.docx` generation.
- [ ] Add PDF generation.
- [ ] Add artifact preview error states.
- [ ] Add download filename sanitization.
- [ ] Add document-type metadata:
  - [ ] proposal
  - [ ] invoice
  - [ ] contract
  - [ ] report
  - [ ] note
  - [ ] presentation
---

## 18. Data Model
  - [ ] users
  - [ ] conversations
  - [ ] messages
  - [ ] memories
  - [ ] artifacts
  - [ ] tool calls
  - [ ] WhatsApp conversations
- [ ] Add row-level security policies.
- [ ] Add backend-only service role handling.
- [ ] Do not expose service role keys to frontend.

---

## 19. TypeScript Fixes

- [ ] Fix `EburonApp.tsx:1107` scanner type mismatch.
- [ ] Fix `components/GooglePicker.tsx:15` by typing `window.gapi`.
- [ ] Fix `StreamingConsole.tsx` `GroundingChunk` type mismatch.
- [ ] Fix duplicate `FunctionResponseScheduling` import/identifier in `lib/state.ts`.
- [ ] Fix `server.ts:271` Express `PORT` type issue.
- [ ] Add `npm run typecheck`.
- [ ] Make CI fail on TypeScript errors.
- [ ] Remove or isolate unused demo TypeScript files.
- [ ] Use official `@google/genai` types where possible.
- [ ] Add global type declarations where needed.

---

## 20. Build / Lint / Dependencies

- [ ] Remove obsolete `.eslintignore`.
- [ ] Move ignore patterns into `eslint.config.js`.
- [ ] Run `npm audit fix` where safe.
- [ ] Review 8 low-severity npm audit issues.
- [ ] Add CI checks:
  - [ ] install
  - [ ] lint
  - [ ] typecheck
  - [ ] build
  - [ ] test
- [ ] Add bundle analysis.
- [ ] Reduce main JS bundle size.
- [ ] Lazy-load heavy overlays/tools.
- [ ] Lazy-load scanner/camera modules.
- [ ] Lazy-load Google Picker.
- [ ] Remove unused demo components.
- [ ] Remove unused dependencies.

---

## 21. CSS Audit Fixes

- [ ] Move inline styles out of `EburonApp.tsx`.
- [ ] Reduce the ~143 inline `style={{ ... }}` usages.
- [ ] Create reusable CSS classes or Tailwind component patterns.
- [ ] Define missing CSS variables:
  - [ ] `--surface-color`
  - [ ] `--text-color`
  - [ ] `--Neutral-10`
  - [ ] `--Neutral-15`
  - [ ] `--Blue-500`
  - [ ] `--accent-blue`
  - [ ] `--border-stroke`
  - [ ] `--gray-500`
- [ ] Replace old demo variables with Eburon theme tokens.
- [ ] Define missing classes used in JSX:
  - [ ] `.app-container`
  - [ ] `.ai-name`
  - [ ] `.icon-btn`
  - [ ] `.pill-btn`
  - [ ] `.form-control`
  - [ ] `.meet-overlay`
  - [ ] `.memory-list`
  - [ ] `.memory-item`
- [ ] Remove unused demo CSS:
  - [ ] `components/demo/popup/PopUp.css`
  - [ ] `components/demo/welcome-screen/WelcomeScreen.css`
- [ ] Remove unused demo UI if not part of active app.
- [ ] Fix global `user-select: none`.
- [ ] Allow users to copy chat output, code, errors, and artifacts.
- [ ] Add `:focus-visible` styles for accessibility.
- [ ] Fix WhatsApp overlay responsive layout.
- [ ] Add `.whatsapp-grid` responsive media query.
- [ ] Fix undefined `pulse` animation.
- [ ] Rename animation to `pulse-anim` or define `@keyframes pulse`.
- [ ] Create a dedicated Eburon design token file.
- [ ] Standardize colors, spacing, borders, and shadows.
- [ ] Add mobile-safe overlay layouts.
- [ ] Check z-index stacking for all overlays.
- [ ] Check scroll behavior on mobile.
- [ ] Check keyboard accessibility.

---

## 22. UI / Component Structure

- [ ] Split `EburonApp.tsx` into smaller components.
- [ ] Move header into `components/app/Header.tsx`.
- [ ] Move skills rail into `components/app/SkillsRail.tsx`.
- [ ] Move chat stream into `components/chat/ChatStream.tsx`.
- [ ] Move bottom dock into `components/chat/BottomDock.tsx`.
- [ ] Move profile overlay into `components/overlays/ProfileOverlay.tsx`.
- [ ] Move settings overlay into `components/overlays/SettingsOverlay.tsx`.
- [ ] Move WhatsApp overlay into `components/overlays/WhatsAppOverlay.tsx`.
- [ ] Move scanner overlay into `components/overlays/ScannerOverlay.tsx`.
- [ ] Move map overlay into `components/overlays/MapOverlay.tsx`.
- [ ] Move auth screen into `components/auth/AuthScreen.tsx`.
- [ ] Move Gemini config into `lib/live/config.ts`.
- [ ] Move tool handlers into `lib/live/tool-handlers.ts`.
- [ ] Move Google integration code into `lib/integrations/google.ts`.
- [ ] Move WhatsApp integration code into `lib/integrations/whatsapp.ts`.
- [ ] Add proper component prop types.
- [ ] Remove duplicated state logic.
- [ ] Reduce `EburonApp.tsx` from ~1,287 lines to manageable modules.

---

## 23. Frontend UX States

- [ ] Add real loading states.
- [ ] Add real error states.
- [ ] Add empty states that are truthful.
- [ ] Add “Not connected” badges for incomplete features.
- [ ] Add “Requires Google login” badges.
- [ ] Add “Needs backend” badges.
- [ ] Add “Demo only” badges.
- [ ] Add confirmation dialogs for external actions.
- [ ] Add toast notifications.
- [ ] Add mobile keyboard-safe layout.
- [ ] Add offline/server-unavailable state.
- [ ] Add reconnect button.
- [ ] Add better microphone permission instructions.
- [ ] Add better camera permission instructions.

---

## 24. Production Deployment

- [ ] Create production `.env.example`.
- [ ] Validate all required env vars on server startup.
- [ ] Configure VPS process manager.
- [ ] Add reverse proxy config.
- [ ] Add HTTPS.
- [ ] Add secure cookies/session config if needed.
- [ ] Add deployment documentation.
- [ ] Add staging environment.
- [ ] Add production logging.
- [ ] Add monitoring.
- [ ] Add backup strategy for database.
- [ ] Add rollback strategy.
- [ ] Add webhook public URL configuration.
- [ ] Add domain restrictions for OAuth redirect URIs.
- [ ] Add Firebase authorized domains.
- [ ] Add Google Cloud OAuth consent screen cleanup.

---

## 25. Final Production Readiness Checklist

- [ ] No secrets in frontend.
- [ ] No secrets in zip exports.
- [ ] Gemini API calls are backend-owned.
- [ ] Google tokens are not stored in Firestore.
- [ ] Firestore named database works.
- [ ] TypeScript passes.
- [ ] Build passes.
- [ ] Lint passes.
- [ ] Core voice flow works.
- [ ] Core text flow works.
- [ ] Eburon Agent backend is connected.
- [ ] Tool system reflects real capabilities.
- [ ] Placeholder buttons removed or labeled.
- [ ] WhatsApp webhook works.
- [ ] Google Drive save works.
- [ ] Gmail send requires confirmation.
- [ ] Calendar create requires confirmation.
- [ ] History persists.
- [ ] Memory persists safely.
- [ ] CSS variables are complete.
- [ ] Inline styles are reduced.
- [ ] Mobile layout is stable.
- [ ] Accessibility focus states exist.
- [ ] Copy/select text works.
- [ ] Bundle size is reviewed.
- [ ] App is deployed behind HTTPS.
- [ ] Logs and errors are monitored.

---

## Priority Order

### Priority 1 — Security / Architecture

- [ ] Rotate exposed keys.
- [ ] Remove `.env` from zips.
- [ ] Move Gemini/agent execution to backend.
- [ ] Add backend Live session endpoint.
- [ ] Stop storing Google access tokens in Firestore.
- [ ] Restrict generic Google API access.

### Priority 2 — Core Product

- [ ] Wire Eburon Agent CLI / VPS mission control.
- [ ] Connect conversation history.
- [ ] Connect memory cleanly.
- [ ] Fix Firestore named database.
- [ ] Connect Beatrice system prompt to actual model runtime.

### Priority 3 — Integrations

- [ ] Finish Google Drive picker/search/read.
- [ ] Wire Google Search or remove it.
- [ ] Finish WhatsApp webhook and inbound messages.
- [ ] Add real Drive save/share.
- [ ] Add dedicated Gmail/Calendar/Tasks/Docs/Sheets tools.
- [ ] Build real Knowledge/RAG pipeline.

### Priority 4 — CSS / UI Cleanup

- [ ] Move inline styles out of `EburonApp.tsx`.
- [ ] Define missing CSS variables/classes.
- [ ] Remove old demo CSS/components.
- [ ] Add responsive overlay layouts.
- [ ] Add focus states.
- [ ] Allow copyable chat/artifact text.
- [ ] Create Eburon design token system.