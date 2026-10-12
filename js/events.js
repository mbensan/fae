import { findById } from "./data.js";
import { navigate, parseHash } from "./router.js";
import {
  completeActivity,
  missingPoints,
  redeemReward,
  resetState,
  saveState,
  missionStatus
} from "./store.js";
import { applyPreferences, closeDialog, focusMain, openDialog } from "./accessibility.js";
import { dialogContent, el, renderHeader, renderNav, renderScreen, toast } from "./render.js";
import { cx, ui } from "./ui.js";

export function bindEvents(ctx) {
  document.addEventListener("click", (event) => onClick(event, ctx));
  document.addEventListener("submit", (event) => onSubmit(event, ctx));
  document.addEventListener("change", (event) => onChange(event, ctx));
  window.addEventListener("hashchange", () => ctx.render());
  window.addEventListener("offline", () => ctx.setOffline(true));
  window.addEventListener("online", () => ctx.setOffline(false));

  const dialog = document.getElementById("app-dialog");
  dialog.addEventListener("close", () => {});
}

function onChange(event, ctx) {
  const target = event.target;
  if (target && target.name === "activity-option") {
    const button = document.getElementById("answer-button");
    if (button) button.disabled = false;
  }
  if (target?.dataset.action === "toggle-text") {
    localStorage.setItem("desafioAcoge:text", target.checked ? "large" : "off");
    applyPreferences();
  }
  if (target?.dataset.action === "toggle-contrast") {
    localStorage.setItem("desafioAcoge:contrast", target.checked ? "high" : "off");
    applyPreferences();
  }
}

function onSubmit(event, ctx) {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || form.id !== "activity-form") return;
  event.preventDefault();
  const activity = findById(ctx.catalog.activities, form.dataset.activityId);
  if (!activity) return;
  const selected = [...form.querySelectorAll("[name='activity-option']:checked")].map((input) => input.value);
  if (selected.length === 0) return;

  const result = completeActivity(ctx.state, activity, selected, ctx.catalog);
  const saved = saveState(ctx.state);
  ctx.render();
  const feedback = document.getElementById("activity-feedback");
  if (feedback) feedback.focus();
  if (!saved) toast("No pudimos guardar el avance. Reintenta o continúa sin cerrar esta pestaña.");
  else if (!result.alreadyAwarded) toast(`+${result.pointsAwarded} puntos`);
  if (result.newBadges[0]) {
    showSimple(ctx, "Insignia desbloqueada", `${result.newBadges[0].title}. ${result.newBadges[0].description}`);
  }
}

