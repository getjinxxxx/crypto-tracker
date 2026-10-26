# Itinerary — Implementation Plan

- [ ] 1. Scaffold `itinerary.html` with shared shell
  - Copy the head/meta/manifest/apple-mobile tags and the `:root` theme variables + base typography from `home.html`.
  - Add the passcode lock screen markup and the `simpleHash` / `PASS_HASH` / `ctUnlocked` / `revealApp()` script (same as `home.html`).
  - Add the `APP_VERSION` constant + `checkForUpdate()` / `showUpdateBanner()` manual update logic (no auto-reload), polling `version.json`.
  - Add `<link rel="manifest" href="manifest.json">`.
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 2. State model + persistence foundation
  - [ ] 2.1 Define the in-memory `state` object (`version`, `trips[]`, `ui`) and `localStorage` load/save under key `itineraryV1`.
    - _Requirements: 6.1_
  - [ ] 2.2 Port the Firebase REST sync from `debt.html`/`receivables.html`: `FIREBASE_BASE`, `PATH = "itinerary/state"`, `saveState()` (single `stateJson` string via REST PUT, debounced, try/finally), `subscribeCloud()` (first-snapshot-wins), and `flushOnHide()`.
    - _Requirements: 6.2, 6.3, 6.4, 6.5_
  - [ ] 2.3 Add timezone-safe date utils: `addDays`, `datesInRange(start,end)` (inclusive), `weekdayLabel`, all pure string/`Date.UTC` based.
    - _Requirements: 2.1_

- [ ] 3. View A — Trips list
  - [ ] 3.1 Render the trips list: one card per trip (name, destination, date range, day count, planned-total-vs-budget mini bar) + empty state.
    - _Requirements: 1.1_
  - [ ] 3.2 Build the trip form modal (add + edit): name, destination, start, end, budget (optional), currency select; validate end ≥ start with inline error.
    - _Requirements: 1.2, 1.3, 1.5_
  - [ ] 3.3 Wire create/edit/delete trip (delete asks for confirmation and removes the trip + its items). On edit, clamp out-of-range items to nearest in-range date.
    - _Requirements: 1.5, 1.6_

- [ ] 4. View B — Trip detail + day navigator
  - [ ] 4.1 Open a trip (`ui.openTripId`), render title/destination/date range, back button, edit/delete trip actions.
    - _Requirements: 1.4_
  - [ ] 4.2 Build the day navigator: prev/next arrows, day picker `<select>`, and a day strip showing each date with its item count + day total; highlight `openDate`.
    - _Requirements: 2.2, 2.3, 2.4_

- [ ] 5. Activities (items)
  - [ ] 5.1 Render the item list for `openDate`, sorted by time (timed chronological first, untimed last); each row shows time/category chips, title, location, cost, note, done checkbox.
    - _Requirements: 3.2, 3.6_
  - [ ] 5.2 Build the item form modal (add + edit): day select (default `openDate`), time (optional), title (required), location, category (fixed list), cost (optional), note.
    - _Requirements: 3.1, 3.3, 3.7_
  - [ ] 5.3 Wire add/edit/delete item, toggle done, and "move to day" (re-assign `item.date`).
    - _Requirements: 3.3, 3.4, 3.5, 3.6_

- [ ] 6. Budget & cost summary
  - Render the summary panel: trip total, per-day total (in the day strip), per-category breakdown; remaining budget + progress bar when a budget is set; red over-budget flag; format with the trip currency.
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 7. Home dashboard integration
  - Add an "Itinerary" tile to `home.html` linking to `itinerary.html` (icon + short description, matching the existing tile markup/classes).
  - _Requirements: 7.1_

- [ ] 8. Export / print (nice-to-have)
  - [ ] 8.1 Add "Copy as text" producing a plain-text itinerary grouped by day (time, title, location, cost).
    - _Requirements: 8.1_
  - [ ] 8.2 Add print-friendly CSS (`@media print`) hiding the lock screen, controls, and banners.
    - _Requirements: 8.2_

- [ ] 9. Version bump + verify
  - Bump `version.json` and raise `APP_VERSION` in `itinerary.html` and `home.html` (and any page showing the shared banner) per the update convention.
  - Smoke test via `node server.js`: trip create → day list correctness, item sort/totals, over-budget flag, date-shorten clamping, reload persistence, lock gate.
  - _Requirements: 7.2, and manual verification of 1–6_
