export function isRecommended(activity, selectedIds) {
  if (activity.type === "reflection" || activity.type === "family-activity") {
    return true;
  }
  const selected = new Set(selectedIds);
  const expected = new Set(activity.correctOptionIds ?? []);
  return selected.size === expected.size && [...selected].every((id) => expected.has(id));
}

export function calculateActivityPoints(activity, selectedIds) {
  if (activity.type === "case" || activity.type === "family-activity" || activity.type === "reflection") {
    return activity.participationPoints;
  }
  const bonus = isRecommended(activity, selectedIds) ? (activity.correctBonus || 0) : 0;
  return activity.participationPoints + bonus;
}

export function getLevel(points) {
  if (points >= 1200) return "Acompañante";
  if (points >= 500) return "Aprendiz";
  return "Explorador";
}

export function optionLetter(index) {
  return String.fromCharCode(65 + index);
}
