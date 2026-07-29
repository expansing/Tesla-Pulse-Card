const CARD_TYPE = "tesla-pulse-card";

const ENTITY_SUFFIXES = {
  battery: "battery_level",
  range: "battery_range",
  chargeLimit: "charge_limit",
  chargeState: "charging_state",
  chargePower: "charge_power",
  chargeRate: "charge_rate",
  timeToFull: "time_to_full_charge",
  lock: "lock",
  climate: "climate",
  sentry: "sentry_mode",
  chargePort: "charge_port",
  windows: "windows",
  trunk: ["trunk", "rear_trunk"],
  frunk: ["frunk", "front_trunk"],
  insideTemperature: "inside_temp",
  outsideTemperature: "outside_temp",
  telemetry: "telemetry_status",
  batteryBalance: "battery_balance_score",
  voltageImbalance: "brick_voltage_imbalance",
};

const DEFAULT_CONFIG = {
  title: "Tesla",
  image: "",
  entities: {},
  quickActions: ["lock", "climate", "sentry", "chargePort", "frunk", "trunk"],
  display: {
    compact: false,
    showHero: true,
    showCharging: true,
    showStatus: true,
    showControls: true,
    showHealth: true,
  },
  confirmations: {
    unlock: true,
    cargo: true,
  },
};

const ACTION_DEFINITIONS = {
  lock: { label: "Lock", icon: "lock" },
  climate: { label: "Climate", icon: "fan" },
  sentry: { label: "Sentry", icon: "shield-car" },
  chargePort: { label: "Charge port", icon: "ev-plug-ccs2" },
  frunk: { label: "Frunk", icon: "car-front" },
  trunk: { label: "Trunk", icon: "car-back" },
};

class TeslaPulseCard extends HTMLElement {
  static async getConfigElement() {
    return document.createElement("tesla-pulse-card-editor");
  }

  static getStubConfig() {
    return {
      title: "Tesla",
      quickActions: [...DEFAULT_CONFIG.quickActions],
      display: { ...DEFAULT_CONFIG.display },
      confirmations: {
        unlock: true,
        cargo: true,
      },
    };
  }

