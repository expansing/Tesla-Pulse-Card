#!/usr/bin/env sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
{
  cat "$ROOT_DIR/vendor/three/three.min.js"
  printf '\n'
  cat "$ROOT_DIR/vendor/three/examples/js/loaders/GLTFLoader.js"
  printf '\nconst TESLA_PULSE_CYBERTRUCK_GLB_BASE64 = "'
  base64 -w 0 "$ROOT_DIR/assets/cybertruck.glb"
  printf '";\n'
  cat "$ROOT_DIR/src/tesla-pulse-card.js"
} > "$ROOT_DIR/tesla-pulse-card.js"
cp "$ROOT_DIR/tesla-pulse-card.js" "$ROOT_DIR/dist/tesla-pulse-card.js"
