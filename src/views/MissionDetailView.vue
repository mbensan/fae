<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useProgressStore } from "@/stores/progress";
import { findById } from "@/lib/catalog";
import { TYPE_LABELS, iconKey } from "@/lib/missions";
import { firstIncompleteActivity, missionProgress, missionStatus } from "@/lib/progress";
import { cx, ui } from "@/lib/ui";
import AppIcon from "@/components/AppIcon.vue";
import { publicUrl } from "@/lib/publicUrl";

const route = useRoute();
const store = useProgressStore();

const mission = computed(() => findById(store.catalog.missions, route.params.missionId));
const status = computed(() => (mission.value ? missionStatus(mission.value, store.profile, store.catalog.missions) : "locked"));
const progress = computed(() => (mission.value ? missionProgress(mission.value, store.profile) : null));
const startId = computed(() => (mission.value ? firstIncompleteActivity(mission.value, store.profile) : ""));
const locked = computed(() => status.value === "locked");
const prereq = computed(() => (mission.value ? findById(store.catalog.missions, mission.value.prerequisites.at(-1)) : null));

function activityDone(id) {
  return Boolean(store.profile.completedActivities[id]?.awardedAt);
}
</script>

<template>
  <section v-if="!mission" :class="ui.screen">
    <h1 id="screen-title" class="font-display text-2xl font-extrabold">No disponible</h1>
    <p>No encontramos esa misión.</p>
    <router-link :class="cx(ui.btn, ui.btnPrimary)" to="/inicio">Volver al inicio</router-link>
  </section>
  <section v-else :class="ui.screen" aria-labelledby="screen-title">
    <img
      v-if="mission.id === 'mission-1'"
      :src="publicUrl('screens/nina.png')"
      alt="Niña pensando con un lápiz. Pequeñas preguntas, grandes cambios."
      class="mx-auto block h-auto w-full rounded-[1.25rem]"
    >
    <div v-else class="grid h-16 w-16 place-items-center rounded-2xl bg-[#fff4e5]">
      <AppIcon :name="iconKey(mission.icon)" />
    </div>
    <h1 id="screen-title" class="font-display text-2xl font-extrabold leading-tight">{{ mission.title }}</h1>
    <p>{{ mission.shortDescription }}</p>
    <p :class="ui.eyebrow">{{ mission.estimatedMinutes }} minutos · {{ progress.done }} de {{ progress.total }} actividades</p>
    <progress :class="ui.progress" :max="progress.total" :value="progress.done">{{ progress.done }} de {{ progress.total }}</progress>
    <p v-if="locked" :class="cx(ui.card, 'p-4 text-sm')">
      Completa “{{ prereq ? prereq.title : "la misión anterior" }}” para desbloquear esta misión.
    </p>
    <router-link v-else :class="cx(ui.btn, ui.btnPrimary)" :to="`/actividad/${startId}`">
      {{ status === "completed" ? "Revisar misión" : "Continuar misión" }}
    </router-link>
    <ul class="grid list-none gap-3 p-0">
      <li v-for="id in mission.activityIds" :key="id">
        <component
          :is="locked || !findById(store.catalog.activities, id) ? 'div' : 'router-link'"
          :class="cx(ui.card, 'block p-4 no-underline')"
          :to="locked ? undefined : `/actividad/${id}`"
        >
          <strong>{{ findById(store.catalog.activities, id).title }}</strong>
          <p :class="ui.eyebrow">{{ TYPE_LABELS[findById(store.catalog.activities, id).type] }}</p>
          <p class="mt-1 text-sm">
            {{ activityDone(id) ? "Completada · se puede revisar sin volver a sumar puntos" : "Pendiente" }}
          </p>
        </component>
      </li>
    </ul>
  </section>
</template>
