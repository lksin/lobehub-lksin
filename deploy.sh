#!/usr/bin/env bash
# deploy.sh — push to GitHub, monitor Docker build, optionally cancel test CI
#
# Usage:
#   ./deploy.sh [options] [branch]
#
# Options:
#   -c, --cancel-tests   Cancel "Test CI" and "E2E CI" runs after push
#   -d, --deploy         Auto-deploy to server after successful build
#   --no-watch           Just push, don't monitor the build
#   -h, --help           Show this help
#
# Requires:
#   - git ssh configured (for push)
#   - gh CLI authenticated (only for --cancel-tests: gh auth login)
#   - python3 (for JSON parsing)
#   - sshpass + server access (only for --deploy)

set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────
REPO="lksin/lobehub-lksin"
SERVER_HOST="47.104.163.206"
SERVER_USER="root"
SERVER_PASS="Lk2517871772."
SERVER_DIR="/root/lobehub-v2"
POLL_INTERVAL=30

# ── Defaults ──────────────────────────────────────────────────────────────────
BRANCH="main"
CANCEL_TESTS=false
AUTO_DEPLOY=false
NO_WATCH=false

# ── Colors ────────────────────────────────────────────────────────────────────
R='\033[0;31m' G='\033[0;32m' Y='\033[1;33m' B='\033[0;34m' N='\033[0m'
log()  { echo -e "${B}[deploy]${N} $*"; }
ok()   { echo -e "${G}  ✓${N} $*"; }
warn() { echo -e "${Y}  !${N} $*"; }
err()  { echo -e "${R}  ✗${N} $*"; }
die()  { err "$*"; exit 1; }

# ── Arg parse ─────────────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    -c|--cancel-tests) CANCEL_TESTS=true ;;
    -d|--deploy)       AUTO_DEPLOY=true ;;
    --no-watch)        NO_WATCH=true ;;
    -h|--help)
      sed -n '2,14p' "$0" | sed 's/^# \?//'
      exit 0 ;;
    -*) die "Unknown option: $1" ;;
    *)  BRANCH="$1" ;;
  esac
  shift
done

# ── Step 1: Push ──────────────────────────────────────────────────────────────
log "Pushing branch '${BRANCH}' to origin..."
git push origin "$BRANCH"
COMMIT_SHA=$(git rev-parse HEAD)
ok "Pushed commit ${COMMIT_SHA:0:8} → github.com/${REPO}"

[[ "$NO_WATCH" == "true" ]] && exit 0

# ── Step 2: Wait for GitHub to register workflow runs ─────────────────────────
log "Waiting for GitHub Actions to register runs (10s)..."
sleep 10

# ── Helper: get run for a workflow name + SHA ─────────────────────────────────
get_run() {
  local name="$1" filter_status="${2:-}"
  curl -s "https://api.github.com/repos/${REPO}/actions/runs?per_page=15" | \
    python3 - <<PYEOF
import json, sys
data = json.load(sys.stdin)
for r in data['workflow_runs']:
    if r['name'] != '${name}': continue
    if r['head_sha'] != '${COMMIT_SHA}': continue
    status_ok = not '${filter_status}' or r['status'] == '${filter_status}'
    if status_ok:
        print(r['id'], r['status'], r['conclusion'] or 'none')
        break
PYEOF
}

# ── Step 3: Optionally cancel Test CI and E2E CI ──────────────────────────────
cancel_run() {
  local name="$1"
  local info
  info=$(get_run "$name" "in_progress") || true
  [[ -z "$info" ]] && info=$(get_run "$name" "queued") || true

  if [[ -z "$info" ]]; then
    warn "No active run found for '${name}'"
    return
  fi

  local run_id
  run_id=$(awk '{print $1}' <<< "$info")

  if ! command -v gh &>/dev/null; then
    warn "gh CLI not installed — cannot cancel '${name}'. Install: https://cli.github.com"
    return
  fi

  if gh api -X POST "repos/${REPO}/actions/runs/${run_id}/cancel" &>/dev/null; then
    ok "Cancelled '${name}' (run ${run_id})"
  else
    warn "Failed to cancel '${name}' — run may have already finished or gh not authenticated"
  fi
}

if [[ "$CANCEL_TESTS" == "true" ]]; then
  log "Cancelling test workflows..."
  cancel_run "Test CI"
  cancel_run "E2E CI"
fi

# ── Step 4: Watch Docker build ────────────────────────────────────────────────
echo ""
log "Monitoring 'Build & Push Docker Image' (commit ${COMMIT_SHA:0:8})..."
echo "  (polls every ${POLL_INTERVAL}s — Ctrl+C to detach)"
echo ""

RUN_ID=""
LAST_STATUS=""

while true; do
  INFO=$(get_run "Build & Push Docker Image") || true

  if [[ -z "$INFO" ]]; then
    printf "\r  Waiting for run to appear...   "
    sleep 10
    continue
  fi

  read -r RUN_ID RUN_STATUS RUN_CONCLUSION <<< "$INFO"

  if [[ "$RUN_STATUS" != "$LAST_STATUS" ]]; then
    echo ""
    log "Run ${RUN_ID}: status=${RUN_STATUS} conclusion=${RUN_CONCLUSION}"
    LAST_STATUS="$RUN_STATUS"
  else
    printf "\r  [%s] status=%-12s conclusion=%-10s" "$(date +%H:%M:%S)" "$RUN_STATUS" "$RUN_CONCLUSION"
  fi

  if [[ "$RUN_STATUS" == "completed" ]]; then
    echo ""
    echo ""
    if [[ "$RUN_CONCLUSION" == "success" ]]; then
      ok "Build SUCCEEDED"
      ok "Image: ghcr.io/${REPO}:latest"

      if [[ "$AUTO_DEPLOY" == "true" ]]; then
        echo ""
        log "Auto-deploying to ${SERVER_HOST}..."
        if ! command -v sshpass &>/dev/null; then
          die "sshpass not installed. Run: apt-get install sshpass"
        fi
        sshpass -p "${SERVER_PASS}" ssh -o StrictHostKeyChecking=no \
          "${SERVER_USER}@${SERVER_HOST}" \
          "cd ${SERVER_DIR} && docker compose pull lobe && docker compose up -d lobe && docker logs \$(docker compose ps -q lobe) --tail 5 2>&1"
        echo ""
        ok "Server updated and container restarted"
      else
        echo ""
        echo -e "${Y}Next steps:${N}"
        echo "  1. Ensure the ghcr.io package visibility is Public (GitHub → Packages)"
        echo "  2. On the server:"
        echo "       cd ${SERVER_DIR}"
        echo "       docker compose pull lobe && docker compose up -d lobe"
        echo ""
        echo "  Or re-run with --deploy to do this automatically:"
        echo "       ./deploy.sh --deploy"
      fi
    else
      err "Build FAILED (conclusion: ${RUN_CONCLUSION})"
      echo ""
      echo "  Logs: https://github.com/${REPO}/actions/runs/${RUN_ID}"
      exit 1
    fi
    break
  fi

  sleep "$POLL_INTERVAL"
done
