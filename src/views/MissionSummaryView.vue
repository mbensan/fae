<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useProgressStore } from "@/stores/progress";
import { findById } from "@/lib/catalog";
import { currentMission, firstIncompleteActivity } from "@/lib/progress";
import { cx, ui } from "@/lib/ui";
import AppIcon from "@/components/AppIcon.vue";

const route = useRoute();
const store = useProgressStore();
const mission = computed(() => findById(store.catalog.missions, route.params.missionId));
const points = computed(() => {
  if (!mission.value) return 0;
  return mission.value.activityIds.reduce((sum, id) => sum + (store.profile.completedActivities[id]?.pointsAwarded || 0), 0);
});
const bonus = computed(() => (mission.value && store.profile.completedMissionIds.includes(mission.value.id) ? mission.value.completionBonus : 0));
const nextMission = computed(() => currentMission(store.profile, store.catalog.missions));
const nextId = computed(() => firstIncompleteActivity(nextMission.value, store.profile));
const doneAll = computed(() => store.catalog.missions.every((item) => store.profile.completedMissionIds.includes(item.id)));
</script>

<template>
  <section v-if="!mission" :class="ui.screen">
    <h1 id="screen-title" class="font-display text-2xl font-extrabold">No disponible</h1>
    <p>No encontramos esa misión.</p>
    <router-link :class="cx(ui.btn, ui.btnPrimary)" to="/inicio">Volver al inicio</router-link>
  </section>
  <section v-else :class="cx(ui.screen, 'justify-items-center text-center')" aria-labelledby="screen-title">
    <div class="grid h-20 w-20 place-items-center rounded-full bg-[#E9F8EC] text-[#15803D]">
      <AppIcon name="check" />
    </div>
    <h1 id="screen-title" class="font-display text-2xl font-extrabold leading-tight">Misión lista</h1>
    <p>Completaste “{{ mission.title }}”. Los puntos reconocen participación y aprendizaje, no idoneidad para acoger.</p>
    <p class="font-display text-2xl text-[#FF7800]">+{{ points + bonus }}</p>
    <p :class="ui.eyebrow">Puntos de actividades más bono de misión, si correspondía.</p>
    <router-link :class="cx(ui.btn, ui.btnPrimary)" to="/pasaporte">Ver mi Pasaporte</router-link>
    <p v-if="doneAll">Completaste el recorrido. Puedes revisar las misiones o visitar la tienda.</p>
    <router-link v-else :class="cx(ui.btn, ui.btnSecondary)" :to="`/actividad/${nextId}`">Continuar mi recorrido</router-link>
  </section>
</template>
