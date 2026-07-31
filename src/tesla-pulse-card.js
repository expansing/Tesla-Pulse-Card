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
  vehicleAwake: "vehicle_awake_status",
  batteryBalance: "battery_balance_score",
  voltageImbalance: "brick_voltage_imbalance",
  odometer: "odometer",
  energyRemaining: "energy_remaining",
  packVoltage: "pack_voltage",
  packCurrent: "pack_current",
  chargeCurrent: "charge_current",
  chargerVoltage: "charger_voltage",
  chargeEnergyAdded: "charge_energy_added",
  chargingCableType: "charging_cable_type",
  chargePortLatch: "charge_port_latch",
  batteryHeater: "battery_heater_on",
  frontLeftTirePressure: "front_left_tire_pressure",
  frontRightTirePressure: "front_right_tire_pressure",
  rearLeftTirePressure: "rear_left_tire_pressure",
  rearRightTirePressure: "rear_right_tire_pressure",
  wake: "wake_up",
  openChargePort: "open_charge_port",
  openFrunk: "open_frunk",
  openTrunk: "open_trunk",
  defrost: "defrost",
  flashLights: "flash_lights",
  honk: "honk_horn",
  closeChargePort: "close_charge_port",
  ventWindows: "vent_windows",
  closeWindows: "close_windows",
  startPreconditioning: "start_battery_preconditioning",
  stopPreconditioning: "stop_battery_preconditioning",
  targetTemperature: "target_temperature",
  frontLeftSeatHeater: "front_left_seat_heater",
  frontRightSeatHeater: "front_right_seat_heater",
  rearLeftSeatHeater: "rear_left_seat_heater",
  rearRightSeatHeater: "rear_right_seat_heater",
  steeringWheelHeater: "steering_wheel_heater",
};

const DEFAULT_CONFIG = {
  title: "Tesla",
  entities: {},
  entityMode: "auto",
  themeMode: "auto",
  vehicleColor: "black",
  vehicleScale: 1,
  sensorTapAction: "more-info",
  sensorVisuals: {},
  customSensors: [],
  quickActions: ["sentry", "chargePort", "wake", "honk", "flashLights", "defrost"],
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
  chargeLimit: { label: "Charge limit", icon: "battery-charging-80", moreInfo: true },
  lock: { label: "Lock", icon: "lock" },
  climate: { label: "Climate", icon: "fan" },
  sentry: { label: "Sentry", icon: "shield-car" },
  chargePort: { label: "Open charge port", icon: "ev-plug-ccs2" },
  openChargePort: { label: "Open charge port", icon: "ev-plug-ccs2" },
  closeChargePort: { label: "Close charge port", icon: "ev-plug-type2" },
  frunk: { label: "Open frunk", icon: "car" },
  openFrunk: { label: "Open frunk", icon: "car" },
  trunk: { label: "Open trunk", icon: "car-back" },
  openTrunk: { label: "Open trunk", icon: "car-back" },
  windows: { label: "Windows", icon: "car-door", moreInfo: true },
  ventWindows: { label: "Vent windows", icon: "car-door" },
  closeWindows: { label: "Close windows", icon: "car-door-lock" },
  defrost: { label: "Defrost", icon: "car-defrost-front" },
  flashLights: { label: "Flash lights", icon: "car-light-high" },
  honk: { label: "Honk horn", icon: "bullhorn" },
  wake: { label: "Wake up", icon: "power" },
  startPreconditioning: { label: "Start preconditioning", icon: "battery-heart-variant" },
  stopPreconditioning: { label: "Stop preconditioning", icon: "battery-off-outline" },
  targetTemperature: { label: "Target temperature", icon: "thermometer", moreInfo: true },
  frontLeftSeatHeater: { label: "Front left seat", icon: "car-seat-heater", moreInfo: true },
  frontRightSeatHeater: { label: "Front right seat", icon: "car-seat-heater", moreInfo: true },
  rearLeftSeatHeater: { label: "Rear left seat", icon: "car-seat-heater", moreInfo: true },
  rearRightSeatHeater: { label: "Rear right seat", icon: "car-seat-heater", moreInfo: true },
  steeringWheelHeater: { label: "Steering wheel heat", icon: "steering", moreInfo: true },
};

const SPATIAL_ACTIONS = new Set(["lock", "climate", "frunk", "openFrunk", "trunk", "openTrunk"]);

const VEHICLE_COLORS = {
  factory: { label: "Model 3 yellow", hex: "#f4c71b" },
  black: { label: "Solid black", hex: "#161719" },
  white: { label: "Pearl white", hex: "#f5f6f4" },
  red: { label: "Ultra red", hex: "#7b0b19" },
  blue: { label: "Deep blue", hex: "#1e4d86" },
  gray: { label: "Stealth gray", hex: "#52575c" },
};

const CUSTOM_SENSOR_ACCENTS = {
  ice: "#a9efff",
  lime: "#62e6a7",
  amber: "#ffb85c",
  rose: "#ff8f70",
  violet: "#bba7ff",
};

const TELEMETRY_GROUPS = {
  environment: "Environment",
  highVoltage: "High voltage",
  charging: "Charging interface",
};

const TELEMETRY_SENSOR_FIELDS = [
  ["environment", "insideTemperature", "Cabin"],
  ["environment", "outsideTemperature", "Outside"],
  ["environment", "odometer", "Odometer"],
  ["environment", "energyRemaining", "Energy remaining"],
  ["highVoltage", "packVoltage", "Pack voltage"],
  ["highVoltage", "packCurrent", "Pack current"],
  ["highVoltage", "batteryHeater", "Battery heater"],
  ["highVoltage", "batteryBalance", "Balance"],
  ["highVoltage", "voltageImbalance", "Brick delta"],
  ["charging", "chargePower", "Charge power"],
  ["charging", "chargeCurrent", "Charge current"],
  ["charging", "chargerVoltage", "Charger voltage"],
  ["charging", "chargeEnergyAdded", "Energy added"],
  ["charging", "chargingCableType", "Cable"],
  ["charging", "chargePortLatch", "Port latch"],
];

const normalizeVehicleScale = (value) => {
  const scale = Number.parseFloat(value);
  if (!Number.isFinite(scale)) {
    return DEFAULT_CONFIG.vehicleScale;
  }
  return Math.min(1.2, Math.max(0.75, scale));
};

class TeslaPulseCard extends HTMLElement {
  static async getConfigElement() {
    return document.createElement("tesla-pulse-card-editor");
  }

