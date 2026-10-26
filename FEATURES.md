# Personal Dashboard — Features & Enhancements

A private, multi-tool personal finance web app hosted on GitHub Pages
(`https://getjinxxxx.github.io/crypto-tracker`). Pure front-end (HTML + vanilla JS),
no build step. Data persists on-device (localStorage) and syncs to the cloud
(Firebase Realtime Database) so the same data appears on phone and PC.

**Current build:** v103
**Passcode (all pages):** `031171`

---

## Table of contents

1. [App structure](#app-structure)
2. [Shared systems (all pages)](#shared-systems-all-pages)
3. [Home / Dashboard (`home.html`)](#home--dashboard-homehtml)
4. [Crypto Tracker (`index.html`)](#crypto-tracker-indexhtml)
5. [Market Signals (`signals.html`)](#market-signals-signalshtml)
6. [Salary Calculator (`salary.html`)](#salary-calculator-salaryhtml)
7. [Debt Tracker (`debt.html`)](#debt-tracker-debthtml)
8. [Receivables Tracker (`receivables.html`)](#receivables-tracker-receivableshtml)
9. [Shared view for other people (`shared.html`)](#shared-view-for-other-people-sharedhtml)
10. [Cloud sync & data model](#cloud-sync--data-model)
11. [Version / update history](#version--update-history)

---

## App structure

| File | Purpose |
|------|---------|
| `home.html` | Landing dashboard with tiles linking to every tool |
| `index.html` | Crypto holdings tracker (BTC/ETH/etc.) |
| `signals.html` | Market buy/sell signals for a library of coins |
| `salary.html` | Semi-monthly take-home pay calculator |
| `debt.html` | Debts you owe (per person / credit card / loan) |
| `receivables.html` | Money other people owe you |
| `shared.html` | Read-only snapshot viewer for a shared person/debt link |
| `version.json` | Single source of truth for the current build number |
| `manifest.json` | PWA manifest (installable to the home screen) |
| `server.js` | Minimal local static file server for testing (`node server.js`) |

The whole app is published to GitHub Pages; every page is standalone and
can be installed to a phone home screen (PWA).

---

## Shared systems (all pages)

- **Passcode lock** — every page is gated by a passcode (`031171`). Casual privacy,
  not strong security. Unlock state is remembered for the browser session, so you
  only enter it once per session across pages.
- **Dark + gold theme** — consistent visual design (black background, gold accents).
- **PWA / installable** — add to home screen; runs full-screen like an app.
- **Manual update banner** — when a newer build is published, a small gold banner
  appears at the bottom: "Update available (vN) — tap to refresh". You choose when to
  update. (It never auto-reloads — an earlier auto-reload caused a refresh loop that
  blocked scrolling/typing, so it was replaced with this manual banner.)
- **Cloud sync** — data syncs to Firebase Realtime DB so the same data shows up on all
  your devices. Writes use a plain HTTPS REST PUT (reliable on all networks); reads use
  the realtime listener. See [Cloud sync](#cloud-sync--data-model).
- **Fully English UI** — all Tagalog/Taglish text was translated to English.

---

## Home / Dashboard (`home.html`)

- Greeting that changes with the time of day (morning / afternoon / evening).
- Today's full date.
- **Tiles** linking to each tool, each with an icon and short description:
  - Crypto Tracker
  - Salary
  - Debt Tracker
  - Receivables
- Responsive grid (1 column on phones, 2 columns on wider screens).

---

## Crypto Tracker (`index.html`)

Tracks your crypto holdings with live prices, profit/loss, and charts.

### Holdings table
- One row per buy entry, grouped by coin card.
- Columns: Platform (Coins.ph / Binance), Currency (PHP / USDT / USDC),
  Entry price, Invested amount, value in PHP, Current value, Amount of coin.
- **Active vs Pending** toggle per row (the circle checkbox):
  - **Active** (ticked) = coins you actually bought (real holdings).
  - **Pending** (unticked, struck-through) = a waiting order at a target price.
  - Active rows float to the top; pending rows sink to the bottom.
- Add / delete rows; add new coins from a searchable coin picker.
- Per-row **currency selector** (PHP / USDT / USDC) relabels that row's money.
- Per-row **note** field.
- **Take-profit / sell records** — log a partial sell (amount, price, date); the row
  shows realized profit and how much you still hold.

### Live market data
- Live prices from the CoinGecko API (PHP and USD).
- 24h change, 30-day high/low range.
- Per-coin price **chart** with range tabs (24h / 7d / 30d) and Line/Candles
  toggle (advanced view).
- Break-even line drawn on the chart at your average buy price.
- **Fear & Greed Index** widget (market sentiment gauge).

### Analysis & helpers
- **Plain-language summary** of your total position (up/down, by how much).
- **Per-coin plain explanation** ("you hold X, you're up/down Y%").
- **Average buy price** and unrealized P/L per coin and overall.
- **What-if calculator** — enter a target sell price, see projected value/profit.
- **Portfolio goal** with a progress bar.
- **Allocation breakdown** (doughnut) of how holdings are split.
- **Platform sections** (All / Coins.ph / Binance) with per-platform subtotals,
  plus a coin-card sort selector (by value / by P/L).
- **Buy/sell signal badges** per row (Take profit / Near / Hold / Loss / Waiting).
- **Realized profit** (cashed-out, lifetime) tracked separately.
- USDT/USDC holdings kept separate from PHP totals.

### Views & extras
- **Simple vs Advanced** view toggle (Simple hides the extra tools for everyday checking).
- **Buy/sell browser alerts** — opt-in notifications when a coin hits take-profit or a
  pending order becomes ready to buy.
- Link to the **Market Signals** page.
- Collapsible coin cards; glossary/help modal explaining every term.

---

## Market Signals (`signals.html`)

- Reads the **same cloud state** as the tracker (your coins/rows), so signals match
  what you actually hold across devices.
- Covers a **library of coins** (BTC, ETH, SOL, XRP, BNB, ADA, DOGE, DOT, AVAX, LINK,
  MATIC, LTC, TRX, TON, SHIB, BCH, PEPE, USDT, USDC).
- Shows market-based buy/sell guidance per coin in PHP (and USD where relevant).

---

## Salary Calculator (`salary.html`)

Computes your **semi-monthly** (twice-a-month) take-home pay from a payslip.

### Earnings
- **Base pay** (editable via an Edit button if you get a raise).
- **Overtime** — enter number of OT hours; auto-computes OT pay from your hourly rate.
- **Night differential (ND)** and other earnings.
- **De Minimis** — a non-taxable benefit, fixed amount, applied on the **2nd cutoff
  only** (the 28th). Read-only. Not added to taxable income.

### Cutoff logic
- Choose the cutoff being computed: **1st cutoff** or **2nd cutoff**.
- **PhilHealth, SSS, Pag-IBIG** are deducted on the **1st cutoff only**.
- **MPF** is deducted on **both** cutoffs.
- **PhilHealth** is auto-computed (5% of monthly basic ÷ 2).

### Tax
- Withholding tax computed on taxable income, with a **proportional breakdown**
  showing how much tax comes from each source (base, OT, etc.).
- Two tax methods: standard, and **Cumulative / annualized (BIR, more accurate)**,
  which uses your saved history + an optional starting YTD seed (YTD taxable and
  YTD tax paid from your payslip).
- Tax fields are read-only (auto-calculated).

### History & records
- **Save this cutoff** to keep a record per period + cutoff.
- **Editable payslip history** — each saved entry has an edit (pencil) panel to fix
  period / cutoff / gross / deductions / net. Leaving Net blank auto-computes it as
  gross − deductions.
- **Take-home pay chart** of your last cutoffs (hover/tap a bar for details).
- This history feeds the Debt Tracker's "Salary vs Debt" comparison.

---

## Debt Tracker (`debt.html`)

Tracks money **you owe**, organized by month.

### Data model
- Each entry: category, person/label, sub-category, total amount, number of terms,
  due date, recurring flag, start month, per-term paid status.
- **Categories**: Person (debt to someone), Credit Card, Bank Loan, Online Loan,
  Government (SSS/Pag-IBIG/GSIS), Salary/Company Loan, Other.
- **Sub-categories** (for Person & Credit Card): Food, Groceries, Entertainment,
  Shopping, Bills/Utilities, Transportation, Health/Medical, Travel, Emergency, Other.

### Monthly view
- Month selector (previous / next); each month is its own sheet.
- **Auto-jump** once on load to the nearest month that has data; a jump button appears
  when the current month is empty but other months have debts.
- Grouped display: **Category → Card (per person/label) → Sub-category box → items**.
- Same person + name/label **adds up** into the existing card instead of duplicating.

### Installments & recurring
- **Terms** — a debt with N terms spreads across N consecutive months (1 term per
  month). Payment per term = total ÷ terms (auto).
- Rows and card headers show **this month's due** (per-term amount), not the full total.
- **Recurring bills** — monthly, until further notice (e.g. Netflix, Meralco). Charges
  the full amount every active month. A stop (⏹) button ends it going forward.
- Per-item **paid checkbox** marks this month's term paid. Editable amount / due date /
  terms per item.

### Deadlines & urgency
- Each item can have a **due date** (day of month). 1–15 = 1st cutoff, 16–31 = 2nd cutoff.
- **Urgency icon + color** on the due tag: red = overdue, orange = due soon (≤5 days),
  green = upcoming. Items are sorted most-urgent first.

### Summary & charts
- Summary: due this month, paid this month, remaining this month, total remaining (all).
- **Due-this-month-per-category** doughnut chart.
- **Salary vs Debt** box — pulls your saved take-home pay (from the Salary Calculator)
  and splits the month's debt across the 1st and 2nd cutoff, showing what's left after
  debts (debts with a deadline go to their cutoff; deadline-less debts are split evenly).

### Sharing (per person)
- A **share (🔗) button** on each person card creates a **short link** (data stored in
  the cloud, not in the URL, so other debts aren't exposed).
- You can send that link to the person you owe. They see only their own balance and can
  **submit a note back** to you (reply channel), which appears on the card (collapsible).

---

## Receivables Tracker (`receivables.html`)

A mirror of the Debt Tracker, but for money **other people owe you**. Separate data
store, so it never mixes with your debts.

- Grouped **per person** (who owes you). No category dropdown — always a person.
- Sub-categories describe what the money was for (Food, Entertainment, Cash loan, etc.).
- Same features as Debt Tracker where they apply: monthly sheets, terms/installments,
  recurring, due dates with urgency icons/sorting, per-item **collected** checkbox,
  edit panel, auto-jump.
- Summary: due this month, collected this month, uncollected this month, total owed to
  you (all).
- **Owed-to-me-per-person** doughnut chart.
- **Share (🔗)** per person — send a reminder link to whoever owes you; they see only
  their balance and can submit a note back.
- The Salary-vs-Debt box is intentionally **removed** here (you collect, not pay).

---

## Shared view for other people (`shared.html`)

The page a shared link opens for the other person.

- Opened via a short link: `shared.html#<shareId>` (data fetched live from the cloud).
- Read-only snapshot of **only that person's** items for a given month (month navigation
  included); no other debts/receivables are visible.
- Summary + per-sub-category breakdown with per-item amounts, term tags (e.g. 1/3), and
  due-date tags.
- Wording adapts to context:
  - Debt link → "Debt summary for …", "Note to owner".
  - Receivable link → "Amount owed by …", "Note to lender".
- The viewer can **submit a note** that syncs back to the owner's card (cloud reply
  channel). Falls back to device-local save if there's no cloud channel.

---

## Cloud sync & data model

- **Backend:** Firebase Realtime Database (project `crypto-tracker-bfefb`,
  `asia-southeast1` region). Rules are open read/write (personal use).
- **Paths:**
  - `tracker/state` — crypto tracker state
  - `debt/state` — debt tracker state
  - `receivables/state` — receivables state
  - `salaryHistoryV1` (localStorage) — salary history, read by the debt page
  - `shares/<shareId>/data` — a shared snapshot for one person
  - `shares/<shareId>/reply` — the note that person sends back
- **Local keys:** `cryptoTrackerState`, `debtTrackerV3`, `receivablesV1`,
  `salaryCalcV1`, `salaryHistoryV1`.
- **Write strategy:** the whole state is stored as **one JSON string** (`stateJson`) via
  an HTTPS REST `PUT`. This avoids two real failures that caused "my changes revert on
  refresh":
  1. The realtime SDK's WebSocket write could hang forever on some networks — REST
     always completes.
  2. Firebase rejects a write (HTTP 400) if any nested key contains a forbidden
     character (`. $ # [ ] /`) — storing one string value has no nested keys to reject.
- **Read strategy:** realtime listener; the **first snapshot after load always wins**
  (cloud is the source of truth) so a stale device can't overwrite good cloud data.
  Pending writes are flushed on page hide so a quick refresh never loses an edit.
- **Timezone-safe month math** — all month logic uses pure string parsing (no `Date`
  timezone drift).

---

## Version / update history

Notable milestones from this project's iteration:

| Build | Change |
|-------|--------|
| v75 | Share link became a short Firebase link (no debts in the URL) |
| v83 | Timezone-safe pure-string month math |
| v84 | Rows/cards show this month's due, not the full total |
| v86 | Auto-jump once to the nearest month with data |
| v88 | Debt data model: id/category/person/name/subCat/amount/terms/recurring/dueDay/… |
| v89 | Due-date urgency icons + sort (overdue / due-soon / upcoming) |
| v90 | Salary cutoff rules: PhilHealth/SSS/Pag-IBIG 1st cutoff only; MPF both |
| v91 | Editable payslip history |
| v93 | Share payload includes dueDay / recurring / endMonth |
| v94 | Entire UI translated to English |
| v95 | Added the Receivables tracker |
| v96–v97 | Sync fixes: cloud is source of truth on load; flush on page hide |
| v98 | try/finally so a render error can't freeze cloud writes |
| v99 | Visible save diagnostics + deep-clean writes |
| v100 | Writes switched to REST PUT (SDK WebSocket write could hang) |
| v101 | State stored as a single JSON string (fixes HTTP 400 forbidden-key writes) |
| v102 | Loop guard added to the auto-updater |
| v103 | Auto-reload removed entirely; replaced with a manual "tap to refresh" banner |

---

*Personal use only. This document describes the app as of build v103.*
