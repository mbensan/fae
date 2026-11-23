import { beforeEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import ActivityView from "./ActivityView.vue";
import router from "@/router";
import { useProgressStore } from "@/stores/progress";

describe("actividad", () => {
  beforeEach(async () => {
    localStorage.clear();
    await router.push("/actividad/q02");
    await router.isReady();
  });

  it("responde una vez, muestra la retroalimentación y no duplica el puntaje", async () => {
    const pinia = createPinia();
    const wrapper = mount(ActivityView, {
      global: { plugins: [pinia, router] }
    });

    expect(wrapper.get("button[type='submit']").attributes("disabled")).toBeDefined();
    await wrapper.get("input[value='mito']").setChecked();
    expect(wrapper.get("button[type='submit']").attributes("disabled")).toBeUndefined();

    await wrapper.get("form").trigger("submit");
    expect(wrapper.text()).toContain("¡Buen análisis!");
    expect(wrapper.text()).toContain("+50 puntos");

    const store = useProgressStore(pinia);
    expect(store.profile.points).toBe(400);

    await router.push("/inicio");
    await router.push("/actividad/q02");
    await wrapper.vm.$nextTick();
    expect(wrapper.find("button[type='submit']").exists()).toBe(false);
    expect(wrapper.text()).toContain("+50 puntos");
    expect(store.profile.points).toBe(400);
  });
});
