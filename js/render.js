import { icon } from "./icons.js";
import { currentNav } from "./router.js";
import { findById } from "./data.js";
import {
  currentMission,
  firstIncompleteActivity,
  missionProgress,
  missionStatus,
  missingPoints
} from "./store.js";
import { optionLetter } from "./scoring.js";
import { cx, ui } from "./ui.js";

const TYPE_LABELS = {
  "single-choice": "Opción única",
  "myth-reality": "Mito o realidad",
  "true-false": "Verdadero o falso",
  "multiple-choice": "Selección múltiple",
  case: "Caso práctico",
  reflection: "Reflexión",
  "family-activity": "Actividad familiar"
};

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;
    if (key === "class") node.className = value;
    else if (key === "dataset") Object.assign(node.dataset, value);
    else if (key === "html") node.innerHTML = value;
    else if (key === "checked" || key === "disabled" || key === "hidden") node[key] = Boolean(value);
    else if (key === "value") node.value = value;
    else node.setAttribute(key, value);
  }
  for (const child of children.flat()) {
    if (child == null || child === false) continue;
    node.append(child.nodeType ? child : document.createTextNode(String(child)));
  }
  return node;
}

function svg(name) {
  return el("span", { class: "inline-flex items-center justify-center leading-none", html: icon(name) });
}

function brand(compact = false) {
  return el(
    "a",
    { class: ui.brand, href: "#/inicio", "aria-label": "Desafío Acoge, ir al inicio" },
    el("span", { class: compact ? ui.brandDesafioSm : ui.brandDesafio }, "DESAFÍO"),
    el("span", { class: compact ? ui.brandAcogeSm : ui.brandAcoge }, "ACOGE")
  );
}

function pointsPill(state) {
  return el(
    "button",
    {
      class: ui.points,
      type: "button",
      "aria-label": `${state.points} puntos`,
      "data-action": "open-points"
    },
    svg("heart"),
    el("strong", {}, String(state.points))
  );
}

function avatar() {
  const node = el("div", { class: ui.avatar, "aria-hidden": "true" });
  node.innerHTML = `<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#d7ecff"/><circle cx="24" cy="18" r="8" fill="#c68642"/><path fill="#07559A" d="M8 42c2-10 8-14 16-14s14 4 16 14z"/><path fill="#2b2b2b" d="M12 18c4-10 20-10 24 0 0-8-6-12-12-12S12 10 12 18z"/></svg>`;
  return node;
}

export function renderHeader(route, state) {
  const header = document.getElementById("app-header");
  header.replaceChildren();
  if (route.name === "home") {
    header.className = ui.headerHome;
    header.append(
      brand(true),
      el(
        "div",
        { class: "flex items-center gap-3 text-right" },
        el(
          "div",
          { class: "grid" },
          el("span", { class: "text-sm font-bold" }, `Hola, ${state.displayName}`),
          el("span", { class: ui.eyebrow }, `Nivel ${state.level}`)
        ),
        avatar()
      )
    );
    return;
  }

  header.className = route.name === "missions" ? ui.headerMissions : ui.header;
  header.append(
    el("button", { class: `${ui.iconBtn} shrink-0`, type: "button", "aria-label": "Volver", "data-action": "back" }, svg("back")),
    el("div", { class: "min-w-0 flex-1" }, brand(true)),
    pointsPill(state)
  );
}

export function renderNav(route) {
  const nav = document.getElementById("bottom-nav");
  const current = currentNav();
  if (!current) {
    nav.hidden = true;
    nav.className = "hidden";
    nav.replaceChildren();
    return;
  }
  nav.hidden = false;
  nav.className = ui.nav;
  const items = [
    ["home", "#/inicio", "home", "Inicio"],
    ["missions", "#/misiones", "map", "Misiones"],
    ["passport", "#/pasaporte", "passport", "Pasaporte"],
    ["rewards", "#/premios", "gift", "Premios"],
    ["more", "#/mas", "more", "Más"]
  ];
  nav.replaceChildren(
    ...items.map(([name, href, ico, label]) =>
      el(
        "a",
        {
          class: cx(ui.navItem, current === name && ui.navItemActive),
          href,
          "aria-current": current === name ? "page" : null
        },
        svg(ico),
        el("span", {}, label)
      )
    )
  );
}