  static getStubConfig() {
    return {
      title: "Tesla",
      themeMode: "auto",
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

    const nextConfig = {
      ...DEFAULT_CONFIG,
      ...config,
      entities: { ...DEFAULT_CONFIG.entities, ...(config.entities || {}) },
      themeMode: ["black", "white"].includes(config.themeMode) ? config.themeMode : "auto",
      vehicleColor: VEHICLE_COLORS[config.vehicleColor] ? config.vehicleColor : DEFAULT_CONFIG.vehicleColor,
      vehicleScale: normalizeVehicleScale(config.vehicleScale),
      sensorTapAction: config.sensorTapAction === "none" ? "none" : "more-info",
      sensorVisuals: this._normalizeSensorVisuals(config.sensorVisuals),
      customSensors: this._normalizeCustomSensors(config.customSensors),
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

    const vehicleColorChanged = Boolean(this._config) && this._config.vehicleColor !== nextConfig.vehicleColor;
    this._config = nextConfig;

    if (this._isRendered && this._vehicleScene?.applyVehicleColor && vehicleColorChanged) {
      this._vehicleScene.applyVehicleColor();
      return;
    }

    if (this._isRendered && this._inEditMode()) {
      this._scheduleRender();
      return;
    }

    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config) {
      return;
    }
    if (!this.shadowRoot || !this._isRendered) {
      this._render();
      return;
    }
    this._refreshLiveContent();
  }

  getCardSize() {
    return 7;
  }

  _inEditMode() {
    return Boolean(this._hass?.editMode);
  }

  _scheduleRender() {
    clearTimeout(this._renderDebounceTimer);
    this._renderDebounceTimer = setTimeout(() => {
      this._renderDebounceTimer = undefined;
      this._render();
    }, 60);
  }

  _vehicleOrbitStorageKey() {
    return `tesla-pulse-orbit:${this._config.title}:${this._entityId("battery") || "vehicle"}`;
  }

  _restoreVehicleOrbit() {
    if (this._vehicleOrbit) return this._vehicleOrbit;
    try {
      const orbit = JSON.parse(globalThis.sessionStorage?.getItem(this._vehicleOrbitStorageKey()) || "null");
      if (Number.isFinite(orbit?.yaw) && Number.isFinite(orbit?.pitch)) {
        return orbit;
      }
    } catch (_) {
      // Session storage can be unavailable in embedded Home Assistant contexts.
    }
    return { yaw: 0, pitch: 0 };
  }

  _persistVehicleOrbit() {
    try {
      globalThis.sessionStorage?.setItem(this._vehicleOrbitStorageKey(), JSON.stringify(this._vehicleOrbit));
    } catch (_) {
      // Keep the in-memory orbit even when session storage is unavailable.
    }
  }

  _entityId(key) {
    const configuredEntity = this._config?.entities?.[key];
    if (configuredEntity) {
      return configuredEntity;
    }

    if (this._config?.entityMode === "manual") {
      return undefined;
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

  _normalizeCustomSensors(sensors) {
    if (!Array.isArray(sensors)) return [];
    return sensors
      .filter((sensor) => sensor && typeof sensor.entity === "string" && sensor.entity.trim())
      .map((sensor) => ({
        entity: sensor.entity.trim(),
        label: typeof sensor.label === "string" && sensor.label.trim() ? sensor.label.trim() : sensor.entity.trim(),
        icon: typeof sensor.icon === "string" ? sensor.icon.trim().replace(/^mdi:/, "") : "",
        display: sensor.display === "state" ? "state" : "value",
        accent: CUSTOM_SENSOR_ACCENTS[sensor.accent] ? sensor.accent : "rose",
        group: TELEMETRY_GROUPS[sensor.group] ? sensor.group : "environment",
      }));
  }

  _normalizeSensorVisuals(visuals) {
    if (!visuals || typeof visuals !== "object") return {};
    return Object.fromEntries(Object.entries(visuals).map(([key, visual]) => [key, {
      label: typeof visual?.label === "string" ? visual.label.trim() : "",
      icon: typeof visual?.icon === "string" ? visual.icon.trim().replace(/^mdi:/, "") : "",
      display: visual?.display === "state" ? "state" : "value",
      accent: CUSTOM_SENSOR_ACCENTS[visual?.accent] ? visual.accent : "",
    }]));
  }

  _sensorPresentation(key, fallbackLabel) {
    const visual = this._config.sensorVisuals[key] || {};
    return {
      label: visual.label || fallbackLabel,
      icon: visual.icon || "",
      display: visual.display || "value",
      accent: visual.accent || "",
    };
  }

  _sensorValue(key, display, fallback = "Not received") {
    const state = this._state(key);
    if (!state) return fallback;
    if (display === "state") return state.state;
    return key === "voltageImbalance" ? this._formattedVoltageImbalance() : this._formatStateValue(state);
  }

  _customSensorValue(sensor) {
    const state = this._hass?.states?.[sensor.entity];
    if (!state) return "Not received";
    return sensor.display === "state" ? state.state : this._formatStateValue(state);
  }

  _customSensorRow(sensor, index) {
    const value = this._customSensorValue(sensor);
    const interactive = this._config.sensorTapAction === "more-info";
    const tag = interactive ? "button" : "div";
    const attributes = interactive
      ? `type="button" data-sensor-entity="${this._escape(sensor.entity)}" aria-label="Open ${this._escape(sensor.label)} history"`
      : "";
    const icon = sensor.icon ? `<ha-icon icon="mdi:${this._escape(sensor.icon)}"></ha-icon>` : "";
    return `<${tag} class="system-row custom-sensor-row" style="--custom-accent: ${CUSTOM_SENSOR_ACCENTS[sensor.accent]}" data-custom-sensor-index="${index}" ${attributes}><span>${icon}${this._escape(sensor.label)}</span><strong>${this._escape(value)}</strong><i aria-hidden="true"></i></${tag}>`;
  }

  _state(key) {
    const entityId = this._entityId(key);
    return entityId ? this._hass?.states?.[entityId] : undefined;
  }

  _number(key) {
    const value = Number.parseFloat(this._state(key)?.state ?? "");
    return Number.isFinite(value) ? value : undefined;
  }

  _formatNumericValue(value, maximumFractionDigits = 2) {
    return new Intl.NumberFormat(undefined, {
      useGrouping: false,
      minimumFractionDigits: 0,
      maximumFractionDigits,
    }).format(value);
  }

  _formatStateValue(state, fallback = "Unavailable") {
    if (!state || ["unknown", "unavailable", "none"].includes(state.state)) {
      return fallback;
    }
    const value = Number.parseFloat(state.state);
    const unit = state.attributes?.unit_of_measurement;
    if (!Number.isFinite(value)) {
      return unit ? `${state.state} ${unit}` : state.state;
    }
    const decimalsByUnit = {
      "%": 0,
      km: 1,
      kWh: 2,
      V: 2,
      A: 2,
      bar: 2,
      mV: 0,
      C: 1,
    };
    const maxDigits = decimalsByUnit[unit] ?? 2;
    const formatted = this._formatNumericValue(value, maxDigits);
    return unit ? `${formatted} ${unit}` : formatted;
  }

  _value(key, fallback = "Unavailable") {
    return this._formatStateValue(this._state(key), fallback);
  }

  _formattedVoltageImbalance() {
    const state = this._state("voltageImbalance");
    if (!state || ["unknown", "unavailable", "none"].includes(state.state)) {
      return "Not received";
    }

    const value = Number.parseFloat(state.state);
    if (!Number.isFinite(value)) {
      return this._value("voltageImbalance", "Not received");
    }

    const rounded = Math.round(value);
    const unit = state.attributes?.unit_of_measurement;
    return unit ? `${rounded} ${unit}` : String(rounded);
  }

  _spatialControls() {
    const frunkAction = this._entityId("openFrunk") ? "openFrunk" : "frunk";
    const trunkAction = this._entityId("openTrunk") ? "openTrunk" : "trunk";
    return [
      {
        anchor: "trunk",
        action: trunkAction,
        label: "Trunk",
        ariaLabel: "Open trunk",
        icon: "car-back",
      },
      {
        anchor: "lock",
        action: "lock",
        label: this._isLocked() ? "Unlock" : "Lock",
        ariaLabel: this._isLocked() ? "Unlock vehicle" : "Lock vehicle",
        icon: this._isLocked() ? "lock" : "lock-open-variant",
      },
      {
        anchor: "climate",
        action: "climate",
        label: "Climate",
        ariaLabel: "Toggle climate",
        icon: "fan",
      },
      {
        anchor: "frunk",
        action: frunkAction,
        label: "Frunk",
        ariaLabel: "Open frunk",
        icon: "car",
      },
    ].filter(({ action }) => Boolean(this._entityId(action)));
  }

  _refreshLiveContent() {
    const root = this.shadowRoot;
    if (!root || this._pendingAction) {
      this._render();
      return;
    }

    const expectedSpatialActions = this._spatialControls().map((control) => control.action).join("|");
    const renderedSpatialActions = [...root.querySelectorAll(".vehicle-hotspot")]
      .map((button) => button.dataset.action)
      .join("|");
    if (expectedSpatialActions !== renderedSpatialActions) {
      this._render();
      return;
    }

    const battery = this._number("battery");
    const range = this._number("range");
    const chargeLimit = this._number("chargeLimit");
    const chargeState = this._value("chargeState", "Disconnected");
    const isCharging = chargeState.toLowerCase() === "charging";
    const batteryProgress = Math.min(100, Math.max(0, battery ?? 0));
    const chargeLimitProgress = Math.min(100, Math.max(0, chargeLimit ?? 0));
    const limitValuePosition = Math.min(94, Math.max(6, chargeLimitProgress));
    const telemetry = this._telemetry();
    const awakeStatus = this._awakeStatus();

    const awakeNode = root.querySelector(".awake-state");
    if (awakeNode) {
      awakeNode.classList.toggle("is-awake", awakeStatus.active);
      awakeNode.innerHTML = `<i></i>${this._escape(awakeStatus.label)}`;
    }

    const telemetryNode = root.querySelector(".telemetry");
    if (telemetryNode) {
      telemetryNode.className = `telemetry ${telemetry.state}`;
      const labelNode = telemetryNode.querySelector(".telemetry-label");
      const detailNode = telemetryNode.querySelector("span:last-child");
      if (labelNode) labelNode.textContent = telemetry.label;
      if (detailNode) detailNode.textContent = telemetry.detail;
    }

    const batteryOrbitValue = root.querySelector(".battery-orbit .orbit-value");
    if (batteryOrbitValue) {
      batteryOrbitValue.innerHTML = `${battery === undefined ? "--" : Math.round(battery)}<small>%</small>`;
    }
    const batteryOrbitDetail = root.querySelector(".battery-orbit .orbit-detail");
    if (batteryOrbitDetail) {
      batteryOrbitDetail.textContent = chargeState;
    }

    const rangeOrbitValue = root.querySelector(".range-orbit .orbit-value");
    if (rangeOrbitValue) {
      rangeOrbitValue.innerHTML = `${range === undefined ? "--" : Math.round(range)}<small>${range === undefined ? "" : "km"}</small>`;
    }
    const rangeOrbitDetail = root.querySelector(".range-orbit .orbit-detail");
    if (rangeOrbitDetail) {
      rangeOrbitDetail.textContent = chargeLimit === undefined ? "No limit" : `Limit ${Math.round(chargeLimit)}%`;
    }

    const stageStates = [...root.querySelectorAll(".stage-ribbon .stage-state")];
    if (stageStates.length === 4) {
      const stageModels = [
        {
          active: this._isOn("climate"),
          alert: false,
          value: this._isOn("climate") ? "Climate active" : this._value("insideTemperature", "Climate off"),
        },
        {
          active: !this._isLocked(),
          alert: !this._isLocked(),
          value: this._isLocked() ? "Secured" : "Unlocked",
        },
        {
          active: this._isOn("sentry"),
          alert: false,
          value: this._isOn("sentry") ? "Sentry armed" : "Sentry off",
        },
        {
          active: this._isOn("windows"),
          alert: this._isOn("windows"),
          value: this._isOn("windows") ? "Open" : "Closed",
        },
      ];
      stageStates.forEach((node, index) => {
        const model = stageModels[index];
        node.classList.toggle("is-active", model.active);
        node.classList.toggle("is-alert", !model.active && model.alert);
        const valueNode = node.querySelector("strong");
        if (valueNode) valueNode.textContent = model.value;
      });
    }

    const energyRail = root.querySelector(".energy-rail");
    if (energyRail) {
      energyRail.setAttribute("aria-label", `Battery level ${batteryProgress} percent, charge limit ${chargeLimit ?? "unknown"} percent`);
      const energyFill = energyRail.querySelector(".energy-fill");
      if (energyFill) {
        energyFill.style.width = `${batteryProgress}%`;
        energyFill.style.minWidth = battery === undefined ? "0" : "6px";
        energyFill.style.background = isCharging ? "var(--lime)" : "var(--ice)";
        energyFill.style.boxShadow = isCharging
          ? "0 0 18px rgba(98, 230, 167, 0.62)"
          : "0 0 18px rgba(169, 239, 255, 0.5)";
      }
      const energyCaption = root.querySelector(".energy-caption");
      if (energyCaption) {
        energyCaption.textContent = isCharging ? "Energy flowing" : "High-voltage reserve";
      }
      const energyValue = energyRail.querySelector(".energy-value");
      if (energyValue) {
        energyValue.hidden = chargeLimit === undefined;
        energyValue.textContent = chargeLimit === undefined ? "" : `${Math.round(chargeLimit)}%`;
        energyValue.style.left = `${limitValuePosition}%`;
      }
      const energyLimit = energyRail.querySelector(".energy-limit");
      if (energyLimit) {
        energyLimit.style.left = `calc(${chargeLimitProgress}% - 1px)`;
        energyLimit.hidden = chargeLimit === undefined;
      }
    }

    const chargingReadout = root.querySelector(".charging-readout");
    if (chargingReadout) {
      chargingReadout.hidden = !(isCharging && this._config.display.showCharging);
      const chargingValues = [...chargingReadout.querySelectorAll(".charging-values span")];
      if (chargingValues.length === 3) {
        chargingValues[0].textContent = this._value("chargePower", "Power unavailable");
        chargingValues[1].textContent = this._value("chargeRate", "Rate unavailable");
        chargingValues[2].textContent = this._value("timeToFull", "ETA unavailable");
      }
    }

    root.querySelectorAll("[data-sensor-key]").forEach((node) => {
      const key = node.dataset.sensorKey;
      const display = this._config.sensorVisuals[key]?.display || "value";
      const value = this._sensorValue(key, display);
      const valueNode = node.querySelector("strong");
      if (valueNode) valueNode.textContent = value;
    });
    root.querySelectorAll("[data-custom-sensor-index]").forEach((node) => {
      const sensor = this._config.customSensors[Number(node.dataset.customSensorIndex)];
      const valueNode = node.querySelector("strong");
      if (valueNode && sensor) valueNode.textContent = this._customSensorValue(sensor);
    });

    const lockHotspot = root.querySelector('.vehicle-hotspot[data-vehicle-anchor="lock"]');
    if (lockHotspot) {
      const label = this._isLocked() ? "Unlock" : "Lock";
      const ariaLabel = this._isLocked() ? "Unlock vehicle" : "Lock vehicle";
      lockHotspot.dataset.label = label;
      lockHotspot.setAttribute("title", ariaLabel);
      lockHotspot.setAttribute("aria-label", ariaLabel);
      const icon = lockHotspot.querySelector("ha-icon");
      if (icon) {
        icon.setAttribute("icon", `mdi:${this._isLocked() ? "lock" : "lock-open-variant"}`);
      }
    }

    root.querySelectorAll(".command-deck .control[data-action]").forEach((control) => {
      const action = control.dataset.action;
      const definition = ACTION_DEFINITIONS[action];
      if (!definition || definition.moreInfo) {
        control.classList.remove("is-active");
        return;
      }
      const active = action === "lock" ? this._isLocked() : this._isOn(action);
      control.classList.toggle("is-active", active);
    });
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

  _awakeStatus() {
    const state = this._state("vehicleAwake")?.state;
    if (!state || ["unknown", "unavailable", "none"].includes(state.toLowerCase())) {
      return { label: "State unknown", active: false, known: false };
    }
    const active = ["awake", "on", "online"].includes(state.toLowerCase());
    return { label: active ? "Awake" : "Asleep", active, known: true };
  }

  _systemRow(label, key, fallback = "Not received") {
    const presentation = this._sensorPresentation(key, label);
    const value = this._sensorValue(key, presentation.display, fallback);
    const entityId = this._entityId(key);
    const interactive = entityId && this._config.sensorTapAction === "more-info";
    const tag = interactive ? "button" : "div";
    const attributes = interactive
      ? `type="button" data-sensor-entity="${this._escape(entityId)}" aria-label="Open ${this._escape(presentation.label)} history"`
      : "";
    const icon = presentation.icon ? `<ha-icon icon="mdi:${this._escape(presentation.icon)}"></ha-icon>` : "";
    const accent = presentation.accent ? `style="--row-accent: ${CUSTOM_SENSOR_ACCENTS[presentation.accent]}"` : "";
    return `<${tag} class="system-row" data-sensor-key="${key}" ${accent} ${attributes}><span>${icon}${this._escape(presentation.label)}</span><strong>${this._escape(value)}</strong><i aria-hidden="true"></i></${tag}>`;
  }

  _tireLine() {
    const tires = [["FL", "frontLeftTirePressure"], ["FR", "frontRightTirePressure"], ["RL", "rearLeftTirePressure"], ["RR", "rearRightTirePressure"]];
    return `<div class="tire-line" aria-label="Tire pressure">${tires.map(([label, key]) => {
      const entityId = this._entityId(key);
      const interactive = entityId && this._config.sensorTapAction === "more-info";
      const tag = interactive ? "button" : "span";
      const attributes = interactive ? `type="button" data-sensor-entity="${this._escape(entityId)}" aria-label="Open ${label} tire pressure history"` : "";
      return `<${tag} data-sensor-key="${key}" ${attributes}><b>${label}</b><strong>${this._escape(this._value(key, "--"))}</strong></${tag}>`;
    }).join("")}</div>`;
  }

  _statusTone(active, alert = false) {
    return active ? "is-active" : alert ? "is-alert" : "";
  }

  _resolvedThemeMode() {
    if (this._config?.themeMode === "black" || this._config?.themeMode === "white") {
      return this._config.themeMode;
    }
    return this._hass?.themes?.darkMode ? "black" : "white";
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
    if (definition.moreInfo) {
      return this._control(action, definition.icon, definition.label, false);
    }
    return this._control(action, definition.icon, definition.label, this._isOn(action));
  }

  _vehicleRenderMarkup() {
    return `
      <canvas class="vehicle-canvas" aria-label="Interactive 3D Cybertruck"></canvas>
      <svg class="vehicle-vector vehicle-render-fallback" viewBox="0 0 720 300" role="img" aria-label="Fallback electric vehicle render">
        <defs>
          <linearGradient id="body-metal" x1="0" y1="0" x2="0.86" y2="1">
            <stop offset="0" stop-color="#f9fbfc" />
            <stop offset="0.38" stop-color="#aeb9c0" />
            <stop offset="0.7" stop-color="#78868d" />
            <stop offset="1" stop-color="#364249" />
          </linearGradient>
          <linearGradient id="body-light" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#65737b" />
            <stop offset="0.5" stop-color="#dfe5e8" />
            <stop offset="1" stop-color="#4b575e" />
          </linearGradient>
          <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#b7e3ee" stop-opacity="0.82" />
            <stop offset="0.45" stop-color="#263b45" stop-opacity="0.96" />
            <stop offset="1" stop-color="#0d151a" />
          </linearGradient>
          <radialGradient id="rim" cx="42%" cy="35%" r="68%">
            <stop offset="0" stop-color="#e9eef0" />
            <stop offset="0.28" stop-color="#5e6a70" />
            <stop offset="0.3" stop-color="#13191c" />
            <stop offset="0.76" stop-color="#30393e" />
            <stop offset="1" stop-color="#0a0d0f" />
          </radialGradient>
          <filter id="car-shadow" x="-20%" y="-50%" width="140%" height="220%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>
        <ellipse cx="366" cy="251" rx="265" ry="22" fill="#061114" opacity="0.5" filter="url(#car-shadow)" />
        <g class="wheel wheel-rear" transform="translate(198 218)">
          <circle r="48" fill="#090c0e" />
          <circle r="36" fill="url(#rim)" stroke="#818d92" stroke-width="2" />
          <circle r="10" fill="#101518" stroke="#c4cdd1" stroke-width="2" />
          <path d="M0-32 8-10 30-11 12 3 20 26 0 12-20 26-12 3-30-11-8-10Z" fill="#161e22" stroke="#8e999e" stroke-width="2" />
        </g>
        <g class="wheel wheel-front" transform="translate(542 218)">
          <circle r="48" fill="#090c0e" />
          <circle r="36" fill="url(#rim)" stroke="#818d92" stroke-width="2" />
          <circle r="10" fill="#101518" stroke="#c4cdd1" stroke-width="2" />
          <path d="M0-32 8-10 30-11 12 3 20 26 0 12-20 26-12 3-30-11-8-10Z" fill="#161e22" stroke="#8e999e" stroke-width="2" />
        </g>
        <path d="M62 204C78 176 115 161 175 154L267 140C299 85 338 57 399 54 461 52 503 83 540 140L604 153C641 159 668 176 676 199L670 218 596 226C590 181 570 162 540 162 505 162 486 184 481 229H258C253 183 232 162 199 162 165 162 144 184 139 226L81 218Z" fill="url(#body-metal)" stroke="#dce3e6" stroke-width="2" />
        <path d="M79 207C163 221 252 226 368 228 485 229 584 225 670 211L668 224C571 240 166 240 82 220Z" fill="url(#body-light)" opacity="0.9" />
        <path d="M278 138C310 92 348 66 400 64 452 62 490 88 520 140L449 139 421 75C378 68 343 80 315 108L298 139Z" fill="url(#glass)" stroke="#76868e" stroke-width="2" />
        <path d="M318 106C343 78 374 68 417 74L442 139H301Z" fill="#14242b" opacity="0.74" />
        <path d="M449 139 422 75C461 83 491 104 517 140Z" fill="#0c171c" opacity="0.86" />
        <path d="M294 143 281 204M445 143 458 211M281 204C332 208 391 210 458 211" fill="none" stroke="#5b686e" stroke-width="2" opacity="0.72" />
        <path d="M144 157C226 148 280 143 315 140M510 141C561 145 606 153 633 165" fill="none" stroke="#f8fbfc" stroke-width="4" stroke-linecap="round" opacity="0.62" />
        <path d="M601 158C632 164 650 175 660 189L617 186Z" fill="#eef9ff" stroke="#b3e8f4" stroke-width="2" />
        <path d="M82 190C96 172 119 164 148 159L137 184Z" fill="#e94343" opacity="0.86" />
        <path d="M355 154h34" stroke="#3d494f" stroke-width="5" stroke-linecap="round" />
        <path d="M474 156h29" stroke="#3d494f" stroke-width="5" stroke-linecap="round" />
        <path d="M112 205C212 215 318 218 432 218 528 218 605 211 654 201" fill="none" stroke="#f7fafb" stroke-width="2" opacity="0.32" />
      </svg>
    `;
  }

  _disposeVehicleScene() {
    this._vehicleScene?.dispose();
    this._vehicleScene = undefined;
  }

  _initVehicleScene() {
    const THREE = globalThis.THREE;
    const canvas = this.shadowRoot?.querySelector(".vehicle-canvas");
    const stage = this.shadowRoot?.querySelector(".vehicle-stage");
    if (!THREE || !canvas || !stage || stage.hidden) {
      return;
    }

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch (error) {
      console.warn("Tesla Pulse Card could not initialize WebGL.", error);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(27, 2.25, 0.1, 100);
    camera.position.set(5.7, 1.25, 5.2);
    camera.lookAt(0, 0.42, 0);

    const vehicle = new THREE.Group();
    vehicle.rotation.y = -0.5;
    vehicle.visible = false;
    scene.add(vehicle);

    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xaab5ba,
      metalness: 0.72,
      roughness: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.14,
    });
    const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x10171a, metalness: 0.55, roughness: 0.28 });
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0x142833,
      emissive: 0x0a161d,
      emissiveIntensity: 0.22,
      metalness: 0.62,
      roughness: 0.2,
    });
    const tireMaterial = new THREE.MeshStandardMaterial({ color: 0x07090a, roughness: 0.82 });
    const rimMaterial = new THREE.MeshStandardMaterial({ color: 0xaab8bd, metalness: 0.9, roughness: 0.18 });
    const lightMaterial = new THREE.MeshStandardMaterial({ color: 0xdffaff, emissive: 0x8ceaff, emissiveIntensity: 2.3 });
    const tailMaterial = new THREE.MeshStandardMaterial({ color: 0xff302f, emissive: 0xff1717, emissiveIntensity: 1.6 });

