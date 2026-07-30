# Tesla Pulse Card

Tesla Pulse Card is a Home Assistant Lovelace dashboard card designed for the
Tesla Pulse integration. It presents live or cached telemetry clearly, keeps
routine vehicle controls close at hand, and asks for confirmation before actions
that could create a security or safety concern.

## Current Status

The first implementation slice includes the responsive dashboard shell,
automatic Tesla Pulse entity suffix resolution, telemetry freshness messaging,
charging metrics, quick controls, and confirmation dialogs for unlocking and
opening cargo areas.

## Development Preview

Open `preview/index.html` in a browser. It uses fixture Home Assistant state and
loads the same card resource shipped from `tesla-pulse-card.js`.

## Installation

### Option 1: HACS (Recommended)

1. Open Home Assistant and go to **HACS** → **Frontend**.
2. Click **Explore & Download Repositories** and search for **Tesla Pulse Card**.
3. Click **Install**.
4. Restart Home Assistant or reload the Lovelace dashboards:
   - Developer Tools → YAML → **Reload custom cards**
5. Add the card to your dashboard.

### Option 2: Manual Installation

1. Copy `tesla-pulse-card.js` to your Home Assistant `config/www/` folder.
2. In Home Assistant, go to **Settings** → **Dashboards** → **Resources** (top right).
3. Click **Create Resource** and add:
   - **URL**: `/local/tesla-pulse-card.js`
   - **Resource type**: `JavaScript Module`
4. Reload your browser.
5. Add the card to your dashboard by selecting **Custom: Tesla Pulse Card**.

## Home Assistant Configuration

Configuration works in both places:

- Home Assistant visual card editor (recommended for title,
  confirmations, display options, quick actions, and common entity overrides)
- YAML editor (full manual control)

```yaml
type: custom:tesla-pulse-card
title: Juniper
entityMode: manual
themeMode: auto
confirmations:
  unlock: true
  cargo: true
entities:
  battery: sensor.juniper_battery_level
  range: sensor.juniper_battery_range
  chargeLimit: number.juniper_charge_limit
  telemetry: sensor.juniper_telemetry_status
  vehicleAwake: sensor.juniper_vehicle_awake_status
  odometer: sensor.juniper_odometer
  frontLeftTirePressure: sensor.juniper_front_left_tire_pressure
  wake: button.juniper_wake_up
  honk: button.juniper_honk_horn
quickActions:
  - lock
  - climate
  - sentry
  - wake
  - honk
display:
  compact: false
  showHero: true
  showCharging: true
  showStatus: true
  showControls: true
  showHealth: true
```

By default, `entityMode` is `auto`: the card resolves Tesla Pulse entities by
their stable unique-ID suffix and accepts individual `entities` overrides. Set
`entityMode: manual` to disable auto-detection and use only entities you select
in the visual editor or declare under `entities`.

The systems matrix focuses on useful at-a-glance data: odometer, remaining
energy, battery heater, pack voltage/current, charging input, cable/latch
state, and all four tire pressures. The editor also supports selectable command
entities for wake, lock, climate, sentry, charge-port and window operations,
frunk/trunk, defrost, lights, horn, preconditioning, and fart. Home Assistant
`button` entities are invoked with `button.press` automatically. Adjustable
entities such as charge limit, target temperature, seat heaters, steering-wheel
heat, and Windows open Home Assistant's native detail control.

The card includes a local, interactive WebGL Model 3-style digital twin with
drag rotation and spatial frunk, trunk, lock, and climate controls. It does
not load a vehicle image or external model at runtime. Spatial controls appear
only when their corresponding Home Assistant entity is configured or detected.

Set `themeMode` to `auto`, `black`, or `white`. Auto follows Home Assistant's
current light/dark theme and applies the selected appearance to the entire card.

## HACS Release Flow

- Validation workflow: `.github/workflows/validate.yml`
- Release workflow: `.github/workflows/release.yml`
- Release checklist: `RELEASE.md`

Create a tag in semantic format, for example `v0.1.0`, and push tags to trigger
an automated GitHub release for HACS distribution.

## Safety and Privacy

The card communicates exclusively through Home Assistant entity services. It
does not store or process Tesla credentials, command keys, VINs, or Fleet API
tokens, and it never wakes the vehicle while rendering.