function ethic() {
  return el(
    "p",
    { class: "grid grid-cols-[auto_1fr] items-start gap-3 font-display text-sm font-bold italic text-[#15803D]" },
    svg("sprout"),
    el("span", {}, "El participante es el adulto, el desafío es prepararse y el propósito es cuidar.")
  );
}

export function renderHome(state, catalog) {
  const mission = currentMission(state, catalog.missions);
  const progress = missionProgress(mission, state);
  const activityId = firstIncompleteActivity(mission, state);
  return el(
    "section",
    {
      class: cx(
        ui.screen,
        "bg-[radial-gradient(120%_60%_at_80%_18%,#fff6c9_0%,transparent_55%),linear-gradient(180deg,#f4fbff_0%,#FFF9EF_38%,#fff_100%)]"
      ),
      "aria-labelledby": "screen-title"
    },
    el(
      "div",
      { class: "flex items-start justify-between gap-3" },
      el("p", { class: "mt-2 text-sm text-[#52677F]" }, "Aprende. Reflexiona. Suma puntos. Cambia vidas."),
      pointsPill(state)
    ),
    el(
      "div",
      { class: "px-2" },
      el("img", {
        src: "screens/familia.png",
        alt: "Familia abrazada con un perro. Las grandes historias también empiezan con una pregunta.",
        class: "mx-auto block h-auto w-full max-w-sm"
      })
    ),
    el(
      "a",
      { class: cx(ui.card, "grid grid-cols-[auto_1fr_auto] items-center gap-3 p-4 no-underline"), href: `#/misiones/${mission.id}` },
      mission.id === "mission-1"
        ? el(
            "div",
            { class: "h-14 w-14 overflow-hidden rounded-[1.1rem] bg-[#fff4e5]" },
            el("img", { src: "screens/nina.png", alt: "", class: "h-full w-full object-cover object-top" })
          )
        : el("div", { class: "grid h-14 w-14 place-items-center rounded-[1.1rem] bg-[#fff4e5]" }, svg(iconKey(mission.icon))),
      el(
        "div",
        {},
        el("p", { class: ui.eyebrow }, "Misión actual"),
        el("h2", { id: "screen-title", class: "font-display text-lg font-extrabold leading-tight" }, mission.title)
      ),
      svg("chevron"),
      el(
        "div",
        { class: "col-span-full" },
        el("p", { class: "text-sm text-[#52677F]" }, mission.shortDescription),
        el(
          "div",
          { class: "mt-3 flex items-center justify-between gap-3 text-sm font-bold text-[#52677F]" },
          el("progress", { class: ui.progress, max: "100", value: String(progress.percent) }, `${progress.percent}%`),
          el("span", { class: "shrink-0" }, `${progress.percent}%`)
        )
      )
    ),
    el("a", { class: cx(ui.btn, ui.btnPrimary), href: `#/actividad/${activityId}` }, "Continuar misión →"),
    el(
      "div",
      { class: "grid grid-cols-2 gap-3 sm:grid-cols-3" },
      quick("#/misiones", "target", "Misiones", "Tu ruta de aprendizaje"),
      quick("#/pasaporte", "passport", "Tu Pasaporte", "Sella tu recorrido"),
      quick("#/premios", "gift", "Tienda de premios", "Canjea tus puntos"),
      el(
        "button",
        { class: cx(ui.card, "grid min-h-[6.5rem] justify-items-center gap-2 p-3 text-center"), type: "button", "data-action": "open-community" },
        svg("community"),
        el("strong", { class: "text-sm" }, "Comunidad"),
        el("span", { class: "text-[0.7rem] text-[#52677F]" }, "Juntos por más familias")
      )
    ),
    ethic()
  );
}

function quick(href, ico, title, caption) {
  return el(
    "a",
    { class: cx(ui.card, "grid min-h-[6.5rem] justify-items-center gap-2 p-3 text-center no-underline"), href },
    svg(ico),
    el("strong", { class: "text-sm" }, title),
    el("span", { class: "text-[0.7rem] text-[#52677F]" }, caption)
  );
}

