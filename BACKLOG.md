# Backlog — Planned Tools & Features

Ideas captured for future builds of the Personal Dashboard. Not yet implemented.
Each item below becomes its own tool (new page/tile on `home.html`) when built,
following the same conventions as the existing app: pure front-end (HTML + vanilla
JS), passcode lock, dark + gold theme, PWA, localStorage + Firebase cloud sync,
English UI.

---

## Table of contents

1. [Workout Planner](#1-workout-planner)
2. [Jogging Tracker](#2-jogging-tracker)
3. [Weight & Body Tracker](#3-weight--body-tracker)
4. [Motor Maintenance (Honda ADV 160)](#4-motor-maintenance-honda-adv-160)

---

## 1. Workout Planner

A structured strength-training planner that builds a weekly program and tracks
each session.

### Program setup
- **Plan length** — choose 3-day, 4-day, 5-day, or 6-day split.
- **Equipment** — choose no equipment, dumbbell/bands, or full gym.
- **Level** — beginner or experienced.

### Today view
- Shows the current day's workout: warm-up, exercises, sets, reps, and form tips.

### Weekly view
- See the whole week at a glance and switch between days.
- **"Swap day"** — move a day if you can't train on schedule.

### Session tracking
- Checkbox per exercise and a **"Mark as done"** button.
- Log actual weight and reps per set.
- **Auto-detect personal record (PR)**.
- Rest timer and workout timer.
- Notes per session.

### Progression & history
- **Automatic weekly difficulty increase**, with a lighter **deload week every 4th week**.
- Weekly summary: how many sessions completed.
- Streak and a calendar of workout days.
- Exercise library you can add to or swap exercises from.

---

## 2. Jogging Tracker

Running plan and log, from beginner walk/jog up to continuous runs.

### Schedule
- Interval jogs and long easy jogs on a schedule.
- **Beginner mode** — start jog/walk, gradually lengthen until continuous running.

### Logging
- Log distance and time; **auto-compute pace (min/km)**.
- Weekly total km.

### Charts & records
- Chart of pace and distance over time.
- Best 1 km, 3 km, and 5 km times.

---

## 3. Weight & Body Tracker

Body-composition tracking toward a target weight, with safety guardrails.

### Goal setup
- Starting weight, target weight, target date, and height.

### Weight log
- Log weight anytime.
- Progress bar and chart: **actual vs. ideal line** toward the target.
- Computes the **kg per week** you need to hit the target.
- **Warning if the target is too fast**, with a suggested safer date.
- **Warning if the target drops below a healthy BMI**.
- **Weekly average** so day-to-day fluctuations don't skew progress.
- Auto-compute BMI.

### Measurements & photos
- Log measurements: chest, arms, waist, thighs, shoulders.
- Body fat (optional).
- Progress photos: front, side, back, with before/after comparison.

### Reminders
- Reminder on weigh-in day.

---

## 4. Motor Maintenance (Honda ADV 160)

Maintenance, service, and fuel tracker for the Honda ADV 160, driven by odometer.

### Odometer & intervals
- Update odometer, then **auto-compute km remaining** per item.
- Checklist with its own interval per item: engine oil, gear oil, air filter,
  CVT belt & rollers, spark plug, brake pads & fluid, coolant, tires, battery.
- **Color status**: red (overdue), yellow (due soon), green (still OK).
- Intervals are editable to match the owner's manual.

### Service log
- Date, km, work done, shop, and cost.
- Total cost per month or year, and **cost per km**.
- Receipt photos and notes.

### Fuel log
- Liters, price, km, and **auto-compute km/L**.

### Reminders
- Registration and insurance reminders.

---

*Personal use only. Backlog of planned features — not yet built.*
