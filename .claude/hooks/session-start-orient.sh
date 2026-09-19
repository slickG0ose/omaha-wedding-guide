#!/usr/bin/env bash
# SessionStart orientation — prints a compact "where am I?" briefing on stdout,
# which becomes context for Claude's first turn. Adapted from the storybook repo,
# trimmed to what matters here: git state plus what's still unfinished for guests.
set -euo pipefail

INPUT="$(cat 2>/dev/null || true)"

SOURCE=$(printf '%s' "$INPUT" | node -e '
let s = "";
process.stdin.on("data", d => s += d);
process.stdin.on("end", () => {
  try { process.stdout.write(JSON.parse(s).source || ""); } catch (e) {}
});
' 2>/dev/null || true)

# Post-compaction restart: the model already has its summary, no need to spam more.
[[ "$SOURCE" == "compact" ]] && exit 0

cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0

BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "(detached)")
STATUS=$(git status --short 2>/dev/null | head -10 || true)
RECENT=$(git log --oneline -3 2>/dev/null || true)
READY=$(npm run --silent check:ready 2>/dev/null | grep -E "unfinished item|ready to share" || true)

{
  echo "## Session orientation (.claude/hooks/session-start-orient.sh)"
  echo
  echo "**Branch:** \`$BRANCH\` — pushing here deploys to GitHub Pages once CI passes."
  echo
  if [[ -n "$STATUS" ]]; then
    echo "**Working tree:**"
    echo '```'
    printf '%s\n' "$STATUS"
    echo '```'
  else
    echo "**Working tree:** clean"
  fi
  echo
  if [[ -n "$RECENT" ]]; then
    echo "**Recent commits:**"
    echo '```'
    printf '%s\n' "$RECENT"
    echo '```'
    echo
  fi
  if [[ -n "$READY" ]]; then
    echo "**Guest-facing readiness:**$READY"
    echo "Run \`npm run check:ready\` for the itemised list."
    echo
  fi
  echo "_Remove the \`hooks.SessionStart\` entry in \`.claude/settings.json\` to disable._"
}
