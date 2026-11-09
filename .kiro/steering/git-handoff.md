# Git Handoff — user commits and pushes

Applies to every session in this workspace.

## Rule
The USER handles all git commit and push. Do NOT run `git add`, `git commit`,
`git push`, or confirm pushes via the GitHub raw URL. This saves credits.

## What the agent DOES do for a change
1. Make the code change.
2. Run the local syntax check (node parse for JS/HTML).
3. Bump `version.json` and the matching `APP_VERSION` constant(s).
4. Hand it off: state the files changed and the new version number, and tell the
   user it's ready to commit/push.

## What the agent does NOT do
- No `git add` / `git commit` / `git push`.
- No fetching the raw.githubusercontent.com URL to verify a push.

## Exception
Only run git commands if the user explicitly says so in that message
(e.g. "commit and push this" / "go ahead and push").
