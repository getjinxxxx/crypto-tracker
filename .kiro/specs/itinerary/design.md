# Itinerary — Design

## Overview

`itinerary.html` is a single, standalone front-end page (HTML + CSS + vanilla JS) that drops
into the existing personal dashboard. It reuses the established building blocks from the other
pages: passcode lock, dark + gold theme, PWA manifest, manual update banner, and the
Firebase REST sync pattern (`stateJson` single-string write, realtime read, first-snapshot-wins,
flush-on-hide). No framework, no build step.

It is structured as three nested views driven by one in-memory state object:
`Trips list → Trip (day strip) → Day (item list)`.

```
home.html ──tile──▶ itinerary.html
                        │
                        ├─ Lock screen (passcode 031171)
                        └─ App
                            ├─ View A: Trips list (cards + "New trip")
                            ├─ View B: Trip detail (day navigator + budget summary)
                            └─ Modals: trip form, item form
```

## Architecture

### State shape (persisted)

Stored at localStorage key `itineraryV1` and mirrored to Firebase `itinerary/state` as a single
JSON string. One top-level object; items are stored flat with a `date` field (string `YYYY-MM-DD`)
so moving an item between days is just changing a string (no array surgery, no Date math).

```js
{
  version: 1,
  trips: [
    {
      id: "t_<rand>",
      name: "Japan 2026",
      destination: "Tokyo & Kyoto",
      start: "2026-04-01",      // YYYY-MM-DD string
      end:   "2026-04-07",      // inclusive
      budget: 120000,            // number or null
      currency: "PHP",           // label only
      items: [
        {
          id: "i_<rand>",
          date: "2026-04-01",    // must fall within [start,end]
          time: "09:30",         // "HH:MM" or "" (untimed)
          title: "Flight to Narita",
          location: "NAIA T1",
          category: "Flight",
          cost: 18000,           // number or 0
          note: "Seat 32A",
          done: false
        }
      ]
    }
  ],
  ui: { openTripId: null, openDate: null }  // last-opened view (best-effort restore)
}
```

Design choices and why:
- **Flat items keyed by `date` string** — generating the day list is a pure string loop over the
  date range; an item belongs to a day if `item.date === day`. Moving an item = set `item.date`.
  This matches the app's "timezone-safe pure-string month/date math" rule (no `Date` drift).
- **Single JSON string to Firebase** — reuses the v101 fix: no nested keys means no HTTP 400 on
  forbidden characters, and REST PUT (v100 fix) never hangs like the SDK WebSocket write could.
- **`version` field** — lets a future migration run safely.

### Date utilities (timezone-safe, string-based)

