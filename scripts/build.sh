#!/usr/bin/env sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
{
  cat "$ROOT_DIR/vendor/three/three.min.js"
  printf '\n'
  cat "$ROOT_DIR/src/tesla-pulse-card.js"
} > "$ROOT_DIR/tesla-pulse-card.js"
cp "$ROOT_DIR/tesla-pulse-card.js" "$ROOT_DIR/dist/tesla-pulse-card.js"
