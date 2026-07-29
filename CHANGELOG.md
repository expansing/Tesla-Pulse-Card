# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and this project follows Semantic
Versioning.

## [Unreleased]

## [0.1.3] - 2026-07-29

### Fixed

- Improve error handling for scoped custom element registry to gracefully handle duplicate definition attempts.

## [0.1.2] - 2026-07-29

### Fixed

- Move card file to repository root for HACS compatibility (fixes "invalid file name" error).
- Add guard checks to prevent duplicate custom element registration.
- Update release and validation workflows to reference root card file.

## [0.1.1] - 2026-07-29

### Fixed

- Register main card element so card appears in dashboard editor.
- Fix hacs.json to point to dist/ subdirectory for proper HACS discovery.
- Untrack instructions file to respect gitignore rules.

## [0.1.0] - 2026-07-29

### Added

- Initial Tesla Pulse card implementation with Lovelace visual editor support.
- HACS metadata and release workflows.
- Preview fixture and vehicle image pipeline.