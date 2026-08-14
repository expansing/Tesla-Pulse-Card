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
name: Juniper
icon: car-electric
show_name: true
show_icon: true
show_state: true
entity: sensor.juniper_battery_level
entityMode: manual
themeMode: auto
vehicleColor: red
vehicleScale: 1.1
sensorTapAction: more-info
customSensors:
  - entity: sensor.juniper_coolant_temperature
    label: Coolant
    icon: thermometer
    display: value
    accent: lime
    group: charging
sensorVisuals:
  packVoltage:
    label: HV pack
    icon: flash
    display: value
    accent: violet
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
vehicleModelUrl: /local/my-cybertruck.glb
display:
  compact: false
  showHero: true
  showCharging: true
  showStatus: true
  showControls: true
  showHealth: true
tap_action:
  action: more-info
hold_action:
  action: none
double_tap_action:
  action: none
```

By default, `entityMode` is `auto`: the card resolves Tesla Pulse entities by
their stable unique-ID suffix and accepts individual `entities` overrides. Set
`entityMode: manual` to disable auto-detection and use only entities you select
in the visual editor or declare under `entities`.

## Card Schema

`type` is always `custom:tesla-pulse-card`. Use `entity` for the primary battery
entity, or use `entities` for precise per-value overrides; an explicit
`entities.battery` override takes precedence over `entity`. `name` is the
standard Home Assistant title override; `title` remains supported for existing
dashboards. `icon`, `show_name`, `show_icon`, and `show_state` control the card
header independently.

The card supports standard Home Assistant action objects on its non-control
background: `tap_action`, `hold_action`, and `double_tap_action`. Supported
actions are `more-info`, `toggle`, `call-service`, `navigate`, `url`, and
`none`. Existing vehicle buttons keep their dedicated safety confirmations and
are not intercepted by these background actions.

For sections dashboards, the card advertises a responsive grid size of 3-12
columns and 5-7 rows through Home Assistant `getGridOptions()`.

The systems matrix focuses on useful at-a-glance data: odometer, remaining
energy, battery heater, pack voltage/current, charging input, cable/latch
state, and all four tire pressures. The editor also supports selectable command
entities for wake, lock, climate, sentry, charge-port and window operations,
frunk/trunk, defrost, lights, horn, and preconditioning. Home Assistant
`button` entities are invoked with `button.press` automatically. Adjustable
entities such as charge limit, target temperature, seat heaters, steering-wheel
heat, and Windows open Home Assistant's native detail control.

The card includes an interactive WebGL Cybertruck digital twin with drag
rotation and spatial frunk, trunk, lock, and climate controls. The included
user-owned Cybertruck GLB is bundled into the card resource, so it does not
download vehicle images or models at runtime. `vehicleModelUrl` is optional and
lets you replace the bundled model with a local Home Assistant URL. Spatial
controls appear only when their corresponding Home Assistant entity is
configured or detected.

Set `vehicleColor` to any glossy or matte preset provided by the visual editor.
The card supplies factory, black, white, red, blue, gray, silver, green, and
orange glossy finishes plus matte black, white, gray, blue, green, and red.

Set `vehicleScale` between `0.75` and `1.2` to resize the Cybertruck. The
spatial vehicle controls are recalculated for the selected size. The angle set
by dragging the 3D vehicle is retained when the card refreshes or its
configuration is updated.

Set `themeMode` to `auto`, `black`, or `white`. Auto follows Home Assistant's
current light/dark theme and applies the selected appearance to the entire card.

Set `sensorTapAction` to `more-info` (default) to open Home Assistant's native
entity detail and history graph for telemetry readouts, or `none` to disable
sensor taps.

Use `customSensors` to add any Home Assistant entity to a separate live
telemetry group. Each entry requires `entity`; `label` is optional. Set `icon`
to a Material Design icon name without the `mdi:` prefix. Set `display` to
`value` (formatted value and unit) or `state` (raw entity state), and choose an
`accent` of `ice`, `lime`, `amber`, `rose`, or `violet`. Choose `group` as
`environment`, `highVoltage`, or `charging` to place the row with related
telemetry. The visual editor provides equivalent add, label, display, icon,
accent, group, and remove controls.

Use `sensorVisuals` to override the same label, icon, display, and accent
settings for built-in telemetry rows. Its keys are the existing sensor names,
such as `packVoltage`, `chargePower`, or `insideTemperature`.

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