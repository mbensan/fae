import { calculateActivityPoints, getLevel, isRecommended } from "./scoring.js";
import { findById } from "./data.js";

const STORAGE_KEY = "desafioAcoge:v1";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function resetState(seed) {
  const next = clone(seed);
  saveState(next);
  return next;
}

export function createInitialState(mockProfile) {
  const existing = loadState();
  if (existing && existing.id) {
    existing.level = getLevel(existing.points);
    return existing;
  }
  return clone(mockProfile);
}

export function getProfile(state) {
  return state;
}

export function missionStatus(mission, state, missions) {
  if (state.completedMissionIds.includes(mission.id)) return "completed";
  const prereqs = mission.prerequisites || [];
  const unlocked = prereqs.every((id) => state.completedMissionIds.includes(id));
  if (!unlocked) return "locked";
  const current = currentMission(state, missions);
  if (current && current.id === mission.id) return "current";
  return "available";
}

export function currentMission(state, missions) {
  const sorted = [...missions].sort((a, b) => a.order - b.order);
  return sorted.find((mission) => !state.completedMissionIds.includes(mission.id)) || sorted.at(-1);
}

export function missionProgress(mission, state) {
  const total = mission.activityIds.length || 1;
  const done = mission.activityIds.filter((id) => state.completedActivities[id]?.awardedAt).length;
  return { done, total, percent: Math.round((done / total) * 100) };
}

export function firstIncompleteActivity(mission, state) {
  return mission.activityIds.find((id) => !state.completedActivities[id]?.awardedAt) || mission.activityIds[0];
}

export function completeActivity(state, activity, selectedIds, catalog) {
  const existing = state.completedActivities[activity.id];
  if (existing?.awardedAt) {
    return {
      state,
      pointsAwarded: 0,
      alreadyAwarded: true,
      isRecommended: existing.isRecommended,
      newBadges: [],
      missionCompleted: null,
      journeyCompleted: false
    };
  }

  const recommended = isRecommended(activity, selectedIds);
  const pointsAwarded = calculateActivityPoints(activity, selectedIds);
  const awardedAt = new Date().toISOString();

  state.completedActivities[activity.id] = {
    selectedOptionIds: selectedIds,
    isRecommended: recommended,
    pointsAwarded,
    awardedAt
  };
  state.points += pointsAwarded;
  state.level = getLevel(state.points);
  state.pointMovements = state.pointMovements || [];
  state.pointMovements.push({
    id: `mov-${activity.id}`,
    label: activity.title,
    delta: pointsAwarded,
    createdAt: awardedAt,
    balanceAfter: state.points
  });

  const mission = findById(catalog.missions, activity.missionId);
  let missionCompleted = null;
  const allDone = mission.activityIds.every((id) => state.completedActivities[id]?.awardedAt);
  if (allDone && !state.completedMissionIds.includes(mission.id)) {
    completeMission(state, mission);
    missionCompleted = mission;
  }

  const nextMission = currentMission(state, catalog.missions);
  state.currentMissionId = nextMission?.id || mission.id;
  state.currentActivityId = firstIncompleteActivity(nextMission || mission, state);

  let journeyCompleted = false;
  const allMissionsDone = catalog.missions.every((item) => state.completedMissionIds.includes(item.id));
  if (allMissionsDone && !state.journeyAwarded) {
    state.journeyAwarded = true;
    journeyCompleted = true;
    addPoints(state, 500, "Recorrido completo");
  }

  const newBadges = awardBadges(state, catalog);
  return {
    state,
    pointsAwarded,
    alreadyAwarded: false,
    isRecommended: recommended,
    newBadges,
    missionCompleted,
    journeyCompleted
  };
}

export function completeMission(state, mission) {
  if (state.completedMissionIds.includes(mission.id)) return state;
  state.completedMissionIds.push(mission.id);
  addPoints(state, mission.completionBonus, `Misión completada: ${mission.title}`);
  return state;
}

function addPoints(state, delta, label) {
  if (!delta) return;
  state.points += delta;
  state.level = getLevel(state.points);
  state.pointMovements = state.pointMovements || [];
  state.pointMovements.push({
    id: `mov-${Date.now()}-${label}`,
    label,
    delta,
    createdAt: new Date().toISOString(),
    balanceAfter: state.points
  });
}

export function redeemReward(state, reward) {
  if (!reward.available) {
    return { ok: false, reason: "Este premio no está disponible." };
  }
  if (state.points < reward.cost) {
    return { ok: false, reason: `Te faltan ${reward.cost - state.points} puntos` };
  }
  state.points -= reward.cost;
  state.level = getLevel(state.points);
  const redemption = {
    id: `redemption-${Date.now()}`,
    rewardId: reward.id,
    title: reward.title,
    cost: reward.cost,
    balanceAfter: state.points,
    createdAt: new Date().toISOString(),
    status: "confirmed"
  };
  state.redemptions = state.redemptions || [];
  state.redemptions.unshift(redemption);
  state.pointMovements = state.pointMovements || [];
  state.pointMovements.push({
    id: `mov-${redemption.id}`,
    label: `Canje: ${reward.title}`,
    delta: -reward.cost,
    createdAt: redemption.createdAt,
    balanceAfter: state.points
  });
  return { ok: true, redemption };
}

export function awardBadges(state, catalog) {
  const owned = new Set(state.badgeIds || []);
  const earned = [];
  const has = (id) => Boolean(state.completedActivities[id]?.awardedAt);
  const rec = (id) => Boolean(state.completedActivities[id]?.isRecommended);

  const checks = [
    ["first-step", () => Object.keys(state.completedActivities).length > 0],
    ["rompe-mitos", () => rec("q02") && rec("q04")],
    ["mirada-abierta", () => state.completedMissionIds.includes("mission-2")],
    ["conversacion-en-familia", () => has("fam00") || rec("case02")],
    ["buen-acompanamiento", () => rec("q07") || rec("case01") || rec("case03")],
    ["decision-informada", () => state.completedMissionIds.includes("mission-final")]
  ];

  for (const [id, test] of checks) {
    if (!owned.has(id) && test()) {
      owned.add(id);
      earned.push(findById(catalog.badges, id));
    }
  }
  state.badgeIds = [...owned];
  return earned.filter(Boolean);
}

export function missingPoints(state, reward) {
  return Math.max(0, reward.cost - state.points);
}
