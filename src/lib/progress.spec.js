import { beforeEach, describe, expect, it } from "vitest";
import { catalog } from "./catalog";
import {
  STORAGE_KEY,
  completeActivity,
  createInitialState,
  missionStatus,
  redeemReward,
  resetState
} from "./progress";

function freshProfile() {
  return JSON.parse(JSON.stringify(catalog.mockProfile));
}

describe("progreso", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("restaura el perfil guardado y, si no hay, usa la demo", () => {
    expect(createInitialState(catalog.mockProfile).displayName).toBe("Camila");
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...freshProfile(), displayName: "Ana", points: 800 }));
    const restored = createInitialState(catalog.mockProfile);
    expect(restored.displayName).toBe("Ana");
    expect(restored.level).toBe("Aprendiz");
  });

  it("no vuelve a sumar puntos al revisar una actividad", () => {
    const state = freshProfile();
    const activity = catalog.activities.find((item) => item.id === "q02");
    const first = completeActivity(state, activity, ["mito"], catalog);
    expect(first.pointsAwarded).toBe(50);
    expect(first.alreadyAwarded).toBe(false);
    expect(state.points).toBe(400);

    const second = completeActivity(state, activity, ["mito"], catalog);
    expect(second.alreadyAwarded).toBe(true);
    expect(second.pointsAwarded).toBe(0);
    expect(state.points).toBe(400);
  });

  it("desbloquea la misión siguiente al completar la actual", () => {
    const state = freshProfile();
    const q02 = catalog.activities.find((item) => item.id === "q02");
    const case02 = catalog.activities.find((item) => item.id === "case02");
    completeActivity(state, q02, ["mito"], catalog);
    const mission2 = catalog.missions.find((item) => item.id === "mission-2");
    expect(missionStatus(mission2, state, catalog.missions)).toBe("locked");

    const result = completeActivity(state, case02, ["c"], catalog);
    expect(result.missionCompleted.id).toBe("mission-1");
    expect(state.points).toBe(650);
    expect(state.level).toBe("Aprendiz");
    expect(missionStatus(mission2, state, catalog.missions)).toBe("current");
    const mission3 = catalog.missions.find((item) => item.id === "mission-3");
    expect(missionStatus(mission3, state, catalog.missions)).toBe("locked");
  });

  it("rechaza un canje sin saldo y registra uno válido", () => {
    const state = freshProfile();
    const expensive = catalog.rewards.find((item) => item.id === "reward-workshop");
    const guide = catalog.rewards.find((item) => item.id === "reward-guide");
    expect(redeemReward(state, expensive).ok).toBe(false);
    expect(state.points).toBe(350);

    const result = redeemReward(state, guide);
    expect(result.ok).toBe(true);
    expect(state.points).toBe(50);
    expect(state.redemptions[0].rewardId).toBe("reward-guide");
    expect(state.redemptions[0].balanceAfter).toBe(50);
    expect(state.points).toBeGreaterThanOrEqual(0);
  });

  it("reiniciar demo vuelve al perfil inicial", () => {
    const next = resetState(catalog.mockProfile);
    expect(next.points).toBe(350);
    expect(next.displayName).toBe("Camila");
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).points).toBe(350);
  });
});
