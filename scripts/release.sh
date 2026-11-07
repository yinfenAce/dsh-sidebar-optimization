#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

version="$(node -p "require('./package.json').version")"
tag="v${version}"

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "working tree is not clean; commit or stash first" >&2
  exit 1
fi

npm run check
npm test
npm pack

git tag -a "$tag" -m "侧边栏优化 ${tag}"
git push origin main
git push origin "$tag"

gh release create "$tag" ./*.tgz \
  --title "侧边栏优化 ${tag}" \
  --generate-notes
