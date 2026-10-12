async function readJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`No se pudo cargar ${path}`);
  }
  return response.json();
}

export async function loadCatalog() {
  const [missions, activities, rewards, badges, sources, mockProfile] = await Promise.all([
    readJson("data/missions.json"),
    readJson("data/activities.json"),
    readJson("data/rewards.json"),
    readJson("data/badges.json"),
    readJson("data/sources.json"),
    readJson("data/mock-profile.json")
  ]);
  return { missions, activities, rewards, badges, sources, mockProfile };
}

export function findById(list, id) {
  return list.find((item) => item.id === id) || null;
}
