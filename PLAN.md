# Tesla Pulse Card Plan

## Product Direction

Build a dedicated Tesla Pulse-aware Home Assistant frontend card in this
repository, published as a HACS frontend repository. It should take inspiration
from Ultra Vehicle Card's information hierarchy and configurable control rows,
without copying its implementation. Ultra Vehicle Card is deprecated; Tesla
Pulse gives us a focused, modern integration contract to build around.

Tesla Pulse already exposes the required dashboard surface through standard
Home Assistant entities: battery and charging, climate, locks, sentry mode,
charge port, windows, trunks, location, tire pressure, telemetry status, and
battery-health data. The card must not make Tesla API calls, handle credentials,
or require backend changes.

## Visual Direction: Tesla Pulse Console

Create a calm, adaptive instrument panel rather than a generic collection of
tiles:

```text
[ Vehicle name                  Telemetry: Live / Cached ]
[                      vehicle image                       ]
[      78%                         326 km                  ]
[  Battery bar with 80% charge-limit marker                ]
[  Charging status / kW / added energy / ETA when charging ]

[ Climate 21 C ] [ Locked ] [ Sentry ] [ Windows ]
[ Lock ] [ Climate ] [ Charge ] [ Frunk ] [ Trunk ] [ More ]

[ Expandable detail area: Climate | Security | Health ]
```

- Use the user's actual vehicle image, with a clean vehicle-icon fallback.
- Respect Home Assistant theme variables so the card works in light and dark
  dashboards without forcing a black Tesla theme.
- Reserve color for meaning: charging green or teal, stale or unavailable amber,
  warnings red, and neutral theme colors otherwise.
- Make telemetry freshness prominent. Tesla Pulse restores cached state and
  intentionally avoids waking a car by default.
- Require confirmation before high-risk commands: unlock, open frunk or trunk,
  vent windows, honk, flash lights, and fart.
- Use a responsive single-column mobile layout. On wide dashboards, place the
  energy hero beside the status and control areas.

## Version 1 Scope

### Tesla Pulse Binding

- Select the Tesla vehicle device in the visual editor.
- Resolve Tesla Pulse entities from the Home Assistant device registry and stable
  unique-ID suffixes.
- Provide explicit per-entity overrides for renamed or unusual entities.
- Hide unavailable telemetry fields rather than presenting misleading zero values.

### Overview

- Show battery percentage, estimated range, a charge-limit marker, and charge
  state.
- Show charging power, charge rate, energy added, current, and time to full only
  while relevant.
- Show the vehicle image, parked or driving state, lock state, telemetry
  freshness, and the last update time.

### Quick Actions

- Support lock and unlock, climate on and off, sentry mode, charge-port toggle,
  charge start and stop, window controls, frunk, and trunk.
- Show pending and error feedback after commands without assuming an immediate
  state change.
- Never automatically wake the vehicle while rendering or opening the card.

### Detail Views

- Climate: cabin and outdoor temperature, target temperature, defrost, and seat
  or steering-wheel heat when available.
- Security and vehicle: doors, windows, trunks, sentry mode, and tire-pressure
  warnings.
- Health: battery balance score and brick voltage imbalance, only when Fleet
  Telemetry provides those fields.

### Configuration

- Provide a visual editor first, with YAML configuration fully supported.
- Include display toggles, entity overrides, vehicle image, compact or expanded
  mode, quick-action selection, and confirmation preferences.
- Use Tesla Pulse-specific defaults rather than a universal vehicle abstraction.

## Tesla Pulse Entity Contract

The initial card targets Tesla Pulse version 0.6.6 and uses Home Assistant entity
domains instead of direct Tesla Fleet API access.

| Card area | Preferred Home Assistant entities |
| --- | --- |
| Battery and charging | Battery level, battery range, charge state, charge power, charge rate, energy added, time to full, charge-limit number |
| Climate | Climate entity, target-temperature number, defrost switch, seat-heater selects, steering-heater select |
| Access and cargo | Door lock, windows cover, frunk cover, trunk cover |
| Vehicle controls | Sentry, charge-port, and defrost switches; action buttons for wake, honk, flash, preconditioning, and windows |
| Vehicle state | Shift state, individual doors and windows, tire-pressure sensors, latitude and longitude |
| Freshness and health | Telemetry Status sensor with last-received metadata, battery balance score, brick voltage imbalance |

Entity IDs may vary based on the configured vehicle name. The resolver must use
the selected device and Tesla Pulse unique-ID suffixes, while allowing manual
overrides.

## Architecture

- Deliver a standalone Lovelace custom card registered as
  `custom:tesla-pulse-card`.
- Use TypeScript and Lit.
- Separate the entity resolver, state formatter, command handler, overview,
  controls, details, and visual editor into focused modules.
- Use only Home Assistant entities and services. Never expose, store, or process
  OAuth tokens, command keys, VINs, or direct Fleet API traffic.
- Maintain fixture-based Home Assistant state for deterministic development and
  test coverage.

## Quality Requirements

- Add unit tests for entity resolution, stale and unavailable state handling,
  value formatting, and confirmation policy.
- Add build, type-check, and lint commands suitable for CI.
- Verify the card at desktop and mobile dashboard widths with fixture-backed
  visual checks.
- Include HACS metadata, a README, example YAML, screenshots, release workflow,
  and versioning guidance.

## Delivery Plan

1. Scaffold the HACS frontend project and its build and test pipeline.
2. Implement the Tesla Pulse entity resolver and fixture-backed Home Assistant
   state.
3. Build the overview with distinct charging, parked, unavailable, and cached
   telemetry states.
4. Add quick controls, command confirmations, and pending or error feedback.
5. Add the climate, security, and battery-health detail areas.
6. Build the visual editor, documentation, examples, and responsive screenshot
   checks.
7. Package the first HACS-ready release.

## Key Product Decision

Optimize first for trustworthy live-or-cached vehicle visibility, then layer
controls on top. This honors Tesla Pulse's telemetry-first, sleep-preserving
design and prevents a dashboard from appearing live while showing stale data.