function iconKey(name) {
  const map = {
    sprout: "sprout",
    door: "door",
    binoculars: "binoculars",
    home: "homeFill",
    people: "people",
    storm: "storm",
    "paper-plane": "paperPlane",
    flag: "flag"
  };
  return map[name] || "sprout";
}

const MAP_NODES = [
  { order: 0, top: 82, left: 33, align: "top" },
  { order: 1, top: 73, left: 37, align: "right" },
  { order: 2, top: 63, left: 47, align: "right" },
  { order: 3, top: 54, left: 40, align: "right" },
  { order: 4, top: 45, left: 50, align: "right" },
  { order: 5, top: 36, left: 42, align: "left" },
  { order: 6, top: 26, left: 48, align: "left" },
  { order: 7, top: 13, left: 50, align: "right" }
];

export function renderMissions(state, catalog) {
  const missions = [...catalog.missions].sort((a, b) => a.order - b.order);
  return el(
    "section",
    {
      class: "relative min-h-full bg-[#5aad4a]",
      "aria-labelledby": "screen-title"
    },
    el("h1", { id: "screen-title", class: "sr-only" }, "Tu ruta de aprendizaje"),
    el(
      "div",
      { class: "mission-map" },
      el("img", {
        src: "screens/mapa_bg.png",
        alt: "Camino ilustrado hacia un cerro con bandera, con una familia observando el paisaje.",
        width: "1024",
        height: "1536"
      }),
      ...missions.map((mission) => missionPin(mission, state, catalog.missions))
    )
  );
}

function pinGlyph(status, mission) {
  if (status === "completed") return icon("pinCheck");
  if (status === "locked") return icon("pinLock");
  const key = iconKey(mission.icon);
  return key === "door" ? icon("pinDoor") : icon(key);
}

function missionPin(mission, state, missions) {
  const status = missionStatus(mission, state, missions);
  const place = MAP_NODES.find((node) => node.order === mission.order) || MAP_NODES[0];
  const locked = status === "locked";
  const side = place.align === "left" ? "left" : "right";
  return el(
    locked ? "button" : "a",
    {
      class: `mission-pin mission-pin--${status} mission-pin--${side}`,
      style: `top:${place.top}%;left:${place.left}%`,
      href: locked ? null : `#/misiones/${mission.id}`,
      type: locked ? "button" : null,
      "aria-label": `${mission.title}. ${statusLabel(status)}`,
      "data-action": locked ? "locked-mission" : null,
      dataset: locked ? { missionId: mission.id } : {}
    },
    el("span", {
      class: "mission-pin__icon",
      html: pinGlyph(status, mission)
    }),
    el(
      "span",
      { class: "mission-pin__text" },
      status === "current" ? el("span", { class: "mission-pin__eyebrow" }, "Continúa aquí") : null,
      el("span", { class: "mission-pin__meta" }, mission.order === 7 ? "Misión final" : `Misión ${mission.order}`),
      el("strong", { class: "mission-pin__title" }, mission.title)
    )
  );
}

function statusLabel(status) {
  return {
    completed: "Completada",
    current: "En curso",
    available: "Disponible",
    locked: "Bloqueada"
  }[status];
}

