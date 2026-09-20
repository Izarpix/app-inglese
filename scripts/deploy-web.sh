#!/bin/bash
# Builds Inglesiamo for the web and packs it for Cloudflare Pages.
#
#   ./scripts/deploy-web.sh
#
# Then, on https://dash.cloudflare.com: Workers & Pages, project "inglesiamo",
# Create deployment, Production, and drop in the zip this script leaves in the
# project folder. The build id changes at every build, so every phone with the
# app on its home screen picks the new version up within a minute by itself.
set -e

cd "$(dirname "$0")/.."

node scripts/build-web.js

rm -f inglesiamo-dist.zip
cd dist
zip -qr ../inglesiamo-dist.zip . -x ".DS_Store"
cd ..

echo
echo "Pronto: inglesiamo-dist.zip ($(du -h inglesiamo-dist.zip | cut -f1))"
echo "Build:  $(python3 -c "import json;print(json.load(open('dist/version.json'))['build'])")"
echo "Carica su https://dash.cloudflare.com -> Workers & Pages -> inglesiamo -> Create deployment"
