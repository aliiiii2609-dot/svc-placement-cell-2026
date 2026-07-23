#!/usr/bin/env bash
# Build and deploy helper for the SVC Placement Cell site.
# Run from the project root.

set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Verifying Node version (18+)"
node_major=$(node -v | sed 's/v//; s/\..*//')
if [ "$node_major" -lt 18 ]; then
  echo "Node 18+ required. Detected: $(node -v)"
  exit 1
fi

echo "==> Installing dependencies"
npm install

echo "==> Type-checking"
npm run typecheck

echo "==> Building production bundle"
npm run build

echo
echo "Build complete. Output in dist/."
echo
echo "Next steps:"
echo "  - Deploy with the Vercel CLI:  npx vercel --prod, OR"
echo "  - Push to GitHub and import the repo in Vercel"
echo "  - See DEPLOYMENT.md for the full guide"
