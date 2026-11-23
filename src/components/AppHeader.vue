<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProgressStore } from "@/stores/progress";
import { ui } from "@/lib/ui";
import AppIcon from "@/components/AppIcon.vue";
import BrandMark from "@/components/BrandMark.vue";
import PointsPill from "@/components/PointsPill.vue";

const route = useRoute();
const router = useRouter();
const store = useProgressStore();

const isHome = computed(() => route.name === "home");
const headerClass = computed(() => {
  if (route.name === "home") return ui.headerHome;
  if (route.name === "missions") return ui.headerMissions;
  return ui.header;
});

function goBack() {
  const name = route.name;
  if (name === "activity" || name === "mission-summary" || name === "mission-detail") router.push("/misiones");
  else if (name === "reward-history") router.push("/premios");
  else if (name === "accessibility") router.push("/mas");
  else if (window.history.length > 1) router.back();
  else router.push("/inicio");
}
</script>

<template>
  <header :class="headerClass">
    <template v-if="isHome">
      <BrandMark />
      <div class="flex items-center gap-3 text-right">
        <div class="grid">
          <span class="text-sm font-bold">Hola, {{ store.profile.displayName }}</span>
          <span :class="ui.eyebrow">Nivel {{ store.profile.level }}</span>
        </div>
        <div :class="ui.avatar" aria-hidden="true">
          <svg viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="24" fill="#d7ecff" />
            <circle cx="24" cy="18" r="8" fill="#c68642" />
            <path fill="#07559A" d="M8 42c2-10 8-14 16-14s14 4 16 14z" />
            <path fill="#2b2b2b" d="M12 18c4-10 20-10 24 0 0-8-6-12-12-12S12 10 12 18z" />
          </svg>
        </div>
      </div>
    </template>
    <template v-else>
      <button :class="[ui.iconBtn, 'shrink-0']" type="button" aria-label="Volver" @click="goBack">
        <AppIcon name="back" />
      </button>
      <div class="min-w-0 flex-1">
        <BrandMark />
      </div>
      <PointsPill />
    </template>
  </header>
</template>
