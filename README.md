# LOST DNA · SRM KTR

> **Every lost item has a story. Let's help it find its way home.**

LOST DNA is a campus lost‑and‑found recovery platform built around **SRM Kattankulathur (SRM KTR)**. Instead of a flat list of lost objects, it runs a complete recovery workflow:

**Memory → Last‑Seen Journey → Item DNA → Potential match → Private ownership verification → Admin review → Handover → Reunited**

> ⚠️ Independent student prototype. Not an official SRM service and not endorsed by SRM IST. All demo data is fictional. The campus image is the team‑supplied reference map; positions are approximate local coordinates, **not GPS**.

---

## Features

| Area | What it does |
|---|---|
| **Lost report (7‑step wizard)** | Photo (upload or camera) → item details → date/time (optional range) → **Last‑Seen Journey** on the campus map → **private verification detail** → review → submit → **Item DNA created** |
| **Last‑Seen Journey** | Tap campus places (or pick from an accessible list), set times/notes, reorder. The lost item's own icon travels the route along roads traced from the map, pausing at each stop with a memory card, ending with a pulsing **LAST SEEN**. Replayable any time. Honest labelling: a reconstruction of memory, not tracking. |
| **Item DNA** | Structured fingerprint card (category, brand, colour, keywords, route, time window, `LD‑xxxxx` ID) with a deterministic "DNA strip" |
| **Found report** | One fast screen: photo, category, tap location, time, short description; optional brand/colour, custody, and a **private finder note** |
| **Explainable matching engine** | Deterministic weighted similarity (category 25, description 20, brand 15, location 15, colour 10, time 10, date 5). Missing fields are dropped and weights re‑normalised; clear conflicts apply visible penalties. Location = walking‑route distance on the campus road graph to the nearest journey stop. Every point is explained on screen. |
| **Match detail** | Your report vs. found report side by side, attribute table, contribution bars, journey + found location map, **This may be mine** / **Not mine** |
| **Private verification** | Server‑side comparison of the claimant's answer with (a) the detail recorded when filing and (b) the finder's private note. Normalises case/spacing/punctuation, strict against one‑word guesses, 3 attempts. Only a verdict is returned — never the stored text. A match is *evidence*, not approval. |
| **Claim lifecycle** | `CLAIM_REQUESTED → VERIFICATION_PENDING → ADMIN_REVIEW (↔ INFO_REQUESTED) → APPROVED → READY_FOR_HANDOVER → HANDED_OVER → REUNITED`, plus `REJECTED` / `CLOSED`. All transitions validated on the server and logged as a timeline. |
| **Admin** | KPIs, claims queue, potential matches, recent reports, items needing attention, reunions, analytics; full review page (evidence checks, reveal private references, approve / reject / request info / ready / handover with pickup code / reunite / close); custody management; **Match Lab** to inspect any pair (including non‑matches); re‑run engine; reset demo data |
| **Handover** | One‑time 6‑char pickup code shown only to the claimant; admin must enter it (or log a manual ID check) |
| **Reunion** | Item → ♥ → owner animation, journey summary and replay; anonymous **Reunion Wall** |
| **Explore campus** | Interactive map with per‑place lost/found/reunited badges and the active reports at each place |
| **Search & filter** | Keyword (name/description/brand/ID), lost/found, category, place, status, brand, date range, sort — all server‑side and URL‑synced |
| **Notifications** | Real in‑app notifications (match found, claim submitted, under review, info requested, approved, ready for handover, handed over, reunited) |
| **Look & feel** | Original mascot **Taggy** (a little luggage tag, hand-drawn SVG) with moods for empty states, errors, 404, sign-in and celebrations; Bricolage Grotesque + Plus Jakarta Sans; tactile "sticker" buttons; full **dark mode** (Light / Dark / Match device, remembered per device, no flash on load) |
| **Real-app extras** | Settings (edit name, change password with strength meter, appearance, download-my-data JSON export), Help center with searchable FAQ, Privacy & Terms pages, global header search with `/` shortcut, share buttons (native share sheet or copy link), photo lightbox, offline banner, grouped notifications (Today / Yesterday / Earlier), per-page browser titles, install-app prompt, password show/hide |
| **Thank the finder** | After a reunion the owner can send one anonymous thank-you note (emoji + message). The finder gets a notification and sees it as a letter on their found report; the Reunion Wall shows only a "💌 Finder thanked" badge, never the text or names |
| **Mobile / PWA** | Dedicated mobile layout with bottom nav (Home · Explore · **Report** · Matches · Profile), manifest, icons, service worker (production) |

