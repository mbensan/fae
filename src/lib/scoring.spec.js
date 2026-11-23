import { describe, expect, it } from "vitest";
import { calculateActivityPoints, getLevel, isRecommended } from "./scoring";

const question = {
  type: "single-choice",
  participationPoints: 10,
  correctBonus: 40,
  correctOptionIds: ["b"]
};

describe("puntaje", () => {
  it("suma participación y bono cuando la alternativa es la esperada", () => {
    expect(calculateActivityPoints(question, ["b"])).toBe(50);
    expect(isRecommended(question, ["b"])).toBe(true);
  });

  it("deja solo la participación si la alternativa hay que revisarla", () => {
    expect(calculateActivityPoints(question, ["a"])).toBe(10);
    expect(isRecommended(question, ["a"])).toBe(false);
  });

  it("entrega el puntaje del caso al completarlo, sin bono extra", () => {
    const activity = { type: "case", participationPoints: 100, correctBonus: 0, correctOptionIds: ["b"] };
    expect(calculateActivityPoints(activity, ["a"])).toBe(100);
    expect(isRecommended(activity, ["b"])).toBe(true);
    expect(isRecommended(activity, ["a"])).toBe(false);
  });

  it("trata la reflexión como participación válida", () => {
    const activity = { type: "reflection", participationPoints: 100, correctOptionIds: ["a", "b", "c", "d", "e"] };
    expect(isRecommended(activity, ["a"])).toBe(true);
    expect(calculateActivityPoints(activity, ["a"])).toBe(100);
  });

  it("nombra los niveles de la demo", () => {
    expect(getLevel(350)).toBe("Explorador");
    expect(getLevel(500)).toBe("Aprendiz");
    expect(getLevel(1200)).toBe("Acompañante");
  });
});
