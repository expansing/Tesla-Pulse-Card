# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and this project follows Semantic
Versioning.

## [Unreleased]

## [0.1.8] - 2026-07-30

### Added

- Add configurable Cybertruck scale and two-axis drag rotation.
- Add charge-limit labeling, charge-power telemetry, and native entity-detail
	actions for telemetry values.
- Add transient command feedback animations for vehicle and command-dock
	controls.

### Changed

- Refine the telemetry surface into compact, interactive readouts.
- Place the TPMS readout beside the 3D vehicle stage.

### Fixed

- Keep the vehicle, TPMS readout, and vehicle-status ribbon in separate stage
	bands to prevent visual overlap.
- Prevent telemetry labels and values from colliding in compact layouts.

## [0.1.7] - 2026-07-30

### Added

- Bundle a user-owned interactive Cybertruck GLB with the card resource.
- Add configurable Cybertruck exterior colors in the visual editor and YAML.
- Add an optional local model URL override.

### Changed

- Replace the procedural sedan with the Cybertruck model and responsive
	vehicle-stage camera framing.

### Fixed

- Preserve the WebGL canvas across Home Assistant state updates.
- Round telemetry values to unit-appropriate precision.

## [0.1.5] - 2026-07-29

### Fixed

- Register the main custom element only once.
- Advertise `tesla-pulse-card` in the card picker without the YAML-only
	`custom:` prefix.

## [0.1.4] - 2026-07-29

### Added

- Debug logging to console for element registration to help diagnose loading issues.

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