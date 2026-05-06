#!/bin/bash
# PromptIQ Pro — Safari Extension Converter
# Run this script AFTER installing full Xcode from the App Store.
#
# Usage: bash scripts/convert-safari.sh
#
# What it does:
#   1. Builds the Safari-compatible dist (dist-safari-pro/)
#   2. Runs Apple's safari-web-extension-converter to generate an Xcode project
#   3. Opens the Xcode project — you then Build & Archive inside Xcode to submit to Mac App Store

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXT_DIR="$(dirname "$SCRIPT_DIR")"
PROJ_DIR="$EXT_DIR/safari-xcode"

echo "==> Building Safari Pro dist..."
cd "$EXT_DIR"
npm run build:safari-pro

echo "==> Converting to Xcode project..."
xcrun safari-web-extension-converter \
  --app-name "PromptIQ Pro" \
  --bundle-identifier "com.usepromptiq.PromptIQPro" \
  --swift \
  --no-open \
  --force \
  --output-directory "$PROJ_DIR" \
  "$EXT_DIR/dist-safari-pro"

echo ""
echo "✅ Xcode project created at: $PROJ_DIR"
echo ""
echo "Next steps:"
echo "  1. Open the project: open \"$PROJ_DIR/PromptIQ Pro/PromptIQ Pro.xcodeproj\""
echo "  2. In Xcode: select your Apple Developer Team under Signing & Capabilities"
echo "  3. Product → Archive"
echo "  4. Distribute App → App Store Connect"
echo "  5. Submit for review on appstoreconnect.apple.com"
echo ""
echo "Requirements:"
echo "  - Apple Developer account (US\$99/year) — developer.apple.com"
echo "  - Xcode 15+ recommended"