  setConfig(config) {
    if (!config || typeof config !== "object") {
      throw new Error("Tesla Pulse Card requires a configuration object.");
    }

    this._config = {
      ...DEFAULT_CONFIG,
      ...config,
      entities: { ...DEFAULT_CONFIG.entities, ...(config.entities || {}) },
      quickActions: this._sanitizeQuickActions(config.quickActions),
      display: {
        ...DEFAULT_CONFIG.display,
        ...(config.display || {}),
      },
      confirmations: {
        ...DEFAULT_CONFIG.confirmations,
        ...(config.confirmations || {}),
      },
    };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  getCardSize() {
    return 7;
  }

  _entityId(key) {
    const configuredEntity = this._config?.entities?.[key];
    if (configuredEntity) {
      return configuredEntity;
    }

    const suffixes = ENTITY_SUFFIXES[key];
    if (!suffixes || !this._hass?.states) {
      return undefined;
    }

    for (const suffix of Array.isArray(suffixes) ? suffixes : [suffixes]) {
      const entityId = Object.keys(this._hass.states).find((candidate) =>
        candidate.endsWith(`_${suffix}`),
      );
      if (entityId) {
        return entityId;
      }
    }
    return undefined;
  }

  _state(key) {
    const entityId = this._entityId(key);
    return entityId ? this._hass?.states?.[entityId] : undefined;
  }

  _number(key) {
    const value = Number.parseFloat(this._state(key)?.state ?? "");
    return Number.isFinite(value) ? value : undefined;
  }

  _value(key, fallback = "Unavailable") {
    const state = this._state(key);
    if (!state || ["unknown", "unavailable", "none"].includes(state.state)) {
      return fallback;
    }
    const unit = state.attributes?.unit_of_measurement;
    return unit ? `${state.state} ${unit}` : state.state;
  }

  _isOn(key) {
    const state = this._state(key)?.state;
    return ["on", "open", "heat_cool", "charging"].includes(state);
  }

  _isLocked() {
    return this._state("lock")?.state === "locked";
  }

  _telemetry() {
    const telemetry = this._state("telemetry");
    const lastReceived = telemetry?.attributes?.last_received;
    if (!telemetry || !lastReceived) {
      return { label: "No telemetry", state: "missing", detail: "No received record" };
    }

    const receivedAt = new Date(lastReceived);
    const elapsedMinutes = Math.max(0, Math.round((Date.now() - receivedAt.getTime()) / 60000));
    const isLive = telemetry.state === "receiving" && elapsedMinutes <= 5;
    return {
      label: isLive ? "Live telemetry" : "Cached telemetry",
      state: isLive ? "live" : "cached",
      detail: elapsedMinutes === 0 ? "Updated just now" : `Updated ${elapsedMinutes} min ago`,
    };
  }

  _statusTone(active, alert = false) {
    return active ? "is-active" : alert ? "is-alert" : "";
  }

  _sanitizeQuickActions(actions) {
    const list = Array.isArray(actions) ? actions : DEFAULT_CONFIG.quickActions;
    const allowed = Object.keys(ACTION_DEFINITIONS);
    const filtered = list.filter((action, index) =>
      typeof action === "string" &&
      allowed.includes(action) &&
      list.indexOf(action) === index,
    );
    return filtered.length > 0 ? filtered : [...DEFAULT_CONFIG.quickActions];
  }

  _controlMarkup(action) {
    const definition = ACTION_DEFINITIONS[action];
    if (!definition) {
      return "";
    }
    if (action === "lock") {
      return this._control("lock", definition.icon, this._isLocked() ? "Unlock" : "Lock", this._isLocked());
    }
    return this._control(action, definition.icon, definition.label, this._isOn(action));
  }

  _render() {
    if (!this._config) {
      return;
    }
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
    }

    const battery = this._number("battery");
    const range = this._number("range");
    const chargeLimit = this._number("chargeLimit");
    const chargeState = this._value("chargeState", "Disconnected");
    const isCharging = chargeState.toLowerCase() === "charging";
    const telemetry = this._telemetry();
    const display = this._config.display || DEFAULT_CONFIG.display;
    const quickActions = this._sanitizeQuickActions(this._config.quickActions);
    const batteryProgress = Math.min(100, Math.max(0, battery ?? 0));
    const chargeLimitProgress = Math.min(100, Math.max(0, chargeLimit ?? 0));
    const imageMarkup = this._config.image
      ? `<img class="vehicle-image" src="${this._escape(this._config.image)}" alt="${this._escape(this._config.title)}" />`
      : `<div class="vehicle-fallback" aria-label="Vehicle image unavailable"><span>TESLA</span><strong>VEHICLE</strong></div>`;

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; color: var(--primary-text-color, #1f2522); }
        * { box-sizing: border-box; }
        button { font: inherit; }
        .card {
          --surface: var(--ha-card-background, var(--card-background-color, #f7f7f3));
          --surface-muted: color-mix(in srgb, var(--surface) 91%, #56635d);
          --line: color-mix(in srgb, var(--primary-text-color, #1f2522) 13%, transparent);
          --muted: var(--secondary-text-color, #68716c);
          --accent: #118f6a;
          --accent-soft: color-mix(in srgb, var(--accent) 13%, transparent);
          --warning: #b96916;
          --danger: #b53e31;
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 8px;
          box-shadow: var(--ha-card-box-shadow, 0 2px 10px rgba(21, 31, 26, 0.08));
          overflow: hidden;
        }
        .card.compact .topline { padding-top: 14px; }
        .card.compact .hero { min-height: 138px; }
        .card.compact .vehicle-image,
        .card.compact .vehicle-fallback { height: 138px; }
        .card.compact .metrics { padding-top: 12px; padding-bottom: 12px; }
        .card.compact .metric-value { font-size: 26px; }
        .card.compact .section { padding-top: 14px; padding-bottom: 14px; }
        .card.compact .status { min-height: 62px; }
        .card.compact .control { min-height: 66px; }
        .card.compact .detail { min-height: 66px; padding-top: 12px; padding-bottom: 12px; }
        .topline, .metrics, .status-grid, .controls, .detail-grid { display: grid; }
        .topline {
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 16px;
          align-items: start;
          padding: 20px 20px 0;
        }
        .eyebrow, .status-label, .metric-label, .detail-label {
          color: var(--muted);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0;
          text-transform: uppercase;
        }
        h1 { margin: 4px 0 0; font-size: 23px; line-height: 1.15; letter-spacing: 0; }
        .telemetry {
          display: grid;
          gap: 3px;
          justify-items: end;
          color: var(--muted);
          font-size: 12px;
          text-align: right;
        }
        .telemetry-label { color: var(--warning); font-weight: 700; }
        .telemetry.live .telemetry-label { color: var(--accent); }
        .hero {
          position: relative;
          min-height: 172px;
          margin: 16px 20px 0;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 7px;
          background-color: var(--surface-muted);
          background-image: linear-gradient(90deg, var(--line) 1px, transparent 1px), linear-gradient(var(--line) 1px, transparent 1px);
          background-position: center;
          background-size: 28px 28px;
        }
        .vehicle-image { width: 100%; height: 172px; display: block; object-fit: cover; object-position: center 59%; filter: saturate(0.86) contrast(1.03); }
        .vehicle-fallback { height: 172px; display: grid; place-content: center; text-align: center; color: var(--muted); }
        .vehicle-fallback span { font-size: 11px; font-weight: 700; letter-spacing: 0; }
        .vehicle-fallback strong { margin-top: 8px; font-size: 25px; letter-spacing: 0; }
        .hero-status {
          position: absolute;
          left: 12px;
          bottom: 12px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 8px;
          color: #f7fbf8;
          background: rgba(21, 31, 26, 0.77);
          border-radius: 4px;
          font-size: 12px;
          font-weight: 700;
        }
        .signal { width: 7px; height: 7px; border-radius: 50%; background: #d48b2a; }
        .is-charging .signal { background: #45d49b; }
        .metrics { grid-template-columns: 1fr 1fr; padding: 18px 20px; gap: 12px; }
        .metric + .metric { border-left: 1px solid var(--line); padding-left: 16px; }
        .metric-value { margin-top: 3px; font-size: 30px; font-weight: 700; line-height: 1; letter-spacing: 0; }
        .metric-value span { color: var(--muted); font-size: 14px; font-weight: 600; }
        .battery-track { position: relative; height: 10px; margin: 0 20px; overflow: visible; border-radius: 3px; background: var(--line); }
        .battery-level { height: 100%; width: ${batteryProgress}%; min-width: ${battery === undefined ? 0 : 4}px; border-radius: inherit; background: ${isCharging ? "var(--accent)" : "var(--primary-text-color, #1f2522)"}; transition: width 180ms ease-out; }
        .charge-limit { position: absolute; top: -5px; left: calc(${chargeLimitProgress}% - 1px); width: 2px; height: 20px; background: var(--warning); }
        .charge-copy { display: flex; justify-content: space-between; gap: 12px; padding: 9px 20px 18px; color: var(--muted); font-size: 13px; }
        .charge-copy strong { color: var(--primary-text-color, #1f2522); font-weight: 700; }
        .charging-readout { padding: 14px 20px 17px; border-top: 1px solid var(--line); background: var(--accent-soft); }
        .charging-readout[hidden] { display: none; }
        .charging-values { display: flex; flex-wrap: wrap; gap: 8px 18px; margin-top: 6px; color: var(--primary-text-color, #1f2522); font-size: 14px; font-weight: 650; }
        .section { padding: 18px 20px; border-top: 1px solid var(--line); }
        .section-heading { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin: 0 0 12px; }
        h2 { margin: 0; font-size: 15px; letter-spacing: 0; }
        .status-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
        .status { min-height: 73px; padding: 10px; border: 1px solid var(--line); border-radius: 6px; background: var(--surface-muted); }
        .status-value { display: block; margin-top: 8px; overflow: hidden; font-size: 14px; font-weight: 700; text-overflow: ellipsis; white-space: nowrap; }
        .status.is-active .status-value { color: var(--accent); }
        .status.is-alert .status-value { color: var(--danger); }
        .controls { grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 8px; }
        .control {
          min-height: 76px;
          padding: 10px 7px;
          color: var(--primary-text-color, #1f2522);
          cursor: pointer;
          border: 1px solid var(--line);
          border-radius: 6px;
          background: transparent;
          transition: background-color 120ms ease-out, border-color 120ms ease-out;
        }
        .control:hover { border-color: color-mix(in srgb, var(--accent) 55%, var(--line)); background: var(--accent-soft); }
        .control:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
        .control ha-icon { display: block; width: 23px; height: 23px; margin: 0 auto 8px; color: var(--muted); }
        .control.is-active ha-icon { color: var(--accent); }
        .control-label { display: block; overflow: hidden; font-size: 12px; font-weight: 700; text-align: center; text-overflow: ellipsis; white-space: nowrap; }
        .detail-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; border-top: 1px solid var(--line); background: var(--line); }
        .detail { min-height: 75px; padding: 15px 20px; background: var(--surface); }
        .detail-value { display: block; margin-top: 7px; font-size: 16px; font-weight: 700; }
        .dialog-backdrop { position: fixed; inset: 0; z-index: 10; display: grid; place-items: center; padding: 20px; background: rgba(23, 29, 26, 0.5); }
        .dialog { width: min(360px, 100%); padding: 20px; border-radius: 8px; background: var(--surface); box-shadow: 0 14px 42px rgba(0, 0, 0, 0.28); }
        .dialog h2 { font-size: 18px; }
        .dialog p { margin: 8px 0 18px; color: var(--muted); font-size: 14px; line-height: 1.45; }
        .dialog-actions { display: flex; justify-content: flex-end; gap: 8px; }
        .dialog-actions button { min-height: 38px; padding: 0 13px; cursor: pointer; border: 1px solid var(--line); border-radius: 5px; background: transparent; color: var(--primary-text-color, #1f2522); font-weight: 700; }
        .dialog-actions .danger { border-color: var(--danger); background: var(--danger); color: white; }
        @media (max-width: 480px) {
          .topline { padding: 16px 16px 0; }
          .hero { margin: 14px 16px 0; }
          .metrics, .section { padding-left: 16px; padding-right: 16px; }
          .battery-track { margin-left: 16px; margin-right: 16px; }
          .charge-copy, .charging-readout { padding-left: 16px; padding-right: 16px; }
          .status-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .controls { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
      </style>
      <article class="card ${display.compact ? "compact" : ""}" aria-label="${this._escape(this._config.title)} dashboard">
        <header class="topline">
          <div><span class="eyebrow">Tesla Pulse</span><h1>${this._escape(this._config.title)}</h1></div>
          <div class="telemetry ${telemetry.state}"><span class="telemetry-label">${telemetry.label}</span><span>${telemetry.detail}</span></div>
        </header>
        <div class="hero" ${display.showHero ? "" : "hidden"}>
          ${imageMarkup}
          <span class="hero-status ${isCharging ? "is-charging" : ""}"><i class="signal"></i>${isCharging ? "Charging" : "Parked"}</span>
        </div>
        <section class="metrics" aria-label="Energy overview">
          <div class="metric"><span class="metric-label">State of charge</span><div class="metric-value">${battery === undefined ? "--" : Math.round(battery)}<span>%</span></div></div>
          <div class="metric"><span class="metric-label">Estimated range</span><div class="metric-value">${range === undefined ? "--" : Math.round(range)}<span>${range === undefined ? "" : " km"}</span></div></div>
        </section>
        <div class="battery-track" aria-label="Battery level ${batteryProgress} percent"><div class="battery-level"></div>${chargeLimit === undefined ? "" : `<span class="charge-limit" title="Charge limit ${Math.round(chargeLimit)} percent"></span>`}</div>
        <div class="charge-copy"><span><strong>${this._escape(chargeState)}</strong></span><span>${chargeLimit === undefined ? "No charge limit" : `Limit ${Math.round(chargeLimit)}%`}</span></div>
        <section class="charging-readout" ${(isCharging && display.showCharging) ? "" : "hidden"} aria-label="Charging details">
          <span class="status-label">Charging session</span>
          <div class="charging-values"><span>${this._escape(this._value("chargePower", "Power unavailable"))}</span><span>${this._escape(this._value("chargeRate", "Rate unavailable"))}</span><span>${this._escape(this._value("timeToFull", "ETA unavailable"))}</span></div>
        </section>
        <section class="section" ${display.showStatus ? "" : "hidden"}>
          <div class="section-heading"><h2>Vehicle at a glance</h2></div>
          <div class="status-grid">
            <div class="status ${this._statusTone(this._isOn("climate"))}"><span class="status-label">Climate</span><span class="status-value">${this._isOn("climate") ? "Running" : this._value("insideTemperature", "Off")}</span></div>
            <div class="status ${this._statusTone(!this._isLocked(), !this._isLocked())}"><span class="status-label">Doors</span><span class="status-value">${this._isLocked() ? "Locked" : "Unlocked"}</span></div>
            <div class="status ${this._statusTone(this._isOn("sentry"))}"><span class="status-label">Sentry</span><span class="status-value">${this._isOn("sentry") ? "Armed" : "Off"}</span></div>
            <div class="status ${this._statusTone(this._isOn("windows"), this._isOn("windows"))}"><span class="status-label">Windows</span><span class="status-value">${this._isOn("windows") ? "Open" : "Closed"}</span></div>
          </div>
        </section>
        <section class="section" ${display.showControls ? "" : "hidden"}>
          <div class="section-heading"><h2>Quick controls</h2><span class="status-label">Commands may take a moment</span></div>
          <div class="controls">
            ${quickActions.map((action) => this._controlMarkup(action)).join("")}
          </div>
        </section>
        <section class="detail-grid" aria-label="Vehicle health" ${display.showHealth ? "" : "hidden"}>
          <div class="detail"><span class="detail-label">Battery balance</span><span class="detail-value">${this._escape(this._value("batteryBalance", "Not received"))}</span></div>
          <div class="detail"><span class="detail-label">Voltage imbalance</span><span class="detail-value">${this._escape(this._value("voltageImbalance", "Not received"))}</span></div>
          <div class="detail"><span class="detail-label">Cabin temperature</span><span class="detail-value">${this._escape(this._value("insideTemperature", "Not received"))}</span></div>
          <div class="detail"><span class="detail-label">Outside temperature</span><span class="detail-value">${this._escape(this._value("outsideTemperature", "Not received"))}</span></div>
        </section>
        ${this._pendingAction ? this._confirmationMarkup() : ""}
      </article>
    `;
    this._bindEvents();
  }

  _control(action, icon, label, active) {
    return `<button class="control ${active ? "is-active" : ""}" type="button" data-action="${action}" aria-label="${label}"><ha-icon icon="mdi:${icon}"></ha-icon><span class="control-label">${label}</span></button>`;
  }

  _confirmationMarkup() {
    return `<div class="dialog-backdrop" role="presentation"><section class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title"><h2 id="confirm-title">Confirm ${this._escape(this._pendingAction.label)}</h2><p>${this._escape(this._pendingAction.message)}</p><div class="dialog-actions"><button type="button" data-dialog-action="cancel">Cancel</button><button class="danger" type="button" data-dialog-action="confirm">Confirm</button></div></section></div>`;
  }

  _bindEvents() {
    this.shadowRoot.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => this._handleAction(button.dataset.action));
    });
    this.shadowRoot.querySelectorAll("[data-dialog-action]").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.dialogAction === "confirm") {
          this._executeAction(this._pendingAction.action);
        }
        this._pendingAction = undefined;
        this._render();
      });
    });
    const vehicleImage = this.shadowRoot.querySelector(".vehicle-image");
    vehicleImage?.addEventListener("error", () => {
      const fallback = document.createElement("div");
      fallback.className = "vehicle-fallback";
      fallback.setAttribute("aria-label", "Vehicle image unavailable");
      fallback.innerHTML = "<span>TESLA</span><strong>VEHICLE</strong>";
      vehicleImage.replaceWith(fallback);
    });
  }

  _handleAction(action) {
    const actionMetadata = {
      lock: {
        label: "unlock",
        message: "This will unlock the vehicle.",
        requiresConfirmation: !this._isLocked() ? false : this._config.confirmations.unlock,
      },
      frunk: { label: "open frunk", message: "This will open the front trunk.", requiresConfirmation: this._config.confirmations.cargo },
      trunk: { label: "open trunk", message: "This will open the rear trunk.", requiresConfirmation: this._config.confirmations.cargo },
    }[action];

    if (actionMetadata?.requiresConfirmation) {
      this._pendingAction = { action, ...actionMetadata };
      this._render();
      return;
    }
    this._executeAction(action);
  }

  _executeAction(action) {
    const entityId = this._entityId(action);
    if (!entityId || !this._hass?.callService) {
      return;
    }

    const serviceByAction = {
      lock: ["lock", this._isLocked() ? "unlock" : "lock"],
      climate: ["climate", this._isOn("climate") ? "turn_off" : "turn_on"],
      sentry: ["switch", this._isOn("sentry") ? "turn_off" : "turn_on"],
      chargePort: ["switch", this._isOn("chargePort") ? "turn_off" : "turn_on"],
      frunk: ["cover", "open_cover"],
      trunk: ["cover", "open_cover"],
    };
    const service = serviceByAction[action];
    if (!service) {
      return;
    }

    this._hass.callService(service[0], service[1], { entity_id: entityId });
  }

  _escape(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#039;",
      "\"": "&quot;",
    })[character]);
  }
}

customElements.define(CARD_TYPE, TeslaPulseCard);

const EDITOR_ENTITY_FIELDS = [
  ["battery", "Battery level entity"],
  ["range", "Range entity"],
  ["chargeLimit", "Charge limit entity"],
  ["telemetry", "Telemetry status entity"],
  ["lock", "Door lock entity"],
  ["climate", "Climate entity"],
];

const EDITOR_DISPLAY_FIELDS = [
  ["compact", "Compact mode"],
  ["showHero", "Show vehicle image"],
  ["showCharging", "Show charging session details"],
  ["showStatus", "Show vehicle status section"],
  ["showControls", "Show quick controls section"],
  ["showHealth", "Show health detail section"],
];

class TeslaPulseCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = {
      ...DEFAULT_CONFIG,
      ...config,
      entities: { ...DEFAULT_CONFIG.entities, ...(config?.entities || {}) },
      quickActions: Array.isArray(config?.quickActions)
        ? (config.quickActions.length ? config.quickActions : [...DEFAULT_CONFIG.quickActions])
        : [...DEFAULT_CONFIG.quickActions],
      display: {
        ...DEFAULT_CONFIG.display,
        ...(config?.display || {}),
      },
      confirmations: {
        ...DEFAULT_CONFIG.confirmations,
        ...(config?.confirmations || {}),
      },
    };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
  }

  _render() {
    if (!this._config) {
      return;
    }
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .editor {
          display: grid;
          gap: 14px;
          padding: 16px;
          border: 1px solid var(--divider-color, #c7cfcb);
          border-radius: 8px;
          background: var(--card-background-color, #fff);
        }
        h3 {
          margin: 0;
          font-size: 15px;
          color: var(--primary-text-color, #1f2522);
        }
        .grid {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .field {
          display: grid;
          gap: 6px;
        }
        .field.full {
          grid-column: 1 / -1;
        }
        label {
          font-size: 12px;
          font-weight: 700;
          color: var(--secondary-text-color, #68716c);
        }
        input[type="text"] {
          width: 100%;
          min-height: 38px;
          padding: 0 10px;
          border: 1px solid var(--divider-color, #c7cfcb);
          border-radius: 6px;
          background: var(--card-background-color, #fff);
          color: var(--primary-text-color, #1f2522);
          font: inherit;
        }
        .toggle-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .toggle {
          display: inline-flex;
          gap: 8px;
          align-items: center;
          font-size: 13px;
          color: var(--primary-text-color, #1f2522);
        }
        .hint {
          margin: 0;
          font-size: 12px;
          color: var(--secondary-text-color, #68716c);
        }
        .check-grid {
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        @media (max-width: 680px) {
          .grid { grid-template-columns: 1fr; }
          .check-grid { grid-template-columns: 1fr; }
        }
      </style>
      <section class="editor">
        <h3>Tesla Pulse Card</h3>
        <div class="grid">
          <div class="field">
            <label for="title">Card title</label>
            <input id="title" type="text" data-key="title" value="${this._escape(this._config.title || "")}" />
          </div>
          <div class="field">
            <label for="image">Vehicle image URL</label>
            <input id="image" type="text" data-key="image" value="${this._escape(this._config.image || "")}" />
          </div>
        </div>

        <div class="field full">
          <label>Confirmations</label>
          <div class="toggle-row">
            <label class="toggle"><input type="checkbox" data-confirmation-key="unlock" ${this._config.confirmations.unlock ? "checked" : ""} /> Confirm unlock</label>
            <label class="toggle"><input type="checkbox" data-confirmation-key="cargo" ${this._config.confirmations.cargo ? "checked" : ""} /> Confirm frunk and trunk</label>
          </div>
        </div>

        <div class="field full">
          <label>Display options</label>
          <div class="check-grid">
            ${EDITOR_DISPLAY_FIELDS.map(([key, label]) => `
              <label class="toggle"><input type="checkbox" data-display-key="${key}" ${this._config.display[key] ? "checked" : ""} /> ${label}</label>
            `).join("")}
          </div>
        </div>

        <div class="field full">
          <label>Quick actions</label>
          <div class="check-grid">
            ${Object.entries(ACTION_DEFINITIONS).map(([key, definition]) => `
              <label class="toggle"><input type="checkbox" data-action-key="${key}" ${this._config.quickActions.includes(key) ? "checked" : ""} /> ${definition.label}</label>
            `).join("")}
          </div>
        </div>

        <div class="grid">
          ${EDITOR_ENTITY_FIELDS.map(([key, label]) => `
            <div class="field">
              <label for="entity-${key}">${label}</label>
              <input id="entity-${key}" type="text" data-entity-key="${key}" value="${this._escape(this._config.entities[key] || "")}" placeholder="Auto-detect if empty" />
            </div>
          `).join("")}
        </div>
        <p class="hint">Leave entity fields empty to use Tesla Pulse auto-detection by suffix. YAML remains fully supported for advanced options.</p>
      </section>
    `;

    this.shadowRoot.querySelectorAll("input[data-key]").forEach((input) => {
      input.addEventListener("input", (event) => {
        this._updateConfig(event.target.dataset.key, event.target.value.trim());
      });
    });

    this.shadowRoot.querySelectorAll("input[data-confirmation-key]").forEach((input) => {
      input.addEventListener("change", (event) => {
        const key = event.target.dataset.confirmationKey;
        const checked = Boolean(event.target.checked);
        this._updateNestedConfig("confirmations", key, checked);
      });
    });

    this.shadowRoot.querySelectorAll("input[data-display-key]").forEach((input) => {
      input.addEventListener("change", (event) => {
        const key = event.target.dataset.displayKey;
        const checked = Boolean(event.target.checked);
        this._updateNestedConfig("display", key, checked);
      });
    });

    this.shadowRoot.querySelectorAll("input[data-action-key]").forEach((input) => {
      input.addEventListener("change", (event) => {
        const key = event.target.dataset.actionKey;
        const next = new Set(this._config.quickActions || []);
        if (event.target.checked) {
          next.add(key);
        } else {
          next.delete(key);
        }
        const sanitizedActions = Object.keys(ACTION_DEFINITIONS).filter((action) => next.has(action));
        const updated = {
          ...this._config,
          quickActions: sanitizedActions.length ? sanitizedActions : [...DEFAULT_CONFIG.quickActions],
        };
        this._emitConfig(updated);
      });
    });

    this.shadowRoot.querySelectorAll("input[data-entity-key]").forEach((input) => {
      input.addEventListener("input", (event) => {
        const key = event.target.dataset.entityKey;
        const value = event.target.value.trim();
        this._updateEntityConfig(key, value);
      });
    });
  }

  _updateConfig(key, value) {
    const updated = { ...this._config };
    if (value) {
      updated[key] = value;
    } else {
      delete updated[key];
    }
    this._emitConfig(updated);
  }

  _updateNestedConfig(group, key, value) {
    const updated = {
      ...this._config,
      [group]: {
        ...(this._config[group] || {}),
        [key]: value,
      },
    };
    this._emitConfig(updated);
  }

  _updateEntityConfig(key, value) {
    const entities = { ...(this._config.entities || {}) };
    if (value) {
      entities[key] = value;
    } else {
      delete entities[key];
    }
    const updated = { ...this._config, entities };
    if (Object.keys(entities).length === 0) {
      delete updated.entities;
    }
    this._emitConfig(updated);
  }

  _emitConfig(config) {
    this._config = config;
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config },
      bubbles: true,
      composed: true,
    }));
  }

  _escape(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#039;",
      "\"": "&quot;",
    })[character]);
  }
}

if (!customElements.get("tesla-pulse-card")) {
  customElements.define("tesla-pulse-card", TeslaPulseCard);
}
if (!customElements.get("tesla-pulse-card-editor")) {
  customElements.define("tesla-pulse-card-editor", TeslaPulseCardEditor);
}

window.customCards = window.customCards || [];
if (!window.customCards.some(card => card.type === `custom:${CARD_TYPE}`)) {
  window.customCards.push({
    type: `custom:${CARD_TYPE}`,
    name: "Tesla Pulse Card",
    description: "Tesla Pulse-aware vehicle dashboard",
    preview: true,
  });
}