export function renderMissionDetail(state, catalog, missionId) {
  const mission = findById(catalog.missions, missionId);
  if (!mission) return notFound("No encontramos esa misión.");
  const status = missionStatus(mission, state, catalog.missions);
  const progress = missionProgress(mission, state);
  const startId = firstIncompleteActivity(mission, state);
  const locked = status === "locked";
  const prereq = findById(catalog.missions, mission.prerequisites.at(-1));
  return el(
    "section",
    { class: ui.screen, "aria-labelledby": "screen-title" },
    mission.id === "mission-1"
      ? el("img", {
          src: "screens/nina.png",
          alt: "Niña pensando con un lápiz. Pequeñas preguntas, grandes cambios.",
          class: "mx-auto block h-auto w-full rounded-card"
        })
      : el("div", { class: "grid h-16 w-16 place-items-center rounded-2xl bg-[#fff4e5]" }, svg(iconKey(mission.icon))),
    el("h1", { id: "screen-title", class: "font-display text-2xl font-extrabold leading-tight" }, mission.title),
    el("p", {}, mission.shortDescription),
    el("p", { class: ui.eyebrow }, `${mission.estimatedMinutes} minutos · ${progress.done} de ${progress.total} actividades`),
    el("progress", { class: ui.progress, max: String(progress.total), value: String(progress.done) }, `${progress.done} de ${progress.total}`),
    locked
      ? el(
          "p",
          { class: cx(ui.card, "p-4 text-sm") },
          `Completa “${prereq ? prereq.title : "la misión anterior"}” para desbloquear esta misión.`
        )
      : el(
          "a",
          { class: cx(ui.btn, ui.btnPrimary), href: `#/actividad/${startId}` },
          status === "completed" ? "Revisar misión" : "Continuar misión"
        ),
    el(
      "ul",
      { class: "grid list-none gap-3 p-0" },
      ...mission.activityIds.map((id) => {
        const activity = findById(catalog.activities, id);
        const done = Boolean(state.completedActivities[id]?.awardedAt);
        const item = el(
          locked || !activity ? "div" : "a",
          {
            class: cx(ui.card, "block p-4 no-underline"),
            href: locked ? null : `#/actividad/${id}`
          },
          el("strong", {}, activity.title),
          el("p", { class: ui.eyebrow }, TYPE_LABELS[activity.type]),
          el("p", { class: "mt-1 text-sm" }, done ? "Completada · se puede revisar sin volver a sumar puntos" : "Pendiente")
        );
        return el("li", {}, item);
      })
    )
  );
}

export function renderActivity(state, catalog, activityId) {
  const activity = findById(catalog.activities, activityId);
  if (!activity) return notFound("No encontramos esa actividad.");
  const mission = findById(catalog.missions, activity.missionId);
  const record = state.completedActivities[activityId];
  const answered = Boolean(record?.awardedAt);
  const selected = new Set(record?.selectedOptionIds || []);
  const index = mission.activityIds.indexOf(activity.id);
  const multiple = activity.type === "multiple-choice";
  const field = el(
    "fieldset",
    { class: "m-0 grid min-w-0 gap-3 border-0 p-0" },
    el("legend", { class: "sr-only" }, multiple ? "Elige una o más alternativas" : "Elige una alternativa"),
    ...activity.options.map((option, i) => {
      const input = el("input", {
        class: "option-input",
        type: multiple ? "checkbox" : "radio",
        name: "activity-option",
        value: option.id,
        checked: selected.has(option.id),
        disabled: answered
      });
      let extra = "";
      let markExtra = ui.optionMark;
      if (answered) {
        const expected = new Set(activity.correctOptionIds);
        if (activity.type !== "reflection" && activity.type !== "family-activity") {
          if (expected.has(option.id)) {
            extra = "border-[#22A84A] bg-[#E9F8EC]";
            markExtra = "grid h-[2.1rem] w-[2.1rem] place-items-center rounded-full bg-[#22A84A] font-extrabold text-white";
          } else if (selected.has(option.id)) extra = "border-[#e2b93a] bg-[#fff8de]";
        } else if (selected.has(option.id)) extra = "border-[#22A84A] bg-[#E9F8EC]";
      }
      return el(
        "label",
        { class: cx(ui.option, extra, answered && "cursor-default opacity-95") },
        input,
        el("span", { class: markExtra }, optionLetter(i)),
        el("span", {}, option.text)
      );
    })
  );

  const feedback = answered
    ? el(
        "article",
        {
          class: cx(
            ui.card,
            "grid gap-2 p-4",
            record.isRecommended ? "border-[#b7e4c3] bg-[#E9F8EC]" : "border-[#f0d78c] bg-[#fff8de]"
          ),
          tabindex: "-1",
          id: "activity-feedback"
        },
        el("h2", { class: "font-display text-lg font-extrabold" }, record.isRecommended ? "¡Buen análisis!" : "Miremos esta situación nuevamente"),
        el("p", {}, record.isRecommended ? activity.feedback.recommended : activity.feedback.review),
        el("p", { class: ui.eyebrow }, record.pointsAwarded ? `+${record.pointsAwarded} puntos` : "Ya habías recibido estos puntos")
      )
    : null;

  const nextHref = nextActivityHref(mission, activity, state);
  return el(
    "section",
    { class: ui.screenActivity, "aria-labelledby": "screen-title" },
    el(
      "div",
      { class: "grid grid-cols-[1fr_auto] items-center gap-3" },
      el("progress", { class: ui.progress, max: String(mission.activityIds.length), value: String(index + 1) }, `${index + 1} de ${mission.activityIds.length}`),
      el("span", { class: ui.eyebrow }, `Pregunta ${index + 1} de ${mission.activityIds.length}`)
    ),
    el(
      "div",
      { class: "inline-flex items-center gap-2 font-extrabold text-[#063B78]" },
      svg("book"),
      el(
        "div",
        {},
        el("p", {}, TYPE_LABELS[activity.type]),
        el("p", { class: ui.eyebrow }, `Misión ${mission.order} · ${mission.title}`)
      )
    ),
    el("h1", { id: "screen-title", class: "sr-only" }, activity.title),
    mission.id === "mission-1"
      ? el("img", {
          src: "screens/nina.png",
          alt: "Niña pensando con un lápiz. Pequeñas preguntas, grandes cambios.",
          class: "mx-auto block h-auto w-full max-h-56 rounded-card object-contain"
        })
      : null,
    el("p", { class: "text-[1.05rem] font-semibold" }, activity.prompt),
    activity.question ? el("p", { class: "mt-1 font-display text-lg font-extrabold" }, activity.question) : null,
    el("form", { id: "activity-form", "data-activity-id": activity.id }, field),
    answered
      ? el("a", { class: cx(ui.btn, ui.btnPrimary), href: nextHref }, nextHref.startsWith("#/pasaporte") ? "Ver mi Pasaporte" : "Siguiente →")
      : el("button", { class: cx(ui.btn, ui.btnPrimary), type: "submit", form: "activity-form", id: "answer-button", disabled: true }, "Responder →"),
    feedback,
    el(
      "p",
      { class: cx(ui.card, "grid grid-cols-[auto_1fr] gap-3 p-4 text-sm text-[#52677F]") },
      svg("bulb"),
      el("span", {}, "Recuerda: no hay respuestas perfectas. Lo importante es reflexionar y aprender juntos.")
    )
  );
}

function nextActivityHref(mission, activity, state) {
  const idx = mission.activityIds.indexOf(activity.id);
  const following = mission.activityIds.slice(idx + 1);
  if (following.length) return `#/actividad/${following[0]}`;
  return "#/actividad-resumen/" + mission.id;
}

export function renderMissionSummary(state, catalog, missionId) {
  const mission = findById(catalog.missions, missionId);
  if (!mission) return notFound("No encontramos esa misión.");
  const points = mission.activityIds.reduce((sum, id) => sum + (state.completedActivities[id]?.pointsAwarded || 0), 0);
  const next = currentMission(state, catalog.missions);
  const nextId = firstIncompleteActivity(next, state);
  const doneAll = catalog.missions.every((item) => state.completedMissionIds.includes(item.id));
  const bonus = state.completedMissionIds.includes(mission.id) ? mission.completionBonus : 0;
  return el(
    "section",
    { class: cx(ui.screen, "justify-items-center text-center"), "aria-labelledby": "screen-title" },
    el("div", { class: "grid h-20 w-20 place-items-center rounded-full bg-[#E9F8EC] text-[#15803D]" }, svg("check")),
    el("h1", { id: "screen-title", class: "font-display text-2xl font-extrabold leading-tight" }, "Misión lista"),
    el("p", {}, `Completaste “${mission.title}”. Los puntos reconocen participación y aprendizaje, no idoneidad para acoger.`),
    el("p", { class: "font-display text-2xl text-[#FF7800]" }, `+${points + bonus}`),
    el("p", { class: ui.eyebrow }, "Puntos de actividades más bono de misión, si correspondía."),
    el("a", { class: cx(ui.btn, ui.btnPrimary), href: "#/pasaporte" }, "Ver mi Pasaporte"),
    doneAll
      ? el("p", {}, "Completaste el recorrido. Puedes revisar las misiones o visitar la tienda.")
      : el("a", { class: cx(ui.btn, ui.btnSecondary), href: `#/actividad/${nextId}` }, "Continuar mi recorrido")
  );
}

