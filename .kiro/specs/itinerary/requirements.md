# Itinerary — Requirements

## Introduction

A new tool for the existing personal dashboard app: an **Itinerary planner** (`itinerary.html`).
It lets the user plan trips day-by-day, add activities with times/locations/costs, and keep a
running trip budget. It follows every shared system already used by the other pages
(passcode lock `031171`, dark + gold theme, PWA/installable, manual update banner, Firebase
REST cloud sync, fully English UI, timezone-safe string month/date math).

This is a pure front-end tool: one standalone HTML file (`itinerary.html`), vanilla JS, no build
step, hosted on GitHub Pages alongside the other pages. It must be reachable from the Home
dashboard (`home.html`) via a new tile.

Terminology:
- **Trip** — a named plan with a start and end date, a destination, and an optional budget.
- **Day** — one date inside a trip's date range.
- **Item** (activity) — a single planned thing on a day (time, title, location, note, cost, category).

---

## Requirements

### Requirement 1 — Trip management

**User story:** As a traveler, I want to create and manage multiple trips, so that I can plan more than one journey without mixing them up.

#### Acceptance criteria
1. WHEN the user opens the page THEN the system SHALL show a list of existing trips (or an empty state prompting to create one).
2. WHEN the user creates a trip THEN the system SHALL require a trip name, a destination, a start date, and an end date, and SHALL accept an optional total budget and currency.
3. IF the end date is earlier than the start date THEN the system SHALL reject the trip and show an inline error.
4. WHEN the user selects a trip THEN the system SHALL open that trip's day-by-day itinerary.
5. WHEN the user edits a trip's name/destination/dates/budget THEN the system SHALL update the trip and re-derive its day list from the new date range without losing items that still fall inside the range.
6. WHEN the user deletes a trip THEN the system SHALL ask for confirmation and SHALL remove the trip and all its items.

### Requirement 2 — Day-by-day itinerary

**User story:** As a traveler, I want each day of my trip laid out separately, so that I can see my plan one day at a time.

#### Acceptance criteria
1. WHEN a trip is opened THEN the system SHALL generate one day entry for every date from start to end date inclusive, using timezone-safe string date math (no `Date` timezone drift).
2. WHEN a day is shown THEN the system SHALL display the weekday + full date and the count/total cost of items on that day.
3. WHEN the user navigates days THEN the system SHALL provide previous/next day controls and a day picker.
4. WHEN a trip spans a date range THEN the system SHALL let the user jump directly to any day in the range.

### Requirement 3 — Activity (item) management

**User story:** As a traveler, I want to add activities to each day with details, so that I know what to do, when, where, and how much it costs.

#### Acceptance criteria
1. WHEN the user adds an item to a day THEN the system SHALL accept: start time (optional), title (required), location (optional), category, cost (optional), and a note (optional).
2. WHEN items on a day have start times THEN the system SHALL sort them chronologically; items without a time SHALL sort after timed items.
3. WHEN the user edits an item THEN the system SHALL update it in place.
4. WHEN the user deletes an item THEN the system SHALL remove it from that day.
5. WHEN the user moves an item to a different day in the same trip THEN the system SHALL re-assign it to the chosen day.
6. WHEN the user marks an item done THEN the system SHALL show it as completed (e.g. struck-through) without deleting it.
7. The category SHALL be chosen from a fixed list: Flight, Transport, Hotel, Food, Activity, Shopping, Meeting, Other.

### Requirement 4 — Budget & cost summary

**User story:** As a traveler, I want to see what my trip costs, so that I can stay within budget.

#### Acceptance criteria
1. WHEN items have costs THEN the system SHALL show a trip total, a per-day total, and a per-category breakdown.
2. IF a trip has a budget THEN the system SHALL show remaining budget (budget − planned total) and a progress bar.
3. IF planned total exceeds the budget THEN the system SHALL visibly flag the overage (e.g. red).
4. WHEN costs are shown THEN the system SHALL format them with the trip's currency.

### Requirement 5 — Shared app systems (parity with other pages)

**User story:** As the app owner, I want the itinerary page to behave exactly like the rest of the dashboard, so that it feels like one app.

#### Acceptance criteria
1. WHEN the page loads THEN the system SHALL gate it behind the shared passcode lock (`031171`) and SHALL remember the unlock for the browser session (`ctUnlocked`).
2. The page SHALL use the shared dark + gold theme and the same CSS variables/typography as `home.html`.
3. The page SHALL reference `manifest.json` and be installable as a PWA.
4. WHEN a newer build is published THEN the system SHALL show the shared manual "Update available (vN) — tap to refresh" banner, and SHALL NOT auto-reload.
5. All UI text SHALL be in English.

### Requirement 6 — Cloud sync & persistence

**User story:** As a traveler, I want my itinerary on all my devices, so that I can plan on my PC and view it on my phone.

#### Acceptance criteria
1. WHEN state changes THEN the system SHALL persist it to localStorage under key `itineraryV1`.
2. WHEN state changes THEN the system SHALL write the whole state as a single JSON string (`stateJson`) to Firebase via an HTTPS REST `PUT` at path `itinerary/state`.
3. WHEN the page loads THEN the system SHALL subscribe to the realtime listener and SHALL treat the first cloud snapshot after load as the source of truth (a stale device SHALL NOT overwrite good cloud data).
4. WHEN the page is hidden/closed THEN the system SHALL flush any pending write so a quick refresh never loses an edit.
5. IF a cloud read/write fails THEN the system SHALL keep working from localStorage and SHALL NOT freeze the UI (writes wrapped so a render error can't block future writes).

### Requirement 7 — Home dashboard integration

**User story:** As the app owner, I want the itinerary reachable from the home screen, so that I can open it like any other tool.

#### Acceptance criteria
1. WHEN the home dashboard renders THEN the system SHALL show an "Itinerary" tile linking to `itinerary.html`, with an icon and short description, matching the existing tile style.
2. WHEN a new build ships THEN the system SHALL bump `version.json` and the `APP_VERSION` constant on all pages per the existing update convention.

### Requirement 8 — Export / share (nice-to-have)

**User story:** As a traveler, I want to share or print my itinerary, so that travel companions can see the plan.

#### Acceptance criteria
1. WHEN the user chooses copy/export THEN the system SHALL produce a clean plain-text version of the trip (grouped by day, with times, titles, locations, and costs).
2. WHEN the user prints THEN the system SHALL render a print-friendly layout (lock screen and controls hidden).
