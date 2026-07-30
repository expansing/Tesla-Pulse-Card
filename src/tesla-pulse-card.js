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
  fart: "fart",
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
  fart: { label: "Fart", icon: "weather-windy" },
  targetTemperature: { label: "Target temperature", icon: "thermometer", moreInfo: true },
  frontLeftSeatHeater: { label: "Front left seat", icon: "car-seat-heater", moreInfo: true },
  frontRightSeatHeater: { label: "Front right seat", icon: "car-seat-heater", moreInfo: true },
  rearLeftSeatHeater: { label: "Rear left seat", icon: "car-seat-heater", moreInfo: true },
  rearRightSeatHeater: { label: "Rear right seat", icon: "car-seat-heater", moreInfo: true },
  steeringWheelHeater: { label: "Steering wheel heat", icon: "steering", moreInfo: true },
};

const SPATIAL_ACTIONS = new Set(["lock", "climate", "frunk", "openFrunk", "trunk", "openTrunk"]);

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

    this._config = {
      ...DEFAULT_CONFIG,
      ...config,
      entities: { ...DEFAULT_CONFIG.entities, ...(config.entities || {}) },
      themeMode: ["black", "white"].includes(config.themeMode) ? config.themeMode : "auto",
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

  _formattedVoltageImbalance() {
    const state = this._state("voltageImbalance");
    if (!state || ["unknown", "unavailable", "none"].includes(state.state)) {
      return "Not received";
    }

    const value = Number.parseFloat(state.state);
    if (!Number.isFinite(value)) {
      return this._value("voltageImbalance", "Not received");
    }

    const rounded = Math.round(value * 100) / 100;
    const unit = state.attributes?.unit_of_measurement;
    return unit ? `${rounded} ${unit}` : String(rounded);
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
    const value = key === "voltageImbalance"
      ? this._formattedVoltageImbalance()
      : this._value(key, fallback);
    return `<div class="system-row"><span>${label}</span><strong>${this._escape(value)}</strong></div>`;
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
      <canvas class="vehicle-canvas" aria-label="Interactive 3D electric sports sedan"></canvas>
      <svg class="vehicle-vector vehicle-render-fallback" viewBox="0 0 720 300" role="img" aria-label="Model 3-style digital vehicle twin">
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
    camera.position.set(1.55, 1.9, 8.1);
    camera.lookAt(0, 0.55, 0);

    const vehicle = new THREE.Group();
    vehicle.rotation.y = 0;
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
      color: 0x1e6172,
      emissive: 0x08242d,
      emissiveIntensity: 0.5,
      metalness: 0.55,
      roughness: 0.18,
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
      { x: -2.5, centerY: 0.34, halfHeight: 0.2, halfWidth: 0.3 },
      { x: -2.25, centerY: 0.4, halfHeight: 0.31, halfWidth: 0.65 },
      { x: -1.65, centerY: 0.43, halfHeight: 0.38, halfWidth: 0.83 },
      { x: -0.8, centerY: 0.44, halfHeight: 0.4, halfWidth: 0.88 },
      { x: 0.15, centerY: 0.45, halfHeight: 0.41, halfWidth: 0.9 },
      { x: 1.05, centerY: 0.43, halfHeight: 0.38, halfWidth: 0.86 },
      { x: 1.82, centerY: 0.39, halfHeight: 0.31, halfWidth: 0.73 },
      { x: 2.36, centerY: 0.32, halfHeight: 0.21, halfWidth: 0.46 },
      { x: 2.53, centerY: 0.29, halfHeight: 0.1, halfWidth: 0.18 },
    ]);
    vehicle.add(new THREE.Mesh(bodyGeometry, bodyMaterial));

    const roofGeometry = createLoftGeometry([
      { x: -1.2, centerY: 0.72, halfHeight: 0.12, halfWidth: 0.56 },
      { x: -0.88, centerY: 0.74, halfHeight: 0.46, halfWidth: 0.7 },
      { x: -0.32, centerY: 0.76, halfHeight: 0.7, halfWidth: 0.76 },
      { x: 0.35, centerY: 0.76, halfHeight: 0.72, halfWidth: 0.74 },
      { x: 0.95, centerY: 0.73, halfHeight: 0.52, halfWidth: 0.62 },
      { x: 1.36, centerY: 0.68, halfHeight: 0.12, halfWidth: 0.38 },
    ], 24, true);
    vehicle.add(new THREE.Mesh(roofGeometry, glassMaterial));

    const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.18, 1.56), darkMaterial);
    lowerBody.position.set(0, 0.02, 0);
    vehicle.add(lowerBody);

    const wheelGeometry = new THREE.CylinderGeometry(0.39, 0.39, 0.23, 36);
    const rimGeometry = new THREE.CylinderGeometry(0.27, 0.27, 0.238, 20);
    const hubGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.244, 16);
    const spokeGeometry = new THREE.BoxGeometry(0.045, 0.2, 0.025);
    for (const wheelX of [-1.65, 1.65]) {
      for (const wheelZ of [-0.82, 0.82]) {
        const wheel = new THREE.Mesh(wheelGeometry, tireMaterial);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(wheelX, 0.14, wheelZ);
        vehicle.add(wheel);
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        rim.rotation.x = Math.PI / 2;
        rim.position.set(wheelX, 0.14, wheelZ * 1.01);
        vehicle.add(rim);
        const hub = new THREE.Mesh(hubGeometry, darkMaterial);
        hub.rotation.x = Math.PI / 2;
        hub.position.set(wheelX, 0.14, wheelZ * 1.02);
        vehicle.add(hub);
        for (let index = 0; index < 5; index += 1) {
          const spoke = new THREE.Mesh(spokeGeometry, darkMaterial);
          spoke.rotation.set(0, 0, index * Math.PI / 2.5);
          spoke.position.set(wheelX, 0.14, wheelZ * 1.025);
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

    const anchors = {
      trunk: { point: new THREE.Vector3(-2.05, 0.78, 0), offsetY: 0 },
      lock: { point: new THREE.Vector3(-0.18, 0.88, -0.88), offsetY: 0 },
      climate: { point: new THREE.Vector3(0.28, 1.3, 0), offsetY: -38 },
      frunk: { point: new THREE.Vector3(1.95, 0.76, 0), offsetY: 0 },
    };
    const hotspotElements = Object.fromEntries(
      [...stage.querySelectorAll("[data-vehicle-anchor]")].map((element) => [element.dataset.vehicleAnchor, element]),
    );

    let disposed = false;
    let frameId;
    let yaw = 0;
    let targetYaw = yaw;
    let dragging = false;
    let previousX = 0;

    const resize = () => {
      const width = Math.max(1, canvas.clientWidth);
      const height = Math.max(1, canvas.clientHeight);
      renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
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
      vehicle.rotation.y = yaw + (dragging ? 0 : Math.sin(time * 0.00035) * 0.025);
      updateHotspots();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    const pointerDown = (event) => {
      dragging = true;
      previousX = event.clientX;
      canvas.setPointerCapture?.(event.pointerId);
    };
    const pointerMove = (event) => {
      if (!dragging) return;
      targetYaw += (event.clientX - previousX) * 0.012;
      previousX = event.clientX;
    };
    const pointerUp = (event) => {
      dragging = false;
      canvas.releasePointerCapture?.(event.pointerId);
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

    this._vehicleScene = {
      dispose: () => {
        disposed = true;
        cancelAnimationFrame(frameId);
        resizeObserver.disconnect();
        canvas.removeEventListener("pointerdown", pointerDown);
        canvas.removeEventListener("pointermove", pointerMove);
        canvas.removeEventListener("pointerup", pointerUp);
        canvas.removeEventListener("pointercancel", pointerUp);
        scene.traverse((object) => {
          object.geometry?.dispose?.();
          if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
          else object.material?.dispose?.();
        });
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
    const frunkAction = this._entityId("openFrunk") ? "openFrunk" : "frunk";
    const trunkAction = this._entityId("openTrunk") ? "openTrunk" : "trunk";
    const spatialControls = [
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
    const batteryProgress = Math.min(100, Math.max(0, battery ?? 0));
    const chargeLimitProgress = Math.min(100, Math.max(0, chargeLimit ?? 0));
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
        .vehicle-stage { position: relative; z-index: 1; min-height: 445px; }
        .vehicle-render {
          position: absolute;
          z-index: 2;
          left: 50%;
          top: 82px;
          width: min(98%, 730px);
          transform: translateX(-50%);
          animation: vehicle-arrive 720ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
        .vehicle-canvas, .vehicle-vector { display: block; width: 100%; height: 300px; object-fit: contain; filter: drop-shadow(0 24px 28px rgba(0, 0, 0, 0.44)); }
        .vehicle-canvas { cursor: grab; touch-action: pan-y; }
        .vehicle-canvas:active { cursor: grabbing; }
        .vehicle-canvas.is-ready + .vehicle-render-fallback { display: none; }
        .vehicle-render-fallback { position: absolute; inset: 0; }
        .vehicle-hotspot { position: absolute; z-index: 5; display: grid; place-items: center; width: 35px; height: 35px; padding: 0; cursor: pointer; border: 1px solid rgba(169, 239, 255, 0.34); border-radius: 50%; background: rgba(8, 14, 17, 0.76); color: var(--ice); box-shadow: 0 0 0 5px rgba(169, 239, 255, 0.06), 0 8px 20px rgba(0, 0, 0, 0.28); backdrop-filter: blur(10px); transition: border-color 140ms ease, background-color 140ms ease, transform 140ms ease; }
        .vehicle-hotspot:hover { border-color: var(--ice); background: rgba(22, 50, 58, 0.9); transform: translateY(-2px); }
        .vehicle-hotspot:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
        .vehicle-hotspot ha-icon { width: 18px; height: 18px; }
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
        .energy-caption { position: absolute; right: 0; bottom: 10px; color: var(--tone-muted); font-size: 10px; }
        .charging-readout { position: relative; z-index: 2; padding: 13px 24px 15px; border-top: 1px solid var(--tone-line); background: var(--tone-bg); color: var(--tone-text); }
        .charging-readout .status-label { color: var(--lime); }
        .charging-readout .charging-values { color: var(--tone-text); }
        .command-deck { padding: 20px 24px 22px; border-top: 1px solid var(--tone-line); background: var(--tone-bg); color: var(--tone-text); }
        .command-deck .section-heading { margin-bottom: 13px; }
        .command-deck h2 { color: var(--tone-text); }
        .command-deck .status-label { color: var(--tone-muted); }
        .command-deck .controls { grid-template-columns: repeat(6, minmax(0, 1fr)); }
        .command-deck .control { min-height: 68px; border-color: var(--tone-line); background: var(--tone-raised); color: var(--tone-text); }
        .command-deck .control:hover { border-color: rgba(169, 239, 255, 0.48); background: rgba(169, 239, 255, 0.08); }
        .command-deck .control ha-icon { color: var(--ice); }
        .telemetry-surface, .systems, .system-group { background: var(--tone-bg); color: var(--tone-text); }
        .systems { border-top: 0; padding: 22px 24px 24px; }
        .systems .section-heading { margin-bottom: 15px; }
        .systems .section-heading h2 { font-size: 17px; }
        .systems-grid { border-color: var(--line); }
        .system-title { background: transparent; color: var(--electric); }
        .system-row { border-color: var(--tone-line); color: var(--tone-muted); }
        .system-row strong { color: var(--tone-text); }
        .systems-grid, .system-group, .system-title { border-color: var(--tone-line); }
        .systems .section-heading h2 { color: var(--tone-text); }
        .systems .status-label { color: var(--tone-muted); }
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
          .vehicle-stage { min-height: 486px; }
          .vehicle-render { top: 110px; width: 100%; }
          .metric-orbit { top: 53px; min-width: 100px; }
          .metric-orbit.battery-orbit { left: 16px; }
          .metric-orbit.range-orbit { right: 16px; }
          .orbit-value { font-size: 32px; }
          .stage-ribbon { left: 16px; right: 16px; bottom: 54px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .stage-state:nth-child(2) { border-right: 0; }
          .stage-state:nth-child(-n+2) { border-bottom: 1px solid rgba(169, 239, 255, 0.12); }
          .energy-rail { left: 16px; right: 16px; bottom: 22px; }
          .charging-readout, .command-deck, .systems { padding-left: 16px; padding-right: 16px; }
          .command-deck .controls { grid-template-columns: repeat(3, minmax(0, 1fr)); }
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
            ${spatialControls.map((control) => `<button class="vehicle-hotspot hotspot-${control.anchor}" type="button" data-label="${control.label}" data-vehicle-anchor="${control.anchor}" data-action="${control.action}" aria-label="${control.ariaLabel}" title="${control.ariaLabel}"><ha-icon icon="mdi:${control.icon}"></ha-icon></button>`).join("")}
            <div class="stage-ribbon" ${display.showStatus ? "" : "hidden"}>
              <div class="stage-state ${this._statusTone(this._isOn("climate"))}"><span>Cabin</span><strong>${this._isOn("climate") ? "Climate active" : this._value("insideTemperature", "Climate off")}</strong></div>
              <div class="stage-state ${this._statusTone(!this._isLocked(), !this._isLocked())}"><span>Access</span><strong>${this._isLocked() ? "Secured" : "Unlocked"}</strong></div>
              <div class="stage-state ${this._statusTone(this._isOn("sentry"))}"><span>Guardian</span><strong>${this._isOn("sentry") ? "Sentry armed" : "Sentry off"}</strong></div>
              <div class="stage-state ${this._statusTone(this._isOn("windows"), this._isOn("windows"))}"><span>Windows</span><strong>${this._isOn("windows") ? "Open" : "Closed"}</strong></div>
            </div>
            <div class="energy-rail" aria-label="Battery level ${batteryProgress} percent"><div class="energy-fill"></div>${chargeLimit === undefined ? "" : `<span class="energy-limit" title="Charge limit ${Math.round(chargeLimit)} percent"></span>`}<span class="energy-caption">${isCharging ? "Energy flowing" : "High-voltage reserve"}</span></div>
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
              <div class="system-group"><h3 class="system-title">Environment</h3>${this._systemRow("Cabin", "insideTemperature")}${this._systemRow("Outside", "outsideTemperature")}${this._systemRow("Odometer", "odometer")}${this._systemRow("Energy remaining", "energyRemaining")}</div>
              <div class="system-group"><h3 class="system-title">High voltage</h3>${this._systemRow("Pack voltage", "packVoltage")}${this._systemRow("Pack current", "packCurrent")}${this._systemRow("Battery heater", "batteryHeater")}${this._systemRow("Balance", "batteryBalance")}${this._systemRow("Brick delta", "voltageImbalance")}</div>
              <div class="system-group"><h3 class="system-title">Charging interface</h3>${this._systemRow("Charge current", "chargeCurrent")}${this._systemRow("Charger voltage", "chargerVoltage")}${this._systemRow("Energy added", "chargeEnergyAdded")}${this._systemRow("Cable", "chargingCableType")}${this._systemRow("Port latch", "chargePortLatch")}</div>
              <div class="system-group"><h3 class="system-title">Tire pressure</h3>${this._systemRow("Front left", "frontLeftTirePressure")}${this._systemRow("Front right", "frontRightTirePressure")}${this._systemRow("Rear left", "rearLeftTirePressure")}${this._systemRow("Rear right", "rearRightTirePressure")}</div>
            </div>
          </section>
        </div>
        ${this._pendingAction ? this._confirmationMarkup() : ""}
      </article>
    `;
    this._bindEvents();
    this._initVehicleScene();
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
  ["fart", "Fart command"],
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
        @media (max-width: 680px) {
          .grid { grid-template-columns: 1fr; }
          .check-grid { grid-template-columns: 1fr; }
        }
      </style>
      <section class="editor">
        <h3>Tesla Pulse Card</h3>
        <div class="grid">
          <div class="field full">
            <label for="title">Card title</label>
            <input id="title" type="text" data-key="title" value="${this._escape(this._config.title || "")}" />
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