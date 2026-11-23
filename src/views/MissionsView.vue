<script setup>
import { computed } from "vue";
import { useProgressStore } from "@/stores/progress";
import { openDialog } from "@/composables/feedback";
import { findById } from "@/lib/catalog";
import { MAP_NODES, pinIconName, statusLabel } from "@/lib/missions";
import { missionStatus } from "@/lib/progress";
import { icon } from "@/lib/icons";
import { publicUrl } from "@/lib/publicUrl";

const store = useProgressStore();
const missions = computed(() => [...store.catalog.missions].sort((a, b) => a.order - b.order));

function placeFor(mission) {
  return MAP_NODES.find((node) => node.order === mission.order) || MAP_NODES[0];
}

function sideFor(mission) {
  return placeFor(mission).align === "left" ? "left" : "right";
}

function openLocked(mission) {
  const prereq = findById(store.catalog.missions, mission.prerequisites.at(-1));
  openDialog({
    title: "Misión bloqueada",
    paragraphs: [`Completa “${prereq ? prereq.title : "la misión anterior"}” para desbloquear esta misión.`]
  });
}
</script>

<template>
  <section class="relative min-h-full bg-[#5aad4a]" aria-labelledby="screen-title">
    <h1 id="screen-title" class="sr-only">Tu ruta de aprendizaje</h1>
    <div class="mission-map">
      <img
        :src="publicUrl('screens/mapa_bg.png')"
        alt="Camino ilustrado hacia un cerro con bandera, con una familia observando el paisaje."
        width="1024"
        height="1536"
      >
      <component
        :is="missionStatus(mission, store.profile, store.catalog.missions) === 'locked' ? 'button' : 'router-link'"
        v-for="mission in missions"
        :key="mission.id"
        :class="`mission-pin mission-pin--${missionStatus(mission, store.profile, store.catalog.missions)} mission-pin--${sideFor(mission)}`"
        :style="{ top: `${placeFor(mission).top}%`, left: `${placeFor(mission).left}%` }"
        :to="missionStatus(mission, store.profile, store.catalog.missions) === 'locked' ? undefined : `/misiones/${mission.id}`"
        :type="missionStatus(mission, store.profile, store.catalog.missions) === 'locked' ? 'button' : undefined"
        :aria-label="`${mission.title}. ${statusLabel(missionStatus(mission, store.profile, store.catalog.missions))}`"
        @click="missionStatus(mission, store.profile, store.catalog.missions) === 'locked' && openLocked(mission)"
      >
        <span class="mission-pin__icon" v-html="icon(pinIconName(missionStatus(mission, store.profile, store.catalog.missions), mission))"></span>
        <span class="mission-pin__text">
          <span v-if="missionStatus(mission, store.profile, store.catalog.missions) === 'current'" class="mission-pin__eyebrow">Continúa aquí</span>
          <span class="mission-pin__meta">{{ mission.order === 7 ? "Misión final" : `Misión ${mission.order}` }}</span>
          <strong class="mission-pin__title">{{ mission.title }}</strong>
        </span>
      </component>
    </div>
  </section>
</template>