## Architecture

```
lost-dna/
├── shared/            # used by BOTH server and client
│   ├── campus.ts      # 23 places read from the supplied map + road graph (image-pixel coordinates)
│   ├── routing.ts     # Dijkstra routes along the traced roads
│   ├── matching.ts    # the potential-match engine + verification comparison
│   └── constants.ts
├── server/            # Express 5 + SQLite (better-sqlite3, auto-fallback to built-in node:sqlite) · TypeScript via tsx
│   ├── db.ts          # schema (10 tables, FKs, CHECK-constrained statuses)
│   ├── lib/           # auth, AES-GCM crypto, claim state machine, matching service, uploads, serializers
│   ├── routes/        # auth, lost, found, reports (search/stats/reunions), matches, claims, admin, notifications
│   ├── seed.ts        # fictional demo data driven through the real state machine
│   └── tests/         # engine unit tests + full API workflow test
├── src/               # React 19 + React Router 7 + TanStack Query, plain CSS design system
│   ├── components/    # map (Leaflet CRS.Simple), journey player, DNA card, timeline, UI kit
│   └── pages/         # public, student, admin pages (lazy-loaded)
└── public/            # campus-map.webp, manifest, icons, service worker
```

**Database tables:** `users`, `lost_reports`, `journey_stops`, `found_reports`, `potential_matches`, `claims`, `claim_events`, `verifications`, `handovers`, `notifications`, `reunions`.

**Map:** the supplied SRM KTR image is a Leaflet image overlay in a local pixel coordinate system (`CRS.Simple`). No tiles, no API key — works fully offline.

### Key decisions (and spec issues resolved)
- **SQLite without Prisma** — Prisma downloads engine binaries at install time, which is fragile on hackathon Wi‑Fi. The app uses `better-sqlite3` (optional dependency) and automatically falls back to Node's built‑in `node:sqlite` if the native module can't be installed. The startup log shows which driver is active. The schema is still properly relational.
- **Verification against a second source.** Comparing a claimant's answer only with the detail *they themselves* recorded proves little. Finders can add a private note about the physical item; evidence is strongest when the answer (or the owner's earlier record) matches that note. Admin also checks the physical item before handover.
- **Journeys are private.** Public listings only reveal the last‑seen place; the timed journey is visible to the owner and the desk.
- **Handover pickup code** so an item can't be released to the wrong person by mistake.
- **"Campus Lost & Found Desk"** is a *designated handover point for this prototype*, placed near the Admin Block on the map — not a claim about an existing SRM office.
- **No image AI.** Photos are supporting evidence shown side by side; the score never pretends to use them.

## Run it

Requirements: **Node.js 22 LTS recommended** (Node 20 works when `better-sqlite3` installs its prebuilt binary).

```bash
npm install
npm run dev          # creates .env with random secrets on first run, seeds demo data, starts API :4000 + web :5173
```
Open **http://localhost:5173**.

Production:
```bash
npm run build        # type-checks and builds the client to dist/
npm start            # serves API + built app on http://localhost:4000 (CSP + service worker enabled)
```

Other scripts:
```bash
npm run setup        # create .env only
npm run reset-demo   # wipe everything and reload the demo data (also available in Admin → Reset demo data)
npm run seed         # load demo data only if the DB is empty
npm test             # engine unit tests + full end-to-end API workflow on a temporary DB
npm run typecheck
```

### Environment variables (`.env`, see `.env.example`)
| Var | Purpose |
|---|---|
| `PORT` | API port (default 4000) |
| `JWT_SECRET` | signs session cookies (random, generated by `npm run setup`) |
| `DATA_ENCRYPTION_KEY` | AES‑256‑GCM key for private details (changing it makes existing ones unreadable → reset demo) |
| `DATABASE_PATH`, `UPLOAD_DIR` | default `data/lostdna.db`, `data/uploads` |
| `DEMO_MODE` | `true` = auto‑seed empty DB + allow in‑app reset |
| `DEMO_PASSWORD` | password for all demo accounts |
| `COOKIE_SECURE` | `true` behind HTTPS |

## Deploy online

See **[DEPLOY.md](DEPLOY.md)**: free Render deploy with the included `render.yaml` (about 10 minutes), optional Netlify front end (`netlify.toml`, which proxies `/api` to Render), or the `Dockerfile` for other hosts.

## Demo accounts (fictional, local only)

Password for all: **`LostDNA@demo1`**