```
addDays("2026-04-01", 1) -> "2026-04-02"   // parse ints, build a UTC date, read back as YYYY-MM-DD
datesInRange(start, end) -> ["2026-04-01", ... , end]   // inclusive
weekdayLabel("2026-04-01") -> "Wed, Apr 1, 2026"
```
All math is done by splitting the string into `[y,m,d]` ints and using `Date.UTC`, then reading
back the ISO date portion. Never parse a bare date string with `new Date("YYYY-MM-DD")` for
display math (that's the drift trap the app already avoids).

## Components and Interfaces

### Views

**View A — Trips list**
- Header (greeting optional, page title "Itinerary", gold gradient like `home.html`).
- `+ New trip` button → opens trip form modal.
- One card per trip: name, destination, date range, day count, planned total vs budget mini-bar.
- Tap a card → View B. Each card has edit (pencil) and delete (trash) actions.
- Empty state when `trips` is empty.

**View B — Trip detail**
- Back to trips.
- Trip title + destination + date range; edit/delete trip buttons.
- **Day navigator**: prev/next day arrows + a day picker (`<select>` of the trip's dates).
  A horizontal day strip shows each date with its item count + day total; current day highlighted.
- **Budget summary panel**: trip total, remaining (if budget set) with progress bar (red if over),
  per-category breakdown (compact list or small doughnut — list is enough for v1).
- **Day item list**: items for `openDate`, sorted by time (timed first, chronological; untimed last).
  Each item row: time chip, category chip, title, location, cost (trip currency), note (muted),
  done checkbox (strike-through when done), edit + delete + "move to day".
- `+ Add activity` button → opens item form modal, pre-filled with `openDate`.

### Modals

**Trip form** — fields: name, destination, start date, end date, budget (optional), currency
(select: PHP, USD, JPY, EUR, Other). Validates end ≥ start. Save/Cancel.

**Item form** — fields: day (select of trip dates, default `openDate`), time (optional `type=time`),
title (required), location, category (select of the fixed list), cost (optional number), note.
Save/Cancel. Same modal handles add and edit.

### Shared systems (copied from existing pages, not reinvented)

- **Lock**: same `simpleHash` + `PASS_HASH = simpleHash("031171")`, `sessionStorage ctUnlocked`,
  `revealApp()` pattern as `home.html`.
- **Theme**: identical `:root` CSS variables and base typography block as `home.html`.
- **PWA**: `<link rel="manifest" href="manifest.json">` + apple-mobile meta tags.
- **Update banner**: same `APP_VERSION` + `checkForUpdate()` + `showUpdateBanner()` (manual, no
  auto-reload), polling `version.json?ts=` every 60s.

### Cloud sync module (mirrors the other trackers)

```
FIREBASE_BASE = "https://crypto-tracker-bfefb-default-rtdb.asia-southeast1.firebasedatabase.app"
PATH          = "itinerary/state"
```
- `saveState()` — write localStorage immediately; debounce + REST `PUT` `{ stateJson: JSON.stringify(state) }`
  to `${FIREBASE_BASE}/${PATH}.json`. Wrapped in try/finally so a render error can't block the next write.
- `subscribeCloud()` — realtime listener (or REST GET poll fallback) on load; **first snapshot wins**:
  if cloud has data, adopt it as source of truth before enabling local→cloud writes.
- `flushOnHide()` — `visibilitychange`/`pagehide` forces any pending write.

> The exact Firebase base URL and listener approach must be copied from an existing page
> (`debt.html` / `receivables.html`) at implementation time so the config matches the live DB.

## Data Models

| Entity | Key fields | Notes |
|--------|-----------|-------|
| Trip | id, name, destination, start, end, budget, currency, items[] | dates are `YYYY-MM-DD` strings |
| Item | id, date, time, title, location, category, cost, note, done | `date` ties it to a day |
| UI | openTripId, openDate | best-effort view restore |

Derived (never stored):
- `datesInRange(start,end)` → the day list.
- `dayTotal(date)` = sum of `cost` for items on that date.
- `tripTotal` = sum of all item costs.
- `categoryTotals` = cost grouped by category.
- `remaining` = `budget - tripTotal` (only if budget set).

## Error Handling

- **Invalid date range** (end < start): block save, inline error in the trip form.
- **Item outside range after a trip date edit**: on trip edit, any item whose `date` falls outside
  the new `[start,end]` is clamped to the nearest end (start if before, end if after) rather than
  silently lost; a small note tells the user some items were moved.
- **Cloud failure**: swallow network errors, keep running from localStorage, never freeze the UI
  (try/finally around writes; the realtime listener errors are logged, not thrown).
- **Empty/missing cloud node**: treated as "no cloud data yet" → local state is written up.

## Testing Strategy

No automated tests are added (per project norm — pages are hand-verified). Manual smoke checks:
1. `node --check` is N/A for HTML; instead run the local server (`node server.js`) and open the page.
2. Create a trip, confirm day list matches the date range exactly (inclusive, correct weekdays).
3. Add timed + untimed items; confirm sort order and per-day/trip/category totals.
4. Set a budget below total; confirm over-budget flag and progress bar turn red.
5. Edit trip dates shorter; confirm out-of-range items are clamped, not lost.
6. Reload and confirm state restores from localStorage; open on a second device/profile and
   confirm cloud sync (first-snapshot-wins) brings the same data.
7. Lock screen gates the page; unlock persists for the session.
8. Publish bump: `version.json` + `APP_VERSION` raised; update banner appears on the old build.