function onClick(event, ctx) {
  const dialogLink = event.target.closest("dialog a[href]");
  if (dialogLink) closeDialog(document.getElementById("app-dialog"));

  const actionEl = event.target.closest("[data-action]");
  if (!actionEl) return;
  const action = actionEl.dataset.action;

  if (action === "back") {
    event.preventDefault();
    const route = parseHash();
    if (route.name === "activity" || route.name === "mission-summary") navigate("/misiones");
    else if (route.name === "mission-detail") navigate("/misiones");
    else if (route.name === "reward-history") navigate("/premios");
    else if (route.name === "accessibility") navigate("/mas");
    else if (window.history.length > 1) window.history.back();
    else navigate("/inicio");
    return;
  }

  if (action === "open-points") {
    event.preventDefault();
    const movements = (ctx.state.pointMovements || []).slice().reverse().slice(0, 8);
    const list = el(
      "ul",
      { class: "grid list-none gap-3 p-0" },
      movements.length
        ? movements.map((item) =>
            el("li", {}, `${item.delta > 0 ? "+" : ""}${item.delta} · ${item.label}`)
          )
        : el("li", {}, "Aún no hay movimientos.")
    );
    showDialog(ctx, "Tus puntos", list, [closeButton()]);
    return;
  }

  if (action === "open-community") {
    event.preventDefault();
    showSimple(
      ctx,
      "Comunidad",
      "Este espacio reunirá a familias que se están preparando. En el MVP no hay ranking ni comparación entre participantes."
    );
    return;
  }

  if (action === "locked-mission") {
    event.preventDefault();
    const mission = findById(ctx.catalog.missions, actionEl.dataset.missionId);
    const prereq = findById(ctx.catalog.missions, mission?.prerequisites.at(-1));
    showSimple(ctx, "Misión bloqueada", `Completa la ${prereq ? prereq.title : "misión anterior"} para desbloquear esta misión.`);
    return;
  }

  if (action === "filter-rewards") {
    event.preventDefault();
    ctx.rewardFilter = actionEl.dataset.filter;
    ctx.render();
    return;
  }

  if (action === "redeem") {
    event.preventDefault();
    const reward = findById(ctx.catalog.rewards, actionEl.dataset.rewardId);
    const missing = missingPoints(ctx.state, reward);
    if (missing > 0) return;
    showDialog(ctx, "Confirmar canje", el("p", {}, `¿Confirmas el canje de “${reward.title}” por ${reward.cost} puntos? El MVP no procesa pagos ni despachos reales.`), [
      el("button", { class: cx(ui.btn, ui.btnReward, "w-full"), type: "button", "data-action": "confirm-redeem", dataset: { rewardId: reward.id } }, "Confirmar"),
      closeButton()
    ]);
    return;
  }

  if (action === "confirm-redeem") {
    event.preventDefault();
    const reward = findById(ctx.catalog.rewards, actionEl.dataset.rewardId);
    const result = redeemReward(ctx.state, reward);
    const dialog = document.getElementById("app-dialog");
    closeDialog(dialog);
    if (!result.ok) {
      toast(result.reason);
      return;
    }
    const saved = saveState(ctx.state);
    ctx.render();
    toast(saved ? `${reward.actionLabel} confirmado` : "No pudimos guardar el canje.");
    return;
  }

  if (action === "reset-demo") {
    event.preventDefault();
    showDialog(ctx, "Reiniciar demo", el("p", {}, "Esto restaura el perfil de Camila, los 350 puntos y el avance inicial. No se puede deshacer."), [
      el("button", { class: cx(ui.btn, ui.btnDanger), type: "button", "data-action": "confirm-reset" }, "Reiniciar demo"),
      closeButton()
    ]);
    return;
  }

  if (action === "confirm-reset") {
    event.preventDefault();
    ctx.state = resetState(ctx.catalog.mockProfile);
    closeDialog(document.getElementById("app-dialog"));
    navigate("/inicio");
    toast("Demo restaurada");
    ctx.render();
    return;
  }

  if (action === "close-dialog") {
    event.preventDefault();
    closeDialog(document.getElementById("app-dialog"));
    return;
  }

  if (action === "open-help") {
    event.preventDefault();
    showSimple(ctx, "Ayuda", "Completa misiones, responde casos y canjea puntos. Si te equivocas, verás una explicación para seguir aprendiendo. Nada de esto evalúa si puedes acoger.");
    return;
  }

  if (action === "open-privacy") {
    event.preventDefault();
    showSimple(ctx, "Privacidad", "Todos los casos son ficticios. El avance se guarda solo en este dispositivo con localStorage. El MVP no envía datos a un servidor.");
    return;
  }

  if (action === "open-credits") {
    event.preventDefault();
    const list = el(
      "ul",
      { class: "grid list-none gap-3 p-0" },
      ...ctx.catalog.sources.map((source) =>
        el("li", {}, el("a", { class: "font-semibold text-[#07559A]", href: source.url, target: "_blank", rel: "noopener noreferrer" }, `${source.title} — ${source.publisher}`))
      )
    );
    showDialog(ctx, "Créditos y fuentes", list, [closeButton()]);
    return;
  }

  if (action === "open-stamp") {
    event.preventDefault();
    const mission = findById(ctx.catalog.missions, actionEl.dataset.missionId);
    const status = missionStatus(mission, ctx.state, ctx.catalog.missions);
    showDialog(
      ctx,
      mission.title,
      el("p", {}, `${status === "locked" ? "Aún no disponible. " : ""}${mission.shortDescription}`),
      status === "locked"
        ? [closeButton()]
        : [el("a", { class: cx(ui.btn, ui.btnPrimary), href: `#/misiones/${mission.id}` }, "Ver misión"), closeButton()]
    );
    return;
  }

  if (action === "open-badge") {
    event.preventDefault();
    const badge = findById(ctx.catalog.badges, actionEl.dataset.badgeId);
    const owned = ctx.state.badgeIds.includes(badge.id);
    showSimple(ctx, badge.title, `${owned ? "Ya la obtuviste. " : "Aún no desbloqueada. "}${badge.description}`);
  }
}

function closeButton() {
  return el("button", { class: cx(ui.btn, ui.btnSecondary), type: "button", "data-action": "close-dialog" }, "Cerrar");
}

function showDialog(ctx, title, body, actions) {
  const dialog = dialogContent(title, body, actions);
  openDialog(dialog, () => {});
}

function showSimple(ctx, title, text) {
  showDialog(ctx, title, el("p", {}, text), [closeButton()]);
}

export function paint(ctx) {
  const route = parseHash();
  const dialog = document.getElementById("app-dialog");
  if (dialog?.open) closeDialog(dialog);
  renderHeader(route, ctx.state);
  renderScreen(route, ctx.state, ctx.catalog, ctx.rewardFilter);
  renderNav(route);
  focusMain();
}