export function renderPassport(state, catalog) {
  const completed = state.completedMissionIds.length;
  const nextBadge = catalog.badges.find((badge) => !state.badgeIds.includes(badge.id));
  const nextMission = currentMission(state, catalog.missions);
  const ownedCount = state.badgeIds.length;
  return el(
    "section",
    { class: cx(ui.screen, "bg-gradient-to-b from-[#f3fbff] to-white"), "aria-labelledby": "screen-title" },
    el("h1", { id: "screen-title", class: "font-display text-2xl font-extrabold leading-tight" }, "Tu Pasaporte Acoge"),
    el("p", {}, "Cada misión completada es un paso hacia una decisión informada."),
    el(
      "div",
      { class: "grid grid-cols-3 gap-3" },
      stat(String(completed), "Misiones"),
      stat(String(state.points), "Puntos"),
      stat(String(ownedCount), "Insignias")
    ),
    el("h2", { class: "font-display text-lg font-extrabold" }, "Sellos de misión"),
    el(
      "div",
      { class: "grid grid-cols-2 gap-3" },
      ...catalog.missions.map((mission) => {
        const status = missionStatus(mission, state, catalog.missions);
        return el(
          "button",
          {
            class: cx(
              ui.card,
              "grid min-h-[8.5rem] justify-items-center gap-2 p-4 text-center",
              status === "current" && "ring-2 ring-[#0878BE]",
              status === "locked" && "grayscale"
            ),
            type: "button",
            "data-action": "open-stamp",
            dataset: { missionId: mission.id }
          },
          el(
            "div",
            {
              class: cx(
                "grid h-[3.2rem] w-[3.2rem] place-items-center rounded-full bg-[#eef6ff]",
                status === "completed" && "bg-[#E9F8EC] text-[#15803D]"
              )
            },
            status === "completed" ? svg("check") : status === "locked" ? svg("lock") : svg(iconKey(mission.icon))
          ),
          el("strong", {}, `Misión ${mission.order === 7 ? "final" : mission.order}`),
          el("span", { class: "text-sm" }, mission.title),
          el("span", { class: "text-xs font-extrabold" }, status === "current" ? "En curso" : statusLabel(status))
        );
      })
    ),
    el(
      "article",
      { class: cx(ui.card, "grid gap-2 p-4") },
      el("h2", { class: "font-display text-lg font-extrabold" }, "Próxima insignia"),
      nextBadge
        ? el("p", {}, `${nextBadge.title}: ${nextBadge.description}`)
        : el("p", {}, "Ya desbloqueaste las insignias de este recorrido de demo.")
    ),
    el("h2", { class: "font-display text-lg font-extrabold" }, "Insignias"),
    ownedCount === 0
      ? el("p", { class: cx(ui.card, "p-4 text-sm text-[#52677F]") }, "Aún no tienes insignias. Completa tu primera misión para obtener una.")
      : null,
    el(
      "div",
      { class: "grid gap-3" },
      ...catalog.badges.map((badge) => {
        const owned = state.badgeIds.includes(badge.id);
        return el(
          "button",
          {
            class: cx(ui.card, "grid gap-1 p-4 text-left", !owned && "opacity-70"),
            type: "button",
            "data-action": "open-badge",
            dataset: { badgeId: badge.id }
          },
          el("strong", {}, badge.title),
          el("p", { class: ui.eyebrow }, owned ? "Obtenida" : "Aún no desbloqueada")
        );
      })
    ),
    el("a", { class: cx(ui.btn, ui.btnPrimary), href: `#/actividad/${firstIncompleteActivity(nextMission, state)}` }, "Continuar mi recorrido"),
    el(
      "p",
      { class: "text-sm text-[#52677F]" },
      "El Pasaporte reconoce tu participación y aprendizaje. No acredita idoneidad ni reemplaza el proceso formal de evaluación."
    )
  );
}

function stat(value, label) {
  return el(
    "article",
    { class: cx(ui.card, "p-4 text-center") },
    el("strong", { class: "block font-display text-xl" }, value),
    el("span", { class: "text-sm text-[#52677F]" }, label)
  );
}

