import { defineStore } from "pinia";
import { ref } from "vue";
import { catalog } from "@/lib/catalog";
import {
  completeActivity,
  createInitialState,
  redeemReward,
  resetState,
  saveState
} from "@/lib/progress";

export const useProgressStore = defineStore("progress", () => {
  const profile = ref(createInitialState(catalog.mockProfile));
  const saveError = ref(false);

  function persist() {
    saveError.value = !saveState(profile.value);
    return !saveError.value;
  }

  persist();

  function submitActivity(activity, selectedIds) {
    const result = completeActivity(profile.value, activity, selectedIds, catalog);
    persist();
    return result;
  }

  function redeem(reward) {
    const result = redeemReward(profile.value, reward);
    if (result.ok) persist();
    return result;
  }

  function resetDemo() {
    profile.value = resetState(catalog.mockProfile);
    saveError.value = false;
  }

  return {
    profile,
    saveError,
    catalog,
    submitActivity,
    redeem,
    resetDemo
  };
});
