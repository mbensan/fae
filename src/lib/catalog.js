import missions from "../../data/missions.json";
import activities from "../../data/activities.json";
import rewards from "../../data/rewards.json";
import badges from "../../data/badges.json";
import sources from "../../data/sources.json";
import mockProfile from "../../data/mock-profile.json";

export const catalog = {
  missions,
  activities,
  rewards,
  badges,
  sources,
  mockProfile
};

export function findById(list, id) {
  return list.find((item) => item.id === id) || null;
}