export function renderRewards(state, catalog, filter = "all") {
  const filters = [
    ["all", "Todos"],
    ["digital", "Digitales"],
    ["experience", "Experiencias"],
    ["product", "Productos"],
    ["raffle", "Sorteos"]
  ];
  const rewards = catalog.rewards.filter((item) => filter === "all" || item.category === filter);
  return el(
    "section",
    { class: cx(ui.screen, "bg-gradient-to-b from-[#fffaf0] to-white"), "aria-labelledby": "screen-title" },
    el("h1", { id: "screen-title", class: "font-display text-2xl font-extrabold leading-tight" }, "Tienda Acoge"),
    el("p", {}, "Premios que inspiran más familias que acogen."),
    el(
      "div",
      { class: "flex gap-2 overflow-x-auto pb-1", role: "toolbar", "aria-label": "Filtrar premios" },
      ...filters.map(([id, label]) =>
        el(
          "button",
          {
            class: cx(ui.chip, filter === id && ui.chipOn),
            type: "button",
            "aria-pressed": filter === id ? "true" : "false",
            "data-action": "filter-rewards",
            dataset: { filter: id }
          },
          label
        )
      )
    ),
    rewards.length === 0
      ? el("p", { class: cx(ui.card, "p-4") }, "No hay premios en esta categoría por ahora.")
      : el("div", { class: "grid grid-cols-2 gap-3" }, ...rewards.map((reward) => rewardCard(reward, state))),
    el("a", { class: cx(ui.btn, ui.btnSecondary), href: "#/premios/historial" }, "Ver historial de canjes"),
    ethic()
  );
}

function rewardCard(reward, state) {
  const missing = missingPoints(state, reward);
  const enough = missing === 0;
  const art = el("div", { class: "reward-art" });
  art.innerHTML = icon(reward.image);
  return el(
    "article",
    { class: cx(ui.card, "grid gap-2 overflow-hidden p-3") },
    art,
    el("h3", { class: "font-display text-[0.95rem] font-extrabold leading-tight" }, reward.title),
    el("p", { class: "text-xs text-[#52677F]" }, reward.description),
    el("p", { class: "inline-flex items-center gap-1 text-sm font-extrabold text-[#F43F4F]" }, svg("heart"), `${reward.cost} puntos`),
    enough
      ? el(
          "button",
          {
            class: cx(ui.btn, reward.category === "raffle" ? ui.btnGhost : ui.btnReward),
            type: "button",
            "data-action": "redeem",
            dataset: { rewardId: reward.id }
          },
          reward.actionLabel
        )
      : el("button", { class: cx(ui.btn, ui.btnReward, ui.btnDisabled), type: "button", disabled: true }, `Te faltan ${missing} puntos`)
  );
}

export function renderHistory(state, catalog) {
  const items = state.redemptions || [];
  return el(
    "section",
    { class: ui.screen, "aria-labelledby": "screen-title" },
    el("h1", { id: "screen-title", class: "font-display text-2xl font-extrabold leading-tight" }, "Historial de canjes"),
    items.length === 0
      ? el("p", { class: cx(ui.card, "p-4") }, "Aún no has canjeado premios. Tus puntos siguen disponibles en este dispositivo.")
      : el(
          "ul",
          { class: "grid list-none gap-3 p-0" },
          ...items.map((item) =>
            el(
              "li",
              { class: cx(ui.card, "grid gap-1 p-4") },
              el("strong", {}, item.title || findById(catalog.rewards, item.rewardId)?.title || item.rewardId),
              el("p", {}, `${item.cost} puntos · saldo ${item.balanceAfter}`),
              el("p", { class: ui.eyebrow }, item.createdAt)
            )
          )
        )
  );
}

