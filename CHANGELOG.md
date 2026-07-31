# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and this project follows Semantic
Versioning.

## [Unreleased]

## [0.1.13] - 2026-07-31

### Changed

- Set the default vehicle color preset to black.
- Render wheel rims/hubs with a black finish by default.

## [0.1.12] - 2026-07-31

### Fixed

- Preserve the FBX-authored wheel transforms during GLB export.
- Restore the supplied headlight texture under the filename referenced by the FBX.

## [0.1.11] - 2026-07-31

### Changed

- Replace 3D vehicle model with user-provided Tesla model asset (tesla_car1.fbx).
- Fix trunk/frunk anchor positioning to match correct vehicle orientation.
- Improve headlight visibility and rendering in 3D scene.
- Remove duplicate wheel geometry during model export.

## [0.1.10] - 2026-07-31

### Added

- Add visual configuration for built-in telemetry labels, icons, text format,
	and accent colors.
- Allow custom telemetry to be placed in Environment, High voltage, or
	Charging interface groups.

### Fixed

- Persist the final 3D vehicle orientation across dashboard refreshes in the
	current browser session.
- Move the energy-flow caption outside the energy rail boundary.

## [0.1.9] - 2026-07-31

### Added

- Add arbitrary labeled telemetry entities with configurable icon, text format,
	and accent color.
- Retain the 3D vehicle orientation after configuration changes.
- Enhance imported Cybertruck materials with glossy paint and matte trim.

### Fixed

- Separate the charge-limit percentage and energy-flow caption.
- Automatically create a matching release tag when a new VERSION is pushed to
	main.

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