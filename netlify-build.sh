#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Monorepo dynamic build started"
SITE_NAME="${NETLIFY_SITE_NAME:-}" || true
BRANCH="${BRANCH:-}" || true

if [[ -z "$SITE_NAME" ]]; then
  echo "⚠️ NETLIFY_SITE_NAME not set. Falling back to manual selection." >&2
fi

build_frontend() {
  echo "🚀 Building frontend (@santan/frontend)"
  cd apps/frontend
  npm ci
  npm run prebuild || echo "(optional prebuild skipped)"
  npm run build
  echo "✅ Frontend built"
}

build_studio() {
  echo "🛠️ Building studio (@santan/studio)"
  cd apps/studio
  npm ci
  npm run build
  echo "✅ Studio built"
}

# Decide target
if [[ "$SITE_NAME" == *"studio"* ]]; then
  build_studio
  # Move dist to root publish dir if needed
  if [[ -d dist ]]; then
    echo "📁 Preparing publish directory (dist)"
  fi
elif [[ "$SITE_NAME" == *"frontend"* ]]; then
  build_frontend
  if [[ -d dist/client ]]; then
    echo "📁 Setting publish dir to dist/client"
  fi
else
  # Fallback heuristic: if branch contains studio, build studio; otherwise frontend
  if [[ "$BRANCH" == *"studio"* ]]; then
    build_studio
  else
    build_frontend
  fi
fi

# Symlink correct publish folder if necessary
cd "$NETLIFY_BUILD_BASE" || true
if [[ -d apps/frontend/dist/client && "$SITE_NAME" == *"frontend"* ]]; then
  rm -rf dist || true
  mkdir -p dist
  cp -r apps/frontend/dist/client/* dist/
fi
if [[ -d apps/studio/dist && "$SITE_NAME" == *"studio"* ]]; then
  rm -rf dist || true
  mkdir -p dist
  cp -r apps/studio/dist/* dist/
fi

echo "🏁 Build script finished"