export function renderMore(state, catalog) {
  const row = (tag, attrs, label) =>
    el(
      tag,
      {
        class: "flex min-h-11 w-full items-center justify-between px-4 py-4 text-left no-underline",
        ...attrs
      },
      el("span", {}, label),
      svg("chevron")
    );

  return el(
    "section",
    { class: cx(ui.screen, "bg-[#FFF9EF]"), "aria-labelledby": "screen-title" },
    el("h1", { id: "screen-title", class: "font-display text-2xl font-extrabold leading-tight" }, "Más"),
    el("p", {}, "Ayuda, privacidad y ajustes de esta demo."),
    el(
      "div",
      { class: cx(ui.card, "divide-y divide-[#D8DEE6] overflow-hidden") },
      row("a", { href: "#/mas/accesibilidad" }, "Accesibilidad"),
      row("button", { type: "button", "data-action": "open-help" }, "Ayuda"),
      row("button", { type: "button", "data-action": "open-privacy" }, "Privacidad"),
      row("button", { type: "button", "data-action": "open-credits" }, "Créditos y fuentes"),
      row("button", { type: "button", "data-action": "reset-demo" }, "Reiniciar demo")
    ),
    el("p", { class: ui.eyebrow }, "El contenido de esta demo está pendiente de validación técnica del programa antes de producción."),
    el("p", { class: ui.eyebrow }, "Los puntos reconocen participación y aprendizaje. No representan idoneidad para acoger."),
    el(
      "ul",
      { class: "grid list-none gap-3 p-0" },
      ...catalog.sources.map((source) =>
        el(
          "li",
          {},
          el("a", { class: "font-semibold text-[#07559A]", href: source.url, target: "_blank", rel: "noopener noreferrer" }, source.title)
        )
      )
    )
  );
}

export function renderAccessibility() {
  const large = localStorage.getItem("desafioAcoge:text") === "large";
  const contrast = localStorage.getItem("desafioAcoge:contrast") === "high";
  return el(
    "section",
    { class: ui.screen, "aria-labelledby": "screen-title" },
    el("h1", { id: "screen-title", class: "font-display text-2xl font-extrabold leading-tight" }, "Accesibilidad"),
    el(
      "label",
      { class: cx(ui.card, "flex min-h-11 items-center gap-3 p-4") },
      el("input", { type: "checkbox", "data-action": "toggle-text", checked: large }),
      " Texto más grande"
    ),
    el(
      "label",
      { class: cx(ui.card, "flex min-h-11 items-center gap-3 p-4") },
      el("input", { type: "checkbox", "data-action": "toggle-contrast", checked: contrast }),
      " Contraste reforzado"
    ),
    el("p", {}, "El foco del teclado es visible y las preguntas usan agrupación semántica. Esta demo respeta la preferencia de movimiento reducido del sistema.")
  );
}

function notFound(message) {
  return el(
    "section",
    { class: ui.screen },
    el("h1", { id: "screen-title", class: "font-display text-2xl font-extrabold" }, "No disponible"),
    el("p", {}, message),
    el("a", { class: cx(ui.btn, ui.btnPrimary), href: "#/inicio" }, "Volver al inicio")
  );
}

export function renderScreen(route, state, catalog, rewardFilter = "all") {
  const main = document.getElementById("main-content");
  const filters = rewardFilter || "all";
  let view;
  if (route.name === "home") view = renderHome(state, catalog);
  else if (route.name === "missions") view = renderMissions(state, catalog);
  else if (route.name === "mission-detail") view = renderMissionDetail(state, catalog, route.params.missionId);
  else if (route.name === "activity") view = renderActivity(state, catalog, route.params.activityId);
  else if (route.name === "mission-summary") view = renderMissionSummary(state, catalog, route.params.missionId);
  else if (route.name === "passport") view = renderPassport(state, catalog);
  else if (route.name === "rewards") view = renderRewards(state, catalog, filters);
  else if (route.name === "reward-history") view = renderHistory(state, catalog);
  else if (route.name === "more") view = renderMore(state, catalog);
  else if (route.name === "accessibility") view = renderAccessibility();
  else view = renderHome(state, catalog);

  main.className = route.name === "missions" ? "flex-1 bg-[#5aad4a]" : "";
  main.replaceChildren(view);
}

export function toast(message) {
  const region = document.getElementById("toast-region");
  region.replaceChildren(el("div", { class: ui.toastInner }, message));
  window.setTimeout(() => region.replaceChildren(), 2800);
}

export function dialogContent(title, body, actions) {
  const dialog = document.getElementById("app-dialog");
  dialog.className = ui.dialog;
  dialog.replaceChildren(
    el("h2", { id: "dialog-title", class: "mb-3 font-display text-xl font-extrabold" }, title),
    typeof body === "string" ? el("p", {}, body) : body,
    el("div", { class: ui.dialogActions }, ...actions)
  );
  dialog.setAttribute("aria-labelledby", "dialog-title");
  return dialog;
}

export { el, svg, brand, pointsPill, TYPE_LABELS, iconKey, statusLabel };
