export function parseHash(hash = window.location.hash) {
  const raw = (hash || "").replace(/^#/, "") || "/inicio";
  const parts = raw.split("/").filter(Boolean);
  const [first = "inicio", second, third] = parts;

  if (first === "misiones" && second) {
    return { name: "mission-detail", params: { missionId: second } };
  }
  if (first === "actividad" && second) {
    return { name: "activity", params: { activityId: second } };
  }
  if (first === "actividad-resumen" && second) {
    return { name: "mission-summary", params: { missionId: second } };
  }
  if (first === "premios" && second === "historial") {
    return { name: "reward-history", params: {} };
  }
  if (first === "mas" && second === "accesibilidad") {
    return { name: "accessibility", params: {} };
  }

  const names = {
    inicio: "home",
    misiones: "missions",
    pasaporte: "passport",
    premios: "rewards",
    mas: "more"
  };
  return { name: names[first] || "home", params: { extra: third } };
}

export function navigate(path) {
  const target = path.startsWith("#") ? path : `#${path}`;
  if (window.location.hash === target) {
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    return;
  }
  window.location.hash = target;
}

export function currentNav() {
  const { name } = parseHash();
  if (name === "mission-detail") return "missions";
  if (name === "activity" || name === "mission-summary") return null;
  if (name === "reward-history") return "rewards";
  if (name === "accessibility") return "more";
  return name;
}
