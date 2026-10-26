# Visual-First for UI Changes

Applies to every session in this workspace.

## Rule
Before implementing ANY visual or UI change (layout, new view/section, moving or
hiding elements, restyling, new component), FIRST show a visual representation
(an ASCII / text mockup) of what it will look like, then WAIT for the user to
confirm or pick an option before writing code.

## How to present it
- Give a quick ASCII mockup of the proposed layout.
- If there are multiple reasonable approaches, show 2-3 labeled options (A, B, C)
  each with its own mockup, and give a short recommendation.
- Keep mockups compact and focused on the change, not the whole app.
- Do not edit files until the user confirms which option to build.

## Does NOT apply to
- Pure logic/computation fixes with no visible layout change.
- Bug fixes that restore existing intended appearance.
- Non-UI work (data, scripts, config, docs).

## After confirmation
Proceed normally: implement, verify locally (node --check for JS, run the local
server for a smoke check), bump version.json + APP_VERSION, commit, push, and
confirm the push via the GitHub raw URL.