    const createLoftGeometry = (sections, radialSegments = 28, upperOnly = false) => {
      const positions = [];
      const indices = [];
      const ringSize = upperOnly ? radialSegments + 1 : radialSegments;
      for (const section of sections) {
        for (let segment = 0; segment < ringSize; segment += 1) {
          const angle = upperOnly
            ? Math.PI * segment / radialSegments
            : Math.PI * 2 * segment / radialSegments;
          positions.push(
            section.x,
            section.centerY + Math.sin(angle) * section.halfHeight,
            Math.cos(angle) * section.halfWidth,
          );
        }
      }
      for (let section = 0; section < sections.length - 1; section += 1) {
        const segmentLimit = upperOnly ? radialSegments : radialSegments;
        for (let segment = 0; segment < segmentLimit; segment += 1) {
          const nextSegment = upperOnly ? segment + 1 : (segment + 1) % radialSegments;
          const current = section * ringSize + segment;
          const next = section * ringSize + nextSegment;
          const nextRing = (section + 1) * ringSize + segment;
          const nextRingNext = (section + 1) * ringSize + nextSegment;
          indices.push(current, nextRing, next, next, nextRing, nextRingNext);
        }
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();
      return geometry;
    };

    const bodyGeometry = createLoftGeometry([
      { x: -2.55, centerY: 0.27, halfHeight: 0.06, halfWidth: 0.16 },
      { x: -2.28, centerY: 0.31, halfHeight: 0.12, halfWidth: 0.44 },
      { x: -1.78, centerY: 0.35, halfHeight: 0.16, halfWidth: 0.71 },
      { x: -1.0, centerY: 0.37, halfHeight: 0.18, halfWidth: 0.82 },
      { x: -0.1, centerY: 0.38, halfHeight: 0.2, halfWidth: 0.86 },
      { x: 0.8, centerY: 0.37, halfHeight: 0.18, halfWidth: 0.82 },
      { x: 1.55, centerY: 0.34, halfHeight: 0.15, halfWidth: 0.7 },
      { x: 2.1, centerY: 0.3, halfHeight: 0.11, halfWidth: 0.5 },
      { x: 2.45, centerY: 0.27, halfHeight: 0.08, halfWidth: 0.28 },
      { x: 2.6, centerY: 0.25, halfHeight: 0.04, halfWidth: 0.1 },
    ]);
    vehicle.add(new THREE.Mesh(bodyGeometry, bodyMaterial));

    const roofGeometry = createLoftGeometry([
      { x: -0.98, centerY: 0.59, halfHeight: 0.05, halfWidth: 0.36 },
      { x: -0.55, centerY: 0.74, halfHeight: 0.1, halfWidth: 0.47 },
      { x: 0.05, centerY: 0.83, halfHeight: 0.12, halfWidth: 0.51 },
      { x: 0.66, centerY: 0.77, halfHeight: 0.1, halfWidth: 0.46 },
      { x: 1.2, centerY: 0.64, halfHeight: 0.06, halfWidth: 0.34 },
    ], 24, true);
    vehicle.add(new THREE.Mesh(roofGeometry, glassMaterial));

    const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.3, 1.05), darkMaterial);
    windshield.position.set(-0.69, 0.71, 0);
    windshield.rotation.z = 0.34;
    vehicle.add(windshield);

    const rearWindow = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.95), darkMaterial);
    rearWindow.position.set(0.98, 0.68, 0);
    rearWindow.rotation.z = -0.42;
    vehicle.add(rearWindow);

    const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(4.28, 0.12, 1.57), darkMaterial);
    lowerBody.position.set(-0.02, -0.01, 0);
    vehicle.add(lowerBody);

    const frontNose = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.1, 0.9), bodyMaterial);
    frontNose.position.set(2.28, 0.4, 0);
    frontNose.rotation.z = -0.08;
    vehicle.add(frontNose);

    const rearDeck = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.09, 0.84), bodyMaterial);
    rearDeck.position.set(-2.23, 0.39, 0);
    rearDeck.rotation.z = 0.12;
    vehicle.add(rearDeck);

    const wheelGeometry = new THREE.CylinderGeometry(0.33, 0.33, 0.22, 36);
    const rimGeometry = new THREE.CylinderGeometry(0.22, 0.22, 0.228, 20);
    const hubGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.244, 16);
    const spokeGeometry = new THREE.BoxGeometry(0.045, 0.2, 0.025);
    for (const wheelX of [-1.65, 1.65]) {
      for (const wheelZ of [-0.82, 0.82]) {
        const wheel = new THREE.Mesh(wheelGeometry, tireMaterial);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(wheelX, 0.11, wheelZ);
        vehicle.add(wheel);
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        rim.rotation.x = Math.PI / 2;
        rim.position.set(wheelX, 0.11, wheelZ * 1.01);
        vehicle.add(rim);
        const hub = new THREE.Mesh(hubGeometry, darkMaterial);
        hub.rotation.x = Math.PI / 2;
        hub.position.set(wheelX, 0.11, wheelZ * 1.02);
        vehicle.add(hub);
        for (let index = 0; index < 5; index += 1) {
          const spoke = new THREE.Mesh(spokeGeometry, darkMaterial);
          spoke.rotation.set(0, 0, index * Math.PI / 2.5);
          spoke.position.set(wheelX, 0.11, wheelZ * 1.025);
          vehicle.add(spoke);
        }
      }
    }

    const addDetail = (geometry, material, position) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...position);
      vehicle.add(mesh);
      return mesh;
    };
    addDetail(new THREE.BoxGeometry(0.3, 0.07, 0.32), lightMaterial, [2.31, 0.58, -0.51]);
    addDetail(new THREE.BoxGeometry(0.3, 0.07, 0.32), lightMaterial, [2.31, 0.58, 0.51]);
    addDetail(new THREE.BoxGeometry(0.2, 0.08, 0.3), tailMaterial, [-2.3, 0.57, -0.54]);
    addDetail(new THREE.BoxGeometry(0.2, 0.08, 0.3), tailMaterial, [-2.3, 0.57, 0.54]);
    addDetail(new THREE.BoxGeometry(0.05, 0.08, 0.24), darkMaterial, [-0.34, 0.85, -0.78]);
    addDetail(new THREE.BoxGeometry(0.05, 0.08, 0.24), darkMaterial, [0.72, 0.85, -0.78]);
    addDetail(new THREE.BoxGeometry(0.55, 0.03, 0.02), darkMaterial, [-0.2, 0.55, -0.89]);
    addDetail(new THREE.BoxGeometry(0.55, 0.03, 0.02), darkMaterial, [0.48, 0.55, -0.89]);
    const leftMirror = addDetail(new THREE.SphereGeometry(0.13, 16, 8), darkMaterial, [0.94, 0.98, -0.84]);
    leftMirror.scale.set(1.05, 0.42, 0.5);
    const rightMirror = addDetail(new THREE.SphereGeometry(0.13, 16, 8), darkMaterial, [0.94, 0.98, 0.84]);
    rightMirror.scale.set(1.05, 0.42, 0.5);

    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x49c8dc, transparent: true, opacity: 0.1, depthWrite: false });
    const floor = new THREE.Mesh(new THREE.CircleGeometry(3.6, 64), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.25;
    scene.add(floor);

    scene.add(new THREE.HemisphereLight(0xd8f7ff, 0x142126, 2.5));
    const keyLight = new THREE.DirectionalLight(0xffffff, 4.4);
    keyLight.position.set(4, 7, 6);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x53dfff, 3.4);
    rimLight.position.set(-5, 3, -4);
    scene.add(rimLight);
    const frontLight = new THREE.PointLight(0xffffff, 3.2, 14);
    frontLight.position.set(4, 1.5, 4);
    scene.add(frontLight);
    const canopyLight = new THREE.PointLight(0x96edff, 1.35, 9);
    canopyLight.position.set(0.3, 4.2, -1.4);
    scene.add(canopyLight);

    let anchors = {
      trunk: { point: new THREE.Vector3(-2.05, 0.78, 0), offsetY: 0 },
      lock: { point: new THREE.Vector3(-0.18, 0.88, -0.88), offsetY: 0 },
      climate: { point: new THREE.Vector3(0.28, 1.3, 0), offsetY: -38 },
      frunk: { point: new THREE.Vector3(1.95, 0.76, 0), offsetY: 0 },
    };
    const hotspotElements = Object.fromEntries(
      [...stage.querySelectorAll("[data-vehicle-anchor]")].map((element) => [element.dataset.vehicleAnchor, element]),
    );

    let disposed = false;
    const disposeObject = (object) => {
      object.traverse((child) => {
        child.geometry?.dispose?.();
        if (Array.isArray(child.material)) child.material.forEach((material) => material.dispose());
        else child.material?.dispose?.();
      });
    };

    let activeModel;
    const paintNameInclude = /(body|paint|door|bonnet|bumper|hood|fender|boot|rear|front|putih|satin|panel)/;
    const paintNameExclude = /(glass|window|light|lamp|head|fog|indicator|tail|hub|wheel|tire|rim|rubber|mirror|interior|seat|carpet|lcd|chrome|aluminium|plastic|trim|chassis)/;
    const lightSurface = /(light|lamp|head|fog|indicator|tail|brake|signal|turn|reverse)/;
    const frameSurface = /(pillar|frame|trim|window_trim|door_frame|black|just_black|hitam|sills|bodysills)/;
    const interiorSurface = /(interior|seat|leather|carpet|dashboard|lcd|steer|panel|belt|console|plastic|inside)/;
    const rimSurface = /(rim|hub|caliper|disc|wheel_face|wheelcap)/;

    const applyModelAppearance = (model) => {
      const vehicleColor = VEHICLE_COLORS[this._config.vehicleColor] || VEHICLE_COLORS.factory;
      const applyCustomPaint = this._config.vehicleColor !== "factory";

      model.traverse((object) => {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        const objectName = (object.name || "").toLowerCase();
        const wheelAssembly = /(hub|wheel|rim|caliper|disc)/.test(objectName);
        materials.forEach((material) => {
          if (!material) return;
          const materialName = material.name.toLowerCase();
          const paintableByName = (paintNameInclude.test(materialName) || paintNameInclude.test(objectName))
            && !paintNameExclude.test(materialName)
            && !paintNameExclude.test(objectName);
          if ((rimSurface.test(materialName) || rimSurface.test(objectName) || wheelAssembly)
            && !/(tire|rubber)/.test(materialName)) {
            material.map = null;
            material.emissiveMap = null;
            material.color.set("#000000");
            material.emissive.set("#000000");
            material.emissiveIntensity = 0;
            material.metalness = 0.72;
            material.roughness = 0.22;
            material.transparent = false;
            material.opacity = 1;
            material.depthWrite = true;
            material.side = THREE.FrontSide;
          } else if (frameSurface.test(materialName) || frameSurface.test(objectName)) {
            material.map = null;
            material.emissiveMap = null;
            material.color.set("#0f1115");
            material.emissive.set("#000000");
            material.emissiveIntensity = 0;
            material.metalness = 0.12;
            material.roughness = 0.66;
            material.transparent = false;
            material.opacity = 1;
            material.depthWrite = true;
            material.side = THREE.FrontSide;
          } else if (interiorSurface.test(materialName) || interiorSurface.test(objectName)) {
            material.map = null;
            material.emissiveMap = null;
            material.color.set("#15181c");
            material.emissive.set("#000000");
            material.emissiveIntensity = 0;
            material.metalness = 0.08;
            material.roughness = 0.74;
            material.transparent = false;
            material.opacity = 1;
            material.depthWrite = true;
            material.side = THREE.DoubleSide;
          } else if (["body_mat", "car_paint_mat"].includes(material.name) || paintableByName) {
            if (applyCustomPaint) {
              material.map = null;
              material.emissiveMap = null;
            }
            material.color.set(vehicleColor.hex);
            material.metalness = 0.72;
            material.roughness = 0.19;
            material.clearcoat = 0.7;
            material.clearcoatRoughness = 0.11;
          } else if (!/(glass|window|light|lamp|head|fog|indicator|tail|hub|wheel|tire|rim|rubber|mirror|interior|seat|carpet|lcd|chrome|aluminium|plastic|trim|chassis)/.test(`${materialName} ${objectName}`)) {
            if (applyCustomPaint) {
              material.map = null;
              material.emissiveMap = null;
            }
            material.color.set(vehicleColor.hex);
            material.metalness = 0.72;
            material.roughness = 0.19;
            material.clearcoat = 0.7;
            material.clearcoatRoughness = 0.11;
          } else if (lightSurface.test(materialName) || lightSurface.test(objectName)) {
            const rearLight = /(tail|rear|brake|red)/.test(`${materialName} ${objectName}`);
            material.transparent = false;
            material.opacity = 1;
            material.alphaTest = 0.08;
            material.depthWrite = true;
            material.metalness = 0.05;
            material.roughness = 0.14;
            material.color.set(rearLight ? "#ff3b30" : "#f4fbff");
            material.emissive.set(rearLight ? "#ff120a" : "#bdeeff");
            material.emissiveIntensity = rearLight ? 1.45 : 1.1;
          } else if (/(glass|window)/.test(materialName)) {
            material.metalness = 0.68;
            material.roughness = 0.12;
          } else if (/(tire|rubber|trim|plastic)/.test(materialName)) {
            material.metalness = 0;
            material.roughness = 0.72;
          }
          material.needsUpdate = true;
        });
      });
    };

    const installCybertruck = (gltf) => {
      if (disposed) {
        disposeObject(gltf.scene);
        return;
      }

      vehicle.children.forEach(disposeObject);
      vehicle.clear();
      const cybertruck = gltf.scene;
      applyModelAppearance(cybertruck);
      cybertruck.rotation.y = Math.PI / 2;
      let bounds = new THREE.Box3().setFromObject(cybertruck);
      const size = bounds.getSize(new THREE.Vector3());
      const scale = (5.1 * this._config.vehicleScale) / Math.max(size.x, size.z);
      cybertruck.scale.multiplyScalar(scale);
      bounds = new THREE.Box3().setFromObject(cybertruck);
      const center = bounds.getCenter(new THREE.Vector3());
      cybertruck.position.set(-center.x, -bounds.min.y - 0.19, -center.z);
      vehicle.add(cybertruck);

      bounds = new THREE.Box3().setFromObject(vehicle);
      const modelSize = bounds.getSize(new THREE.Vector3());
      const modelCenter = bounds.getCenter(new THREE.Vector3());
      anchors = {
        frunk: { point: new THREE.Vector3(bounds.min.x + modelSize.x * 0.13, modelCenter.y + modelSize.y * 0.45, modelCenter.z), offsetY: 0 },
        lock: { point: new THREE.Vector3(modelCenter.x, modelCenter.y + modelSize.y * 0.1, bounds.min.z + modelSize.z * 0.48), offsetY: 0 },
        climate: { point: new THREE.Vector3(modelCenter.x, bounds.max.y - modelSize.y * 0.2, modelCenter.z), offsetY: -38 },
        trunk: { point: new THREE.Vector3(bounds.max.x - modelSize.x * 0.13, modelCenter.y + modelSize.y * 0.45, modelCenter.z), offsetY: 0 },
      };
      activeModel = cybertruck;
      vehicle.visible = true;
    };
    let frameId;
    const orbit = this._restoreVehicleOrbit();
    let yaw = orbit.yaw;
    let targetYaw = yaw;
    let pitch = orbit.pitch;
    let targetPitch = pitch;
    let dragging = false;
    let previousX = 0;
    let previousY = 0;

    const resize = () => {
      const width = Math.max(1, canvas.clientWidth);
      const height = Math.max(1, canvas.clientHeight);
      renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      const minimumFramingAspect = 1.8;
      const referenceVerticalFov = THREE.MathUtils.degToRad(27);
      const framingAspect = Math.max(camera.aspect, minimumFramingAspect);
      const horizontalFov = 2 * Math.atan(Math.tan(referenceVerticalFov / 2) * framingAspect);
      camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(horizontalFov / 2) / camera.aspect));
      camera.updateProjectionMatrix();
    };
    const updateHotspots = () => {
      const stageRect = stage.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      vehicle.updateMatrixWorld(true);
      for (const [key, anchor] of Object.entries(anchors)) {
        const projected = anchor.point.clone().applyMatrix4(vehicle.matrixWorld).project(camera);
        const element = hotspotElements[key];
        if (!element) continue;
        element.style.left = `${canvasRect.left - stageRect.left + (projected.x * 0.5 + 0.5) * canvasRect.width}px`;
        element.style.top = `${canvasRect.top - stageRect.top + (-projected.y * 0.5 + 0.5) * canvasRect.height + anchor.offsetY}px`;
        element.hidden = projected.z < -1 || projected.z > 1;
      }
    };
    const animate = (time) => {
      if (disposed) return;
      yaw += (targetYaw - yaw) * 0.08;
      pitch += (targetPitch - pitch) * 0.08;
      this._vehicleOrbit = { yaw, pitch };
      vehicle.rotation.y = yaw;
      vehicle.rotation.x = pitch;
      updateHotspots();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    const pointerDown = (event) => {
      dragging = true;
      previousX = event.clientX;
      previousY = event.clientY;
      try { canvas.setPointerCapture?.(event.pointerId); } catch (_) {}
    };
    const pointerMove = (event) => {
      if (!dragging) return;
      targetYaw += (event.clientX - previousX) * 0.012;
      targetPitch = THREE.MathUtils.clamp(targetPitch + (event.clientY - previousY) * 0.006, -0.32, 0.24);
      this._vehicleOrbit = { yaw: targetYaw, pitch: targetPitch };
      previousX = event.clientX;
      previousY = event.clientY;
    };
    const pointerUp = (event) => {
      dragging = false;
      yaw = targetYaw;
      pitch = targetPitch;
      this._vehicleOrbit = { yaw, pitch };
      this._persistVehicleOrbit();
      try { canvas.releasePointerCapture?.(event.pointerId); } catch (_) {}
    };
    canvas.addEventListener("pointerdown", pointerDown);
    canvas.addEventListener("pointermove", pointerMove);
    canvas.addEventListener("pointerup", pointerUp);
    canvas.addEventListener("pointercancel", pointerUp);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();
    canvas.classList.add("is-ready");
    frameId = requestAnimationFrame(animate);

    const modelUrl = this._config.vehicleModelUrl?.trim();
    const bundledModel = typeof TESLA_PULSE_CYBERTRUCK_GLB_BASE64 === "string"
      ? TESLA_PULSE_CYBERTRUCK_GLB_BASE64
      : "";
    if (THREE.GLTFLoader && (modelUrl || bundledModel)) {
      const loader = new THREE.GLTFLoader();
      const onError = (error) => console.warn("Tesla Pulse Card could not load the Cybertruck model.", error);
      if (modelUrl) {
        loader.load(modelUrl, installCybertruck, undefined, onError);
      } else {
        try {
          const binary = atob(bundledModel);
          const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
          loader.parse(bytes.buffer, "", installCybertruck, onError);
        } catch (error) {
          onError(error);
        }
      }
    }

    this._vehicleScene = {
      applyVehicleColor: () => {
        if (!activeModel || disposed) return;
        applyModelAppearance(activeModel);
      },
      dispose: () => {
        disposed = true;
        activeModel = undefined;
        cancelAnimationFrame(frameId);
        resizeObserver.disconnect();
        canvas.removeEventListener("pointerdown", pointerDown);
        canvas.removeEventListener("pointermove", pointerMove);
        canvas.removeEventListener("pointerup", pointerUp);
        canvas.removeEventListener("pointercancel", pointerUp);
        disposeObject(scene);
        renderer.dispose();
      },
    };
  }

  _render() {
    if (!this._config) {
      return;
    }
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
    }
    clearTimeout(this._renderDebounceTimer);
    this._renderDebounceTimer = undefined;
    clearTimeout(this._vehicleInitTimer);
    this._vehicleInitTimer = undefined;
    this._disposeVehicleScene();

    const battery = this._number("battery");
    const range = this._number("range");
    const chargeLimit = this._number("chargeLimit");
    const chargeState = this._value("chargeState", "Disconnected");
    const isCharging = chargeState.toLowerCase() === "charging";
    const telemetry = this._telemetry();
    const awakeStatus = this._awakeStatus();
    const resolvedThemeMode = this._resolvedThemeMode();
    const display = this._config.display || DEFAULT_CONFIG.display;
    const quickActions = this._sanitizeQuickActions(this._config.quickActions);
    const dockActions = display.showHero
      ? quickActions.filter((action) => !SPATIAL_ACTIONS.has(action))
      : quickActions;
    const spatialControls = this._spatialControls();
    const batteryProgress = Math.min(100, Math.max(0, battery ?? 0));
    const chargeLimitProgress = Math.min(100, Math.max(0, chargeLimit ?? 0));
    const limitValuePosition = Math.min(94, Math.max(6, chargeLimitProgress));
    const imageMarkup = this._vehicleRenderMarkup();

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
          --electric: #1688a8;
          --accent-soft: color-mix(in srgb, var(--accent) 13%, transparent);
          --electric-soft: color-mix(in srgb, var(--electric) 10%, transparent);
          --warning: #b96916;
          --danger: #b53e31;
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 8px;
          box-shadow: var(--ha-card-box-shadow, 0 2px 10px rgba(21, 31, 26, 0.08));
          overflow: hidden;
          position: relative;
        }
        .card::before { content: ""; position: absolute; inset: 0 auto 0 0; z-index: 2; width: 3px; background: linear-gradient(180deg, var(--electric), var(--accent), var(--warning)); pointer-events: none; }
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
        .header-status { display: grid; gap: 8px; justify-items: end; }
        .awake-state { display: inline-flex; align-items: center; gap: 7px; min-height: 27px; padding: 0 9px; border: 1px solid var(--line); border-radius: 4px; background: var(--surface-muted); color: var(--muted); font-size: 11px; font-weight: 800; text-transform: uppercase; }
        .awake-state i { width: 7px; height: 7px; border-radius: 50%; background: var(--muted); }
        .awake-state.is-awake { border-color: color-mix(in srgb, var(--electric) 48%, var(--line)); color: var(--electric); background: var(--electric-soft); }
        .awake-state.is-awake i { background: var(--electric); box-shadow: 0 0 0 4px color-mix(in srgb, var(--electric) 14%, transparent); }
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
        .systems { padding: 18px 20px 20px; border-top: 1px solid var(--line); }
        .systems-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: 1px solid var(--line); border-left: 1px solid var(--line); }
        .system-group { min-width: 0; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); background: var(--surface); }
        .system-title { display: flex; align-items: center; min-height: 35px; margin: 0; padding: 0 12px; border-bottom: 1px solid var(--line); background: var(--electric-soft); color: var(--electric); font-size: 11px; font-weight: 800; text-transform: uppercase; }
        .system-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 12px; align-items: baseline; min-height: 36px; padding: 9px 12px; border-bottom: 1px solid var(--line); color: var(--muted); font-size: 12px; }
        .system-row:last-child { border-bottom: 0; }
        .system-row strong { overflow: hidden; color: var(--primary-text-color, #1f2522); font-size: 13px; text-align: right; text-overflow: ellipsis; white-space: nowrap; }
        .dialog-backdrop { position: fixed; inset: 0; z-index: 10; display: grid; place-items: center; padding: 20px; background: rgba(23, 29, 26, 0.5); }
        .dialog { width: min(360px, 100%); padding: 20px; border-radius: 8px; background: var(--surface); box-shadow: 0 14px 42px rgba(0, 0, 0, 0.28); }
        .dialog h2 { font-size: 18px; }
        .dialog p { margin: 8px 0 18px; color: var(--muted); font-size: 14px; line-height: 1.45; }
        .dialog-actions { display: flex; justify-content: flex-end; gap: 8px; }
        .dialog-actions button { min-height: 38px; padding: 0 13px; cursor: pointer; border: 1px solid var(--line); border-radius: 5px; background: transparent; color: var(--primary-text-color, #1f2522); font-weight: 700; }
        .dialog-actions .danger { border-color: var(--danger); background: var(--danger); color: white; }
        .card {
          --cockpit: #0b0f11;
          --cockpit-raised: #151c20;
          --ice: #a9efff;
          --lime: #62e6a7;
          --ember: #ffb85c;
          border: 0;
          background: var(--surface);
          box-shadow: 0 24px 70px rgba(4, 10, 12, 0.24);
        }
        .card.theme-black {
          --tone-bg: #090d0f;
          --tone-raised: #12181b;
          --tone-text: #f5f8f9;
          --tone-muted: #869399;
          --tone-line: rgba(169, 239, 255, 0.13);
          --surface: var(--tone-bg);
          --surface-muted: var(--tone-raised);
          --line: var(--tone-line);
          --muted: var(--tone-muted);
          color-scheme: dark;
        }
        .card.theme-white {
          --tone-bg: #f3f5f4;
          --tone-raised: #ffffff;
          --tone-text: #111719;
          --tone-muted: #5d696e;
          --tone-line: rgba(18, 33, 38, 0.14);
          --surface: var(--tone-bg);
          --surface-muted: var(--tone-raised);
          --line: var(--tone-line);
          --muted: var(--tone-muted);
          color-scheme: light;
        }
        .card.theme-black, .card.theme-white { background: var(--tone-bg); color: var(--tone-text); }
        .card::before { display: none; }
        .cockpit {
          position: relative;
          min-height: 520px;
          overflow: hidden;
          color: var(--tone-text);
          background:
            linear-gradient(122deg, rgba(169, 239, 255, 0.08), transparent 34%),
            linear-gradient(180deg, var(--tone-raised) 0%, var(--tone-bg) 58%, var(--tone-bg) 100%);
        }
        .cockpit::before {
          content: "";
          position: absolute;
          inset: 70px -15% 0;
          opacity: 0.22;
          background-image: linear-gradient(rgba(169, 239, 255, 0.24) 1px, transparent 1px), linear-gradient(90deg, rgba(169, 239, 255, 0.18) 1px, transparent 1px);
          background-size: 38px 38px;
          transform: perspective(440px) rotateX(62deg) scale(1.35);
          transform-origin: center bottom;
          mask-image: linear-gradient(to bottom, transparent 2%, black 76%);
          pointer-events: none;
        }
        .cockpit.no-stage { min-height: 96px; }
        .cockpit.no-stage::before { display: none; }
        .cockpit .topline { position: relative; z-index: 4; padding: 22px 24px 0; }
        .cockpit .eyebrow { color: var(--ice); }
        .cockpit h1 { color: var(--tone-text); font-size: 25px; font-weight: 650; }
        .cockpit .telemetry { color: var(--tone-muted); }
        .cockpit .telemetry.live .telemetry-label { color: var(--lime); }
        .cockpit .awake-state { border-color: var(--tone-line); background: color-mix(in srgb, var(--tone-raised) 82%, transparent); color: var(--tone-muted); }
        .cockpit .awake-state.is-awake { border-color: rgba(98, 230, 167, 0.36); background: rgba(98, 230, 167, 0.09); color: var(--lime); }
        .vehicle-stage { position: relative; z-index: 1; min-height: 560px; }
        .vehicle-render {
          position: absolute;
          z-index: 2;
          left: 50%;
          top: 46px;
          width: min(98%, 730px);
          transform: translateX(-50%);
          animation: vehicle-arrive 720ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
        .vehicle-canvas, .vehicle-vector { display: block; width: 100%; height: 300px; object-fit: contain; filter: drop-shadow(0 24px 28px rgba(0, 0, 0, 0.44)); }
        .vehicle-canvas { cursor: grab; touch-action: none; }
        .vehicle-canvas:active { cursor: grabbing; }
        .vehicle-canvas.is-ready + .vehicle-render-fallback { display: none; }
        .vehicle-render-fallback { position: absolute; inset: 0; }
        .tire-nearby { position: absolute; z-index: 4; left: 50%; bottom: 170px; width: min(316px, calc(100% - 48px)); transform: translateX(-50%); }
        .vehicle-hotspot { position: absolute; z-index: 5; display: grid; place-items: center; width: 35px; height: 35px; padding: 0; cursor: pointer; border: 1px solid rgba(169, 239, 255, 0.34); border-radius: 50%; background: rgba(8, 14, 17, 0.76); color: var(--ice); box-shadow: 0 0 0 5px rgba(169, 239, 255, 0.06), 0 8px 20px rgba(0, 0, 0, 0.28); backdrop-filter: blur(10px); transition: border-color 140ms ease, background-color 140ms ease, transform 140ms ease; }
        .vehicle-hotspot:hover { border-color: var(--ice); background: rgba(22, 50, 58, 0.9); transform: translateY(-2px); }
        .vehicle-hotspot:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
        .vehicle-hotspot ha-icon { --mdc-icon-size: 18px; width: 18px; height: 18px; color: currentColor; }
        .vehicle-hotspot::after { content: ""; position: absolute; top: 100%; width: 1px; height: 22px; background: linear-gradient(to bottom, rgba(169, 239, 255, 0.62), transparent); }
        .vehicle-hotspot::before { content: attr(data-label); position: absolute; top: calc(100% + 8px); left: 50%; padding: 3px 6px; border: 1px solid var(--tone-line); border-radius: 3px; color: var(--tone-text); background: color-mix(in srgb, var(--tone-bg) 88%, transparent); font-size: 8px; font-weight: 800; text-transform: uppercase; white-space: nowrap; transform: translateX(-50%); }
        .vehicle-hotspot { left: 50%; top: 50%; transform: translate(-50%, -50%); }
        .vehicle-hotspot:hover { transform: translate(-50%, calc(-50% - 2px)); }
        .metric-orbit { position: absolute; z-index: 3; top: 54px; display: grid; min-width: 126px; }
        .metric-orbit.battery-orbit { left: 24px; }
        .metric-orbit.range-orbit { right: 24px; justify-items: end; text-align: right; }
        .orbit-label { color: var(--tone-muted); font-size: 10px; font-weight: 800; text-transform: uppercase; }
        .orbit-value { margin-top: 2px; color: var(--tone-text); font-size: 40px; font-weight: 300; line-height: 1; }
        .orbit-value small { margin-left: 2px; color: var(--ice); font-size: 14px; font-weight: 700; }
        .orbit-detail { margin-top: 7px; color: var(--tone-muted); font-size: 11px; font-style: normal; }
        .stage-ribbon {
          position: absolute;
          z-index: 4;
          left: 24px;
          right: 24px;
          bottom: 56px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          border-block: 1px solid var(--tone-line);
          background: color-mix(in srgb, var(--tone-bg) 82%, transparent);
          backdrop-filter: blur(12px);
        }
        .stage-state { min-width: 0; padding: 11px 13px; border-right: 1px solid var(--tone-line); }
        .stage-state:last-child { border-right: 0; }
        .stage-state span { display: block; color: var(--tone-muted); font-size: 9px; font-weight: 800; text-transform: uppercase; }
        .stage-state strong { display: block; margin-top: 4px; overflow: hidden; color: var(--tone-text); font-size: 13px; font-weight: 650; text-overflow: ellipsis; white-space: nowrap; }
        .stage-state.is-active strong { color: var(--lime); }
        .stage-state.is-alert strong { color: #ff776e; }
        .energy-rail { position: absolute; z-index: 4; left: 24px; right: 24px; bottom: 24px; height: 6px; overflow: visible; background: var(--tone-line); }
        .energy-fill { position: relative; height: 100%; width: ${batteryProgress}%; min-width: ${battery === undefined ? 0 : 6}px; background: ${isCharging ? "var(--lime)" : "var(--ice)"}; box-shadow: 0 0 18px ${isCharging ? "rgba(98, 230, 167, 0.62)" : "rgba(169, 239, 255, 0.5)"}; }
        .energy-fill::after { content: ""; position: absolute; inset: -3px 0 -3px auto; width: 2px; background: #fff; }
        .energy-limit { position: absolute; top: -5px; left: calc(${chargeLimitProgress}% - 1px); width: 2px; height: 16px; background: var(--ember); }
        .energy-value { position: absolute; bottom: 11px; z-index: 1; min-width: 34px; color: var(--ember); font-size: 12px; font-weight: 800; letter-spacing: 0; text-align: center; transform: translateX(-50%); }
        .energy-value[hidden] { display: none; }
        .energy-caption { position: absolute; z-index: 4; right: 24px; bottom: 4px; color: var(--tone-muted); font-size: 10px; }
        .charging-readout { position: relative; z-index: 2; padding: 13px 24px 15px; border-top: 1px solid var(--tone-line); background: var(--tone-bg); color: var(--tone-text); }
        .charging-readout .status-label { color: var(--lime); }
        .charging-readout .charging-values { color: var(--tone-text); }
        .command-deck { padding: 22px 24px 24px; border-top: 1px solid var(--tone-line); background: var(--tone-raised); color: var(--tone-text); }
        .command-deck .section-heading { margin-bottom: 14px; }
        .command-deck h2 { color: var(--tone-text); }
        .command-deck .status-label { color: var(--tone-muted); }
        .command-deck .controls { grid-template-columns: repeat(auto-fit, minmax(94px, 1fr)); gap: 10px; }
        .command-deck .control { display: grid; grid-template-rows: 25px minmax(28px, auto); place-items: center; min-height: 82px; padding: 11px 7px 9px; border-color: var(--tone-line); background: color-mix(in srgb, var(--tone-bg) 62%, transparent); color: var(--tone-text); }
        .command-deck .control:hover { border-color: rgba(169, 239, 255, 0.62); background: rgba(169, 239, 255, 0.1); }
        .command-deck .control ha-icon { width: 22px; height: 22px; margin: 0; color: var(--ice); }
        .command-deck .control-label { overflow: visible; color: var(--tone-text); font-size: 11px; line-height: 1.2; text-overflow: clip; white-space: normal; }
        .telemetry-surface, .systems { background: var(--tone-bg); color: var(--tone-text); }
        .systems { border-top: 0; padding: 24px; }
        .systems .section-heading { margin-bottom: 16px; }
        .systems .section-heading h2 { color: var(--tone-text); font-size: 17px; }
        .systems .status-label { color: var(--tone-muted); }
        .systems-grid { gap: 14px; border: 0; background: transparent; }
        .system-group { position: relative; display: grid; grid-template-columns: 1fr; gap: 0; min-width: 0; padding: 0; border: 0; border-top: 2px solid var(--system-accent, var(--ice)); border-radius: 0; background: transparent; color: var(--tone-text); }
        .system-group::before { display: none; }
        .system-environment { --system-accent: #62e6a7; }
        .system-high-voltage { --system-accent: #ffb85c; }
        .system-charging { --system-accent: #a9efff; }
        .system-custom { --system-accent: #ff8f70; }
        .system-tires { --system-accent: #bba7ff; }
        .system-title { display: flex; align-items: center; gap: 8px; min-height: 34px; margin: 0; padding: 0 4px; border: 0; background: transparent; color: var(--system-accent); font-size: 10px; }
        .system-title ha-icon { width: 17px; height: 17px; color: currentColor; }
        .system-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, auto); grid-template-rows: 1fr 2px; column-gap: 12px; align-items: center; min-height: 46px; padding: 7px 4px; border: 0; border-bottom: 1px solid color-mix(in srgb, var(--system-accent) 18%, var(--tone-line)); border-radius: 0; background: transparent; color: var(--tone-muted); text-align: left; }
        button.system-row { cursor: pointer; font: inherit; }
        button.system-row:hover { background: color-mix(in srgb, var(--system-accent) 8%, transparent); }
        button.system-row:focus-visible { outline: 2px solid var(--system-accent); outline-offset: 2px; }
        .system-row { --effective-accent: var(--row-accent, var(--system-accent)); }
        .system-row span { min-width: 0; overflow: hidden; font-size: 10px; font-weight: 800; letter-spacing: 0; text-overflow: ellipsis; text-transform: uppercase; white-space: nowrap; }
        .system-row strong { max-width: 128px; overflow: hidden; color: var(--tone-text); font-size: 14px; line-height: 1; text-align: right; text-overflow: ellipsis; white-space: nowrap; }
        .system-row i { grid-column: 1 / -1; display: block; height: 2px; opacity: 0.68; background: linear-gradient(90deg, var(--effective-accent), transparent 66%); }
        .system-row span ha-icon { width: 15px; height: 15px; color: var(--effective-accent); }
        .custom-sensor-row { --row-accent: var(--custom-accent); }
        .custom-sensor-row span { display: inline-flex; align-items: center; gap: 6px; }
        .custom-sensor-row ha-icon { width: 15px; height: 15px; color: var(--custom-accent); }
        .tire-line { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1px; overflow: hidden; border: 1px solid color-mix(in srgb, var(--system-accent) 22%, var(--tone-line)); border-radius: 6px; background: color-mix(in srgb, var(--system-accent) 12%, transparent); }
        .tire-line span, .tire-line button { min-width: 0; padding: 10px 7px; border: 0; background: color-mix(in srgb, var(--tone-bg) 74%, transparent); color: inherit; font: inherit; text-align: center; }
        .tire-line button { cursor: pointer; }
        .tire-line button:hover { background: color-mix(in srgb, var(--system-accent) 13%, var(--tone-bg)); }
        .tire-line button:focus-visible { outline: 2px solid var(--system-accent); outline-offset: -2px; }
        .tire-line b { display: block; color: var(--system-accent); font-size: 9px; }
        .tire-line strong { display: block; margin-top: 4px; overflow: hidden; color: var(--tone-text); font-size: 13px; text-overflow: ellipsis; white-space: nowrap; }
        .control.is-commanding { animation: command-pulse 720ms cubic-bezier(0.2, 0.8, 0.2, 1); }
        .control.is-commanding ha-icon { animation: command-icon 720ms cubic-bezier(0.2, 0.8, 0.2, 1); }
        .vehicle-hotspot.is-commanding { animation: hotspot-command 720ms cubic-bezier(0.2, 0.8, 0.2, 1); }
        @keyframes command-pulse { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(169, 239, 255, 0.56); } 32% { transform: scale(0.94); box-shadow: 0 0 0 10px rgba(169, 239, 255, 0.1); } 100% { transform: scale(1); box-shadow: 0 0 0 16px rgba(169, 239, 255, 0); } }
        @keyframes command-icon { 35% { transform: rotate(-18deg) scale(1.2); color: var(--lime); } 100% { transform: rotate(0) scale(1); } }
        @keyframes hotspot-command { 0% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 0 5px rgba(169, 239, 255, 0.06); } 32% { transform: translate(-50%, -50%) scale(0.86); box-shadow: 0 0 0 14px rgba(169, 239, 255, 0.14); } 100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 0 5px rgba(169, 239, 255, 0.06); } }
        .card.theme-white .vehicle-hotspot { border-color: rgba(22, 136, 168, 0.3); background: rgba(255, 255, 255, 0.86); color: #116f89; box-shadow: 0 0 0 5px rgba(22, 136, 168, 0.06), 0 8px 20px rgba(21, 37, 42, 0.16); }
        .card.theme-white .stage-state.is-active strong { color: #087a52; }
        .card.theme-white .charging-readout .status-label { color: #087a52; }
        @keyframes vehicle-arrive {
          from { opacity: 0; transform: translate(-50%, 20px) scale(0.96); }
          to { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }
        @media (max-width: 480px) {
          .cockpit { min-height: 548px; }
          .cockpit .topline { padding: 17px 16px 0; }
          .cockpit h1 { font-size: 21px; }
          .vehicle-stage { min-height: 600px; }
          .vehicle-render { top: 60px; width: 100%; }
          .tire-nearby { bottom: 178px; width: calc(100% - 32px); }
          .metric-orbit { top: 53px; min-width: 100px; }
          .metric-orbit.battery-orbit { left: 16px; }
          .metric-orbit.range-orbit { right: 16px; }
          .orbit-value { font-size: 32px; }
          .stage-ribbon { left: 16px; right: 16px; bottom: 54px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .stage-state:nth-child(2) { border-right: 0; }
          .stage-state:nth-child(-n+2) { border-bottom: 1px solid rgba(169, 239, 255, 0.12); }
          .energy-rail { left: 16px; right: 16px; bottom: 22px; }
          .charging-readout, .command-deck, .systems { padding-left: 16px; padding-right: 16px; }
          .command-deck .controls { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
          .command-deck .control { min-height: 86px; }
          .systems-grid { grid-template-columns: 1fr; }
        }
      </style>
      <article class="card theme-${resolvedThemeMode} ${display.compact ? "compact" : ""}" aria-label="${this._escape(this._config.title)} dashboard">
        <section class="cockpit ${display.showHero ? "" : "no-stage"}">
          <header class="topline">
            <div><span class="eyebrow">Tesla Pulse / Vehicle link</span><h1>${this._escape(this._config.title)}</h1></div>
            <div class="header-status">
              <span class="awake-state ${awakeStatus.active ? "is-awake" : ""}"><i></i>${awakeStatus.label}</span>
              <div class="telemetry ${telemetry.state}"><span class="telemetry-label">${telemetry.label}</span><span>${telemetry.detail}</span></div>
            </div>
          </header>
          <div class="vehicle-stage" ${display.showHero ? "" : "hidden"}>
            <div class="metric-orbit battery-orbit"><span class="orbit-label">State of charge</span><strong class="orbit-value">${battery === undefined ? "--" : Math.round(battery)}<small>%</small></strong><em class="orbit-detail">${this._escape(chargeState)}</em></div>
            <div class="metric-orbit range-orbit"><span class="orbit-label">Projected range</span><strong class="orbit-value">${range === undefined ? "--" : Math.round(range)}<small>${range === undefined ? "" : "km"}</small></strong><em class="orbit-detail">${chargeLimit === undefined ? "No limit" : `Limit ${Math.round(chargeLimit)}%`}</em></div>
            <div class="vehicle-render">${imageMarkup}</div>
            <div class="tire-nearby">${this._tireLine()}</div>
            ${spatialControls.map((control) => `<button class="vehicle-hotspot hotspot-${control.anchor}" type="button" data-label="${control.label}" data-vehicle-anchor="${control.anchor}" data-action="${control.action}" aria-label="${control.ariaLabel}" title="${control.ariaLabel}"><ha-icon icon="mdi:${control.icon}"></ha-icon></button>`).join("")}
            <div class="stage-ribbon" ${display.showStatus ? "" : "hidden"}>
              <div class="stage-state ${this._statusTone(this._isOn("climate"))}"><span>Cabin</span><strong>${this._isOn("climate") ? "Climate active" : this._value("insideTemperature", "Climate off")}</strong></div>
              <div class="stage-state ${this._statusTone(!this._isLocked(), !this._isLocked())}"><span>Access</span><strong>${this._isLocked() ? "Secured" : "Unlocked"}</strong></div>
              <div class="stage-state ${this._statusTone(this._isOn("sentry"))}"><span>Guardian</span><strong>${this._isOn("sentry") ? "Sentry armed" : "Sentry off"}</strong></div>
              <div class="stage-state ${this._statusTone(this._isOn("windows"), this._isOn("windows"))}"><span>Windows</span><strong>${this._isOn("windows") ? "Open" : "Closed"}</strong></div>
            </div>
            <div class="energy-rail" aria-label="Battery level ${batteryProgress} percent, charge limit ${chargeLimit ?? "unknown"} percent"><div class="energy-fill"></div><span class="energy-value" style="left: ${limitValuePosition}%" ${chargeLimit === undefined ? "hidden" : ""}>${chargeLimit === undefined ? "" : `${Math.round(chargeLimit)}%`}</span>${chargeLimit === undefined ? "" : `<span class="energy-limit" title="Charge limit ${Math.round(chargeLimit)} percent"></span>`}</div><span class="energy-caption">${isCharging ? "Energy flowing" : "High-voltage reserve"}</span>
          </div>
        </section>
        <section class="charging-readout" ${(isCharging && display.showCharging) ? "" : "hidden"} aria-label="Charging details">
          <span class="status-label">Charging link active</span>
          <div class="charging-values"><span>${this._escape(this._value("chargePower", "Power unavailable"))}</span><span>${this._escape(this._value("chargeRate", "Rate unavailable"))}</span><span>${this._escape(this._value("timeToFull", "ETA unavailable"))}</span></div>
        </section>
        <section class="command-deck" ${(display.showControls && dockActions.length) ? "" : "hidden"}>
          <div class="section-heading"><h2>Command dock</h2><span class="status-label">Encrypted vehicle controls</span></div>
          <div class="controls">
            ${dockActions.map((action) => this._controlMarkup(action)).join("")}
          </div>
        </section>
        <div class="telemetry-surface">
          <section class="systems" aria-label="Vehicle systems" ${display.showHealth ? "" : "hidden"}>
            <div class="section-heading"><h2>Telemetry lattice</h2><span class="status-label">Useful systems / live</span></div>
            <div class="systems-grid">
              <div class="system-group system-environment"><h3 class="system-title"><ha-icon icon="mdi:home-thermometer-outline"></ha-icon>Environment</h3>${TELEMETRY_SENSOR_FIELDS.filter(([group]) => group === "environment").map(([, key, label]) => this._systemRow(label, key)).join("")}${this._config.customSensors.map((sensor, index) => sensor.group === "environment" ? this._customSensorRow(sensor, index) : "").join("")}</div>
              <div class="system-group system-high-voltage"><h3 class="system-title"><ha-icon icon="mdi:flash"></ha-icon>High voltage</h3>${TELEMETRY_SENSOR_FIELDS.filter(([group]) => group === "highVoltage").map(([, key, label]) => this._systemRow(label, key)).join("")}${this._config.customSensors.map((sensor, index) => sensor.group === "highVoltage" ? this._customSensorRow(sensor, index) : "").join("")}</div>
              <div class="system-group system-charging"><h3 class="system-title"><ha-icon icon="mdi:ev-station"></ha-icon>Charging interface</h3>${TELEMETRY_SENSOR_FIELDS.filter(([group]) => group === "charging").map(([, key, label]) => this._systemRow(label, key)).join("")}${this._config.customSensors.map((sensor, index) => sensor.group === "charging" ? this._customSensorRow(sensor, index) : "").join("")}</div>
            </div>
          </section>
        </div>
        ${this._pendingAction ? this._confirmationMarkup() : ""}
      </article>
    `;
    this._bindEvents();
    if (this._inEditMode()) {
      this._vehicleInitTimer = setTimeout(() => {
        this._vehicleInitTimer = undefined;
        if (!this.isConnected) return;
        this._initVehicleScene();
      }, 180);
    } else {
      this._initVehicleScene();
    }
    this._isRendered = true;
  }

  _control(action, icon, label, active) {
    return `<button class="control ${active ? "is-active" : ""}" type="button" data-action="${action}" aria-label="${label}"><ha-icon icon="mdi:${icon}"></ha-icon><span class="control-label">${label}</span></button>`;
  }

  _confirmationMarkup() {
    return `<div class="dialog-backdrop" role="presentation"><section class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title"><h2 id="confirm-title">Confirm ${this._escape(this._pendingAction.label)}</h2><p>${this._escape(this._pendingAction.message)}</p><div class="dialog-actions"><button type="button" data-dialog-action="cancel">Cancel</button><button class="danger" type="button" data-dialog-action="confirm">Confirm</button></div></section></div>`;
  }

  _bindEvents() {
    this.shadowRoot.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => {
        this._animateAction(button);
        this._handleAction(button.dataset.action);
      });
    });
    this.shadowRoot.querySelectorAll("[data-sensor-entity]").forEach((sensor) => {
      sensor.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("hass-more-info", {
          detail: { entityId: sensor.dataset.sensorEntity },
          bubbles: true,
          composed: true,
        }));
      });
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
  }

  _handleAction(action) {
    const actionMetadata = {
      lock: {
        label: "unlock",
        message: "This will unlock the vehicle.",
        requiresConfirmation: !this._isLocked() ? false : this._config.confirmations.unlock,
      },
      frunk: { label: "open frunk", message: "This will open the front trunk.", requiresConfirmation: this._config.confirmations.cargo },
      openFrunk: { label: "open frunk", message: "This will open the front trunk.", requiresConfirmation: this._config.confirmations.cargo },
      trunk: { label: "open trunk", message: "This will open the rear trunk.", requiresConfirmation: this._config.confirmations.cargo },
      openTrunk: { label: "open trunk", message: "This will open the rear trunk.", requiresConfirmation: this._config.confirmations.cargo },
    }[action];

    if (actionMetadata?.requiresConfirmation) {
      this._pendingAction = { action, ...actionMetadata };
      this._render();
      return;
    }
    this._executeAction(action);
  }

  _animateAction(button) {
    button.classList.remove("is-commanding");
    void button.offsetWidth;
    button.classList.add("is-commanding");
    const clearAnimation = () => button.classList.remove("is-commanding");
    button.addEventListener("animationend", clearAnimation, { once: true });
    window.setTimeout(clearAnimation, 800);
  }

  _executeAction(action) {
    const entityId = this._entityId(action);
    if (!entityId) {
      return;
    }

    if (ACTION_DEFINITIONS[action]?.moreInfo) {
      this.dispatchEvent(new CustomEvent("hass-more-info", {
        detail: { entityId },
        bubbles: true,
        composed: true,
      }));
      return;
    }

    if (!this._hass?.callService) {
      return;
    }

    const entityDomain = entityId.split(".")[0];
    if (["button", "input_button"].includes(entityDomain)) {
      this._hass.callService(entityDomain, "press", { entity_id: entityId });
      return;
    }

    const serviceByAction = {
      lock: ["lock", this._isLocked() ? "unlock" : "lock"],
      climate: ["climate", this._isOn("climate") ? "turn_off" : "turn_on"],
      sentry: ["switch", this._isOn("sentry") ? "turn_off" : "turn_on"],
      chargePort: ["switch", this._isOn("chargePort") ? "turn_off" : "turn_on"],
      openChargePort: ["switch", "turn_on"],
      closeChargePort: ["switch", "turn_off"],
      frunk: ["cover", "open_cover"],
      openFrunk: ["cover", "open_cover"],
      trunk: ["cover", "open_cover"],
      openTrunk: ["cover", "open_cover"],
      ventWindows: ["cover", "open_cover"],
      closeWindows: ["cover", "close_cover"],
      defrost: ["switch", "turn_on"],
      startPreconditioning: ["switch", "turn_on"],
      stopPreconditioning: ["switch", "turn_off"],
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

if (!customElements.get(CARD_TYPE)) {
  customElements.define(CARD_TYPE, TeslaPulseCard);
}

const EDITOR_SENSOR_FIELDS = [
  ["battery", "Battery level"],
  ["range", "Estimated range"],
  ["chargeState", "Charging state"],
  ["chargePower", "Charge power"],
  ["chargeRate", "Charge rate"],
  ["timeToFull", "Time to full charge"],
  ["telemetry", "Telemetry status"],
  ["vehicleAwake", "Vehicle awake status"],
  ["windows", "Windows"],
  ["insideTemperature", "Cabin temperature"],
  ["outsideTemperature", "Outside temperature"],
  ["batteryBalance", "Battery balance"],
  ["voltageImbalance", "Voltage imbalance"],
  ["odometer", "Odometer"],
  ["energyRemaining", "Energy remaining"],
  ["packVoltage", "Pack voltage"],
  ["packCurrent", "Pack current"],
  ["chargeCurrent", "Charge current"],
  ["chargerVoltage", "Charger voltage"],
  ["chargeEnergyAdded", "Charge energy added"],
  ["chargingCableType", "Charging cable type"],
  ["chargePortLatch", "Charge port latch"],
  ["batteryHeater", "Battery heater"],
  ["frontLeftTirePressure", "Front left tire pressure"],
  ["frontRightTirePressure", "Front right tire pressure"],
  ["rearLeftTirePressure", "Rear left tire pressure"],
  ["rearRightTirePressure", "Rear right tire pressure"],
];

const EDITOR_COMMAND_FIELDS = [
  ["chargeLimit", "Charge limit control"],
  ["lock", "Door lock command"],
  ["climate", "Climate command"],
  ["sentry", "Sentry command"],
  ["chargePort", "Charge port control (legacy)"],
  ["openChargePort", "Open charge port command"],
  ["closeChargePort", "Close charge port command"],
  ["frunk", "Frunk cover (legacy)"],
  ["openFrunk", "Open frunk command"],
  ["trunk", "Trunk cover (legacy)"],
  ["openTrunk", "Open trunk command"],
  ["windows", "Windows control"],
  ["ventWindows", "Vent windows command"],
  ["closeWindows", "Close windows command"],
  ["defrost", "Defrost command"],
  ["flashLights", "Flash lights command"],
  ["honk", "Honk horn command"],
  ["wake", "Wake up command"],
  ["startPreconditioning", "Start battery preconditioning command"],
  ["stopPreconditioning", "Stop battery preconditioning command"],
  ["targetTemperature", "Target temperature control"],
  ["frontLeftSeatHeater", "Front left seat heater control"],
  ["frontRightSeatHeater", "Front right seat heater control"],
  ["rearLeftSeatHeater", "Rear left seat heater control"],
  ["rearRightSeatHeater", "Rear right seat heater control"],
  ["steeringWheelHeater", "Steering wheel heater control"],
];

const EDITOR_DISPLAY_FIELDS = [
  ["compact", "Compact mode"],
  ["showHero", "Show 3D vehicle"],
  ["showCharging", "Show charging session details"],
  ["showStatus", "Show vehicle status section"],
  ["showControls", "Show quick controls section"],
  ["showHealth", "Show health and systems sections"],
];

class TeslaPulseCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = {
      ...DEFAULT_CONFIG,
      ...config,
      entities: { ...DEFAULT_CONFIG.entities, ...(config?.entities || {}) },
      entityMode: config?.entityMode === "manual" ? "manual" : "auto",
      themeMode: ["black", "white"].includes(config?.themeMode) ? config.themeMode : "auto",
      vehicleColor: VEHICLE_COLORS[config?.vehicleColor] ? config.vehicleColor : DEFAULT_CONFIG.vehicleColor,
      vehicleScale: normalizeVehicleScale(config?.vehicleScale),
      sensorTapAction: config?.sensorTapAction === "none" ? "none" : "more-info",
      sensorVisuals: config?.sensorVisuals && typeof config.sensorVisuals === "object" ? config.sensorVisuals : {},
      customSensors: Array.isArray(config?.customSensors)
        ? config.customSensors.filter(Boolean).map((sensor) => ({
            entity: typeof sensor.entity === "string" ? sensor.entity.trim() : "",
            label: typeof sensor.label === "string" && sensor.label.trim() ? sensor.label.trim() : "Custom sensor",
            icon: typeof sensor.icon === "string" ? sensor.icon.trim().replace(/^mdi:/, "") : "",
            display: sensor.display === "state" ? "state" : "value",
            accent: CUSTOM_SENSOR_ACCENTS[sensor.accent] ? sensor.accent : "rose",
            group: TELEMETRY_GROUPS[sensor.group] ? sensor.group : "environment",
          }))
        : [],
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
    this._syncEntityPickers();
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
        .segmented {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          overflow: hidden;
          border: 1px solid var(--divider-color, #c7cfcb);
          border-radius: 6px;
        }
        .segment { position: relative; min-width: 0; }
        .segment + .segment { border-left: 1px solid var(--divider-color, #c7cfcb); }
        .segment input { position: absolute; width: 1px; height: 1px; opacity: 0; }
        .segment span { display: grid; min-height: 38px; place-items: center; padding: 0 10px; cursor: pointer; color: var(--secondary-text-color, #68716c); background: var(--card-background-color, #fff); font-size: 12px; font-weight: 700; }
        .segment input:checked + span { color: var(--text-primary-color, #fff); background: var(--primary-color, #1688a8); }
        .segment input:focus-visible + span { outline: 2px solid var(--primary-color, #1688a8); outline-offset: -2px; }
        .color-picker { display: flex; flex-wrap: wrap; gap: 10px; }
        .color-choice { position: relative; }
        .color-choice input { position: absolute; width: 1px; height: 1px; opacity: 0; }
        .color-choice span { display: block; width: 30px; height: 30px; cursor: pointer; border: 1px solid var(--divider-color, #c7cfcb); border-radius: 50%; box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.22); }
        .color-choice input:checked + span { outline: 2px solid var(--primary-color, #1688a8); outline-offset: 3px; }
        .color-choice input:focus-visible + span { outline: 2px solid var(--primary-color, #1688a8); outline-offset: 3px; }
        .scale-control { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 12px; align-items: center; }
        .scale-control input[type="range"] { width: 100%; accent-color: var(--primary-color, #1688a8); }
        .scale-control output { min-width: 42px; color: var(--primary-text-color, #1f2522); font-size: 12px; font-weight: 800; text-align: right; }
        .custom-sensor { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 98px 104px 116px auto; gap: 8px; align-items: end; }
        .sensor-visual { display: grid; grid-template-columns: minmax(0, 1fr) 98px 104px 92px; gap: 8px; align-items: end; padding-block: 8px; border-bottom: 1px solid var(--divider-color, #c7cfcb); }
        button.editor-button { min-height: 38px; padding: 0 12px; cursor: pointer; border: 1px solid var(--divider-color, #c7cfcb); border-radius: 6px; background: var(--card-background-color, #fff); color: var(--primary-text-color, #1f2522); font: inherit; font-weight: 700; }
        button.editor-button:hover { border-color: var(--primary-color, #1688a8); color: var(--primary-color, #1688a8); }
        @media (max-width: 680px) {
          .grid { grid-template-columns: 1fr; }
          .check-grid { grid-template-columns: 1fr; }
          .custom-sensor { grid-template-columns: 1fr; }
        }
      </style>
      <section class="editor">
        <h3>Tesla Pulse Card</h3>
        <div class="grid">
          <div class="field full">
            <label for="title">Card title</label>
            <input id="title" type="text" data-key="title" value="${this._escape(this._config.title || "")}" />
          </div>
          <div class="field full">
            <label for="vehicle-model-url">Cybertruck model URL override</label>
            <input id="vehicle-model-url" type="text" data-key="vehicleModelUrl" value="${this._escape(this._config.vehicleModelUrl || "")}" placeholder="Use bundled Cybertruck model" />
          </div>
          <div class="field full">
            <label>Vehicle color</label>
            <div class="color-picker" role="radiogroup" aria-label="Cybertruck exterior color">
              ${Object.entries(VEHICLE_COLORS).map(([key, color]) => `
                <label class="color-choice"><input type="radio" name="vehicle-color" data-key="vehicleColor" value="${key}" aria-label="${color.label}" ${this._config.vehicleColor === key ? "checked" : ""} /><span style="background: ${color.hex}" title="${color.label}"></span></label>
              `).join("")}
            </div>
          </div>
          <div class="field full">
            <label for="vehicle-scale">Vehicle scale</label>
            <div class="scale-control"><input id="vehicle-scale" type="range" min="0.75" max="1.2" step="0.05" data-key="vehicleScale" value="${this._config.vehicleScale}" aria-label="Vehicle scale" /><output for="vehicle-scale">${Math.round(this._config.vehicleScale * 100)}%</output></div>
          </div>
        </div>

        <div class="field full">
          <label>Appearance</label>
          <div class="segmented" role="radiogroup" aria-label="Card appearance">
            ${[["auto", "Auto"], ["black", "Black"], ["white", "White"]].map(([value, label]) => `
              <label class="segment"><input type="radio" name="theme-mode" data-theme-mode value="${value}" ${this._config.themeMode === value ? "checked" : ""} /><span>${label}</span></label>
            `).join("")}
          </div>
        </div>

        <div class="field full">
          <label>Sensor tap</label>
          <div class="segmented" role="radiogroup" aria-label="Sensor tap behavior">
            ${[["more-info", "Open detail"], ["none", "No action"]].map(([value, label]) => `
              <label class="segment"><input type="radio" name="sensor-tap-action" data-sensor-tap-action value="${value}" ${this._config.sensorTapAction === value ? "checked" : ""} /><span>${label}</span></label>
            `).join("")}
          </div>
        </div>

        <div class="field full">
          <label for="entity-mode">Entity source</label>
          <select id="entity-mode" data-key="entityMode">
            <option value="auto" ${this._config.entityMode === "auto" ? "selected" : ""}>Automatically detect Tesla Pulse entities</option>
            <option value="manual" ${this._config.entityMode === "manual" ? "selected" : ""}>Choose every entity manually</option>
          </select>
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
          <label>Command dock actions</label>
          <div class="check-grid">
            ${Object.entries(ACTION_DEFINITIONS).filter(([key]) => !SPATIAL_ACTIONS.has(key)).map(([key, definition]) => `
              <label class="toggle"><input type="checkbox" data-action-key="${key}" ${this._config.quickActions.includes(key) ? "checked" : ""} /> ${definition.label}</label>
            `).join("")}
          </div>
          <p class="hint">Lock, climate, frunk, and trunk controls live directly on the vehicle stage.</p>
        </div>

        <div class="field full">
          <label>Sensor entities</label>
          <div class="grid">
            ${EDITOR_SENSOR_FIELDS.map(([key, label]) => `
              <div class="field">
                <label for="entity-${key}">${label}</label>
                <ha-entity-picker id="entity-${key}" data-entity-key="${key}" label="${label}"></ha-entity-picker>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="field full">
          <label>Built-in telemetry appearance</label>
          <div class="field">
            ${TELEMETRY_SENSOR_FIELDS.map(([, key, fallbackLabel]) => {
              const visual = this._config.sensorVisuals[key] || {};
              return `<div class="sensor-visual"><div class="field"><label for="sensor-visual-label-${key}">${fallbackLabel}</label><input id="sensor-visual-label-${key}" type="text" data-sensor-visual-label="${key}" value="${this._escape(visual.label || fallbackLabel)}" /></div><div class="field"><label for="sensor-visual-icon-${key}">Icon</label><input id="sensor-visual-icon-${key}" type="text" data-sensor-visual-icon="${key}" value="${this._escape(visual.icon || "")}" placeholder="flash" /></div><div class="field"><label for="sensor-visual-display-${key}">Text</label><select id="sensor-visual-display-${key}" data-sensor-visual-display="${key}"><option value="value" ${visual.display !== "state" ? "selected" : ""}>Value + unit</option><option value="state" ${visual.display === "state" ? "selected" : ""}>Raw state</option></select></div><div class="field"><label for="sensor-visual-accent-${key}">Accent</label><select id="sensor-visual-accent-${key}" data-sensor-visual-accent="${key}"><option value="" ${!visual.accent ? "selected" : ""}>Group</option>${Object.keys(CUSTOM_SENSOR_ACCENTS).map((accent) => `<option value="${accent}" ${visual.accent === accent ? "selected" : ""}>${accent}</option>`).join("")}</select></div></div>`;
            }).join("")}
          </div>
          <p class="hint">Override the label, icon, text format, or accent for any existing telemetry row.</p>
        </div>

        <div class="field full">
          <label>Custom telemetry</label>
          <div class="field">
            ${this._config.customSensors.map((sensor, index) => `
              <div class="custom-sensor" data-custom-sensor-row="${index}">
                <div class="field"><label for="custom-sensor-label-${index}">Label</label><input id="custom-sensor-label-${index}" type="text" data-custom-sensor-label="${index}" value="${this._escape(sensor.label)}" /></div>
                <div class="field"><label for="custom-sensor-entity-${index}">Entity</label><ha-entity-picker id="custom-sensor-entity-${index}" data-custom-sensor-entity="${index}" label="Entity"></ha-entity-picker></div>
                <div class="field"><label for="custom-sensor-icon-${index}">Icon</label><input id="custom-sensor-icon-${index}" type="text" data-custom-sensor-icon="${index}" value="${this._escape(sensor.icon)}" placeholder="thermometer" /></div>
                <div class="field"><label for="custom-sensor-display-${index}">Text</label><select id="custom-sensor-display-${index}" data-custom-sensor-display="${index}"><option value="value" ${sensor.display === "value" ? "selected" : ""}>Value + unit</option><option value="state" ${sensor.display === "state" ? "selected" : ""}>Raw state</option></select><label for="custom-sensor-accent-${index}">Accent</label><select id="custom-sensor-accent-${index}" data-custom-sensor-accent="${index}">${Object.keys(CUSTOM_SENSOR_ACCENTS).map((accent) => `<option value="${accent}" ${sensor.accent === accent ? "selected" : ""}>${accent}</option>`).join("")}</select></div>
                <div class="field"><label for="custom-sensor-group-${index}">Group</label><select id="custom-sensor-group-${index}" data-custom-sensor-group="${index}">${Object.entries(TELEMETRY_GROUPS).map(([group, groupLabel]) => `<option value="${group}" ${sensor.group === group ? "selected" : ""}>${groupLabel}</option>`).join("")}</select></div>
                <button class="editor-button" type="button" data-remove-custom-sensor="${index}" aria-label="Remove ${this._escape(sensor.label)}">Remove</button>
              </div>
            `).join("")}
            <button class="editor-button" type="button" data-add-custom-sensor>Add telemetry entity</button>
          </div>
          <p class="hint">Add any Home Assistant entity as a live telemetry readout with an optional custom label.</p>
        </div>

        <div class="field full">
          <label>Command entities</label>
          <div class="grid">
            ${EDITOR_COMMAND_FIELDS.map(([key, label]) => `
              <div class="field">
                <label for="entity-${key}">${label}</label>
                <ha-entity-picker id="entity-${key}" data-entity-key="${key}" label="${label}"></ha-entity-picker>
              </div>
            `).join("")}
          </div>
        </div>

        <p class="hint">Select any sensor or command entity from Home Assistant. Automatic mode uses Tesla Pulse suffixes for fields left empty; manual mode uses only the selections made here.</p>
      </section>
    `;

    this._syncEntityPickers();

    this.shadowRoot.querySelectorAll("input[data-key]").forEach((input) => {
      input.addEventListener("change", (event) => {
        this._updateConfig(event.target.dataset.key, event.target.value.trim());
      });
    });

    this.shadowRoot.querySelectorAll('input[data-key="vehicleScale"]').forEach((input) => {
      input.addEventListener("input", (event) => {
        const output = event.target.parentElement?.querySelector("output");
        if (output) {
          output.textContent = `${Math.round(Number(event.target.value) * 100)}%`;
        }
      });
    });

    this.shadowRoot.querySelectorAll("select[data-key]").forEach((select) => {
      select.addEventListener("change", (event) => {
        this._updateConfig(event.target.dataset.key, event.target.value);
      });
    });

    this.shadowRoot.querySelectorAll("input[data-theme-mode]").forEach((input) => {
      input.addEventListener("change", (event) => {
        if (event.target.checked) {
          this._updateConfig("themeMode", event.target.value);
        }
      });
    });

    this.shadowRoot.querySelectorAll("input[data-sensor-tap-action]").forEach((input) => {
      input.addEventListener("change", (event) => {
        if (event.target.checked) {
          this._updateConfig("sensorTapAction", event.target.value);
        }
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

    this.shadowRoot.querySelectorAll("ha-entity-picker[data-entity-key]").forEach((picker) => {
      picker.addEventListener("value-changed", (event) => {
        const key = event.currentTarget.dataset.entityKey;
        const value = event.detail.value || "";
        this._updateEntityConfig(key, value);
      });
    });

    this.shadowRoot.querySelectorAll("input[data-custom-sensor-label]").forEach((input) => {
      input.addEventListener("change", (event) => {
        const index = Number(event.target.dataset.customSensorLabel);
        this._updateCustomSensor(index, { label: event.target.value.trim() });
      });
    });
    this.shadowRoot.querySelectorAll("input[data-custom-sensor-icon]").forEach((input) => {
      input.addEventListener("change", (event) => {
        const index = Number(event.target.dataset.customSensorIcon);
        this._updateCustomSensor(index, { icon: event.target.value.trim().replace(/^mdi:/, "") });
      });
    });
    this.shadowRoot.querySelectorAll("input[data-sensor-visual-label], input[data-sensor-visual-icon]").forEach((input) => {
      input.addEventListener("change", (event) => {
        const key = event.target.dataset.sensorVisualLabel ?? event.target.dataset.sensorVisualIcon;
        const visualKey = event.target.dataset.sensorVisualLabel !== undefined ? "label" : "icon";
        const value = visualKey === "icon" ? event.target.value.trim().replace(/^mdi:/, "") : event.target.value.trim();
        this._updateSensorVisual(key, { [visualKey]: value });
      });
    });
    this.shadowRoot.querySelectorAll("select[data-sensor-visual-display], select[data-sensor-visual-accent]").forEach((select) => {
      select.addEventListener("change", (event) => {
        const key = event.target.dataset.sensorVisualDisplay ?? event.target.dataset.sensorVisualAccent;
        const visualKey = event.target.dataset.sensorVisualDisplay !== undefined ? "display" : "accent";
        this._updateSensorVisual(key, { [visualKey]: event.target.value });
      });
    });
    this.shadowRoot.querySelectorAll("select[data-custom-sensor-display], select[data-custom-sensor-accent], select[data-custom-sensor-group]").forEach((select) => {
      select.addEventListener("change", (event) => {
        const index = Number(event.target.dataset.customSensorDisplay ?? event.target.dataset.customSensorAccent ?? event.target.dataset.customSensorGroup);
        const key = event.target.dataset.customSensorDisplay !== undefined
          ? "display"
          : event.target.dataset.customSensorAccent !== undefined ? "accent" : "group";
        this._updateCustomSensor(index, { [key]: event.target.value });
      });
    });
    this.shadowRoot.querySelectorAll("ha-entity-picker[data-custom-sensor-entity]").forEach((picker) => {
      const index = Number(picker.dataset.customSensorEntity);
      picker.hass = this._hass;
      picker.value = this._config.customSensors[index]?.entity || "";
      picker.addEventListener("value-changed", (event) => {
        this._updateCustomSensor(index, { entity: event.detail.value || "" });
      });
    });
    this.shadowRoot.querySelector("[data-add-custom-sensor]")?.addEventListener("click", () => {
      this._emitConfig({
        ...this._config,
        customSensors: [...this._config.customSensors, { entity: "", label: "Custom sensor", icon: "", display: "value", accent: "rose", group: "environment" }],
      });
    });
    this.shadowRoot.querySelectorAll("[data-remove-custom-sensor]").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.removeCustomSensor);
        this._emitConfig({
          ...this._config,
          customSensors: this._config.customSensors.filter((_, sensorIndex) => sensorIndex !== index),
        });
      });
    });
  }

  _syncEntityPickers() {
    if (!this.shadowRoot || !this._config) {
      return;
    }

    this.shadowRoot.querySelectorAll("ha-entity-picker[data-entity-key]").forEach((picker) => {
      const key = picker.dataset.entityKey;
      picker.hass = this._hass;
      picker.value = this._config.entities[key] || "";
      picker.configValue = key;
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

  _updateCustomSensor(index, changes) {
    const customSensors = this._config.customSensors.map((sensor, sensorIndex) => sensorIndex === index
      ? { ...sensor, ...changes }
      : sensor);
    this._emitConfig({ ...this._config, customSensors });
  }

  _updateSensorVisual(key, changes) {
    this._emitConfig({
      ...this._config,
      sensorVisuals: {
        ...(this._config.sensorVisuals || {}),
        [key]: {
          ...(this._config.sensorVisuals?.[key] || {}),
          ...changes,
        },
      },
    });
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

if (!customElements.get("tesla-pulse-card-editor")) {
  customElements.define("tesla-pulse-card-editor", TeslaPulseCardEditor);
}

window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === CARD_TYPE)) {
  window.customCards.push({
    type: CARD_TYPE,
    name: "Tesla Pulse Card",
    description: "Tesla Pulse-aware vehicle dashboard",
    preview: true,
  });
}