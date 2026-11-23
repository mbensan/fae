export const TYPE_LABELS = {
  "single-choice": "Opción única",
  "myth-reality": "Mito o realidad",
  "true-false": "Verdadero o falso",
  "multiple-choice": "Selección múltiple",
  case: "Caso práctico",
  reflection: "Reflexión",
  "family-activity": "Actividad familiar"
};

export const MAP_NODES = [
  { order: 0, top: 82, left: 33, align: "top" },
  { order: 1, top: 73, left: 37, align: "right" },
  { order: 2, top: 63, left: 47, align: "right" },
  { order: 3, top: 54, left: 40, align: "right" },
  { order: 4, top: 45, left: 50, align: "right" },
  { order: 5, top: 36, left: 42, align: "left" },
  { order: 6, top: 26, left: 48, align: "left" },
  { order: 7, top: 13, left: 50, align: "right" }
];

const ICON_KEYS = {
  sprout: "sprout",
  door: "door",
  binoculars: "binoculars",
  home: "homeFill",
  people: "people",
  storm: "storm",
  "paper-plane": "paperPlane",
  flag: "flag"
};

export function iconKey(name) {
  return ICON_KEYS[name] || "sprout";
}

export function statusLabel(status) {
  return {
    completed: "Completada",
    current: "En curso",
    available: "Disponible",
    locked: "Bloqueada"
  }[status];
}

export function pinIconName(status, mission) {
  if (status === "completed") return "pinCheck";
  if (status === "locked") return "pinLock";
  const key = iconKey(mission.icon);
  return key === "door" ? "pinDoor" : key;
}