| Role | Email |
|---|---|
| Admin (Lost & Found desk) | `admin@lostdna.local` |
| Student — main demo user | `student@lostdna.local` |
| Finder | `finder@lostdna.local` |
| Other students | `arjun@lostdna.local`, `sneha@lostdna.local`, `rahul@lostdna.local` |

Seeded scenarios: JBL earbuds **found** at Auditorium Ground yesterday 5:35 PM (waiting for the live demo) · a **medium** bottle match (62%) · a **non‑match** wallet (inspect in Match Lab vs. the red umbrella) · a charger claim waiting in **admin review** · an ID card **ready for handover** · three past **reunions**.

## 2–3 minute demo script

1. **Home** (10 s) — brand, tagline, two big actions. Sign in as `student@lostdna.local`.
2. **I lost something** (60 s) — add a photo → *JBL Earbuds*, Electronics, JBL, Black, "Black JBL Wave wireless earbuds in a charging case" → **Yesterday**, 4:10 PM, range to 5:20 PM → journey: tap **SRM Tech Park 4:10**, **Canteen‑2 4:35**, **Auditorium Ground 5:00** → *Preview animated journey* → private detail `moon sticker on the back of the case` → Submit → **Item DNA created** ("1 potential match found already").
3. **Potential match** (30 s) — ~**96%**; walk the breakdown (same category/brand/colour, found at a journey stop, 15 min after last seen). Point out "item similarity, not ownership".
4. **This may be mine** (20 s) — answer wrongly once ("scratch on the left bud" → no match, 2 attempts left), then "There is a moon sticker on the back of the charging case" → **Verification evidence matches** → waiting for admin.
5. **Admin** (40 s) — second browser/incognito as `admin@lostdna.local` → dashboard → claim → evidence checks, *Reveal* references → **Approve** → **Mark ready for handover**. Student refreshes → sees pickup code. Admin → **Mark handed over** (enter code) → **Mark reunited**.
6. **Reunion** (15 s) — student opens the notification → item → ♥ → owner, journey replay. Finish on the Reunion Wall / Explore map.

Backup path if short on time: log in as admin and open the seeded charger claim (already in review) or Match Lab.

## What was tested

- `npm test`: 11 automated tests (incl. profile edit, password change, data export, thank-the-finder rules) — engine (high 96 / medium 62 / non‑match < 40 / brand‑conflict penalty / determinism / verification strictness / routing) and a **full API workflow**: upload, journey, match ≥ 90, cross‑user 403, wrong + right verification, admin‑only routes (403/401), CSRF header, invalid state jumps (409), wrong pickup code (400), handover, reunion, notifications, and **no private detail in any public response**.
- Verified from a clean unzip: `npm install` → `npm test` → `npm run dev` → full UI flow, with the native module unavailable (fallback driver).
- Playwright (Chromium) end‑to‑end (`tests/e2e/ui_flow.py`) through the real UI, desktop 1366/1440 px and mobile 390 px: every step of the demo above, form validation, map clicks, journey animation reaching LAST SEEN, explore marker selection, browse filters + empty state, 404 page, mobile found flow, no horizontal overflow, admin on mobile. No console errors except the deliberate wrong‑code 400.
- Production build served with CSP: no console errors, map renders, service worker registers.

## Known limitations

- Map positions and roads are hand‑traced from a screenshot: approximate, not survey‑accurate. For a real deployment use a licensed/official campus map (the supplied image is a Google Maps screenshot).
- Description similarity is keyword/synonym based, not semantic AI; photos are not compared automatically.
- Notifications are in‑app (polled every 15 s); no email/push.
- Accounts accept any email; a pilot would restrict sign‑up to campus SSO/email and add email verification + password reset.
- Single‑instance SQLite and local disk uploads — fine for a pilot, not for multi‑server hosting.
- The handover desk location and turnaround time are prototype placeholders.

## Troubleshooting

- **`better-sqlite3` fails to install** — that's fine on Node 22.13+: it's optional and the app falls back to built‑in `node:sqlite` (you'll see `db: node:sqlite` in the log and a harmless ExperimentalWarning). On Node 20 you need the native module.
- **Port in use** — change `PORT` in `.env` (Vite proxies to it automatically).
- **"Missing JWT_SECRET"** in production — run `npm run setup`.
- **Weird data / want a clean demo** — `npm run reset-demo` (or Admin → Reset demo data), then sign in again.
- **Lost date can't be today at 4 PM** — future times are rejected; use *Yesterday* for the scripted demo.
