import { loadCatalog } from "./data.js";
import { createInitialState, saveState } from "./store.js";
import { bindEvents, paint } from "./events.js";
import { applyPreferences } from "./accessibility.js";
import { navigate } from "./router.js";

const ctx = {
  state: null,
  catalog: null,
  rewardFilter: "all",
  offline: !navigator.onLine,
  render() {
    paint(this);
    this.syncOffline();
  },
  setOffline(offline) {
    this.offline = offline;
    this.syncOffline();
  },
  syncOffline() {
    const shell = document.getElementById("app");
    const current = document.getElementById("offline-banner");
    if (this.offline && !current) {
      const banner = document.createElement("p");
      banner.id = "offline-banner";
      banner.className = "mx-5 rounded-xl bg-[#fff4d6] px-4 py-3 text-sm font-semibold text-[#0B376B]";
      banner.textContent = "Modo sin conexión. Tu avance se guardará en este dispositivo.";
      shell.insertBefore(banner, document.getElementById("main-content"));
    }
    if (!this.offline && current) current.remove();
  }
};

async function start() {
  applyPreferences();
  try {
    ctx.catalog = await loadCatalog();
    ctx.state = createInitialState(ctx.catalog.mockProfile);
    saveState(ctx.state);
    bindEvents(ctx);
    if (!window.location.hash) navigate("/inicio");
    else ctx.render();
  } catch (error) {
    document.getElementById("main-content").textContent =
      "No pudimos cargar Desafío Acoge. Abre la app con un servidor local, por ejemplo python -m http.server 8080";
    console.error(error);
  }
}

start();
