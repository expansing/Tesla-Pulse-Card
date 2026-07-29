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

- Home Assistant visual card editor (recommended for title, image,
  confirmations, display options, quick actions, and common entity overrides)
- YAML editor (full manual control)

```yaml
type: custom:tesla-pulse-card
title: Juniper
image: /local/vehicles/juniper.jpg
confirmations:
  unlock: true
  cargo: true
entities:
  battery: sensor.juniper_battery_level
  range: sensor.juniper_battery_range
  chargeLimit: number.juniper_charge_limit
  telemetry: sensor.juniper_telemetry_status
quickActions:
  - lock
  - climate
  - sentry
display:
  compact: false
  showHero: true
  showCharging: true
  showStatus: true
  showControls: true
  showHealth: true
```

The card resolves the remaining Tesla Pulse entities by their stable unique-ID
suffix where possible. Add an `entities` override for any entity whose ID does
not match the integration default.

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