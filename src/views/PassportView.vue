<script setup>
import { computed } from "vue";
import { useProgressStore } from "@/stores/progress";
import { openDialog } from "@/composables/feedback";
import { iconKey, statusLabel } from "@/lib/missions";
import { currentMission, firstIncompleteActivity, missionStatus } from "@/lib/progress";
import { cx, ui } from "@/lib/ui";
import AppIcon from "@/components/AppIcon.vue";

const store = useProgressStore();
const completed = computed(() => store.profile.completedMissionIds.length);
const nextBadge = computed(() => store.catalog.badges.find((badge) => !store.profile.badgeIds.includes(badge.id)));
const nextMission = computed(() => currentMission(store.profile, store.catalog.missions));
const ownedCount = computed(() => store.profile.badgeIds.length);

function openStamp(mission) {
  const status = missionStatus(mission, store.profile, store.catalog.missions);
  openDialog({
    title: mission.title,
    paragraphs: [`${status === "locked" ? "Aún no disponible. " : ""}${mission.shortDescription}`],
    primaryLabel: status === "locked" ? "" : "Ver misión",
    primaryTo: status === "locked" ? "" : `/misiones/${mission.id}`
  });
}

function openBadge(badge) {
  const owned = store.profile.badgeIds.includes(badge.id);
  openDialog({
    title: badge.title,
    paragraphs: [`${owned ? "Ya la obtuviste. " : "Aún no desbloqueada. "}${badge.description}`]
  });
}
</script>

<template>
  <section :class="cx(ui.screen, 'bg-gradient-to-b from-[#f3fbff] to-white')" aria-labelledby="screen-title">
    <h1 id="screen-title" class="font-display text-2xl font-extrabold leading-tight">Tu Pasaporte Acoge</h1>
    <p>Cada misión completada es un paso hacia una decisión informada.</p>
    <div class="grid grid-cols-3 gap-3">
      <article :class="cx(ui.card, 'p-4 text-center')">
        <strong class="block font-display text-xl">{{ completed }}</strong>
        <span class="text-sm text-[#52677F]">Misiones</span>
      </article>
      <article :class="cx(ui.card, 'p-4 text-center')">
        <strong class="block font-display text-xl">{{ store.profile.points }}</strong>
        <span class="text-sm text-[#52677F]">Puntos</span>
      </article>
      <article :class="cx(ui.card, 'p-4 text-center')">
        <strong class="block font-display text-xl">{{ ownedCount }}</strong>
        <span class="text-sm text-[#52677F]">Insignias</span>
      </article>
    </div>
    <h2 class="font-display text-lg font-extrabold">Sellos de misión</h2>
    <div class="grid grid-cols-2 gap-3">
      <button
        v-for="mission in store.catalog.missions"
        :key="mission.id"
        type="button"
        :class="cx(ui.card, 'grid min-h-[8.5rem] justify-items-center gap-2 p-4 text-center', missionStatus(mission, store.profile, store.catalog.missions) === 'current' && 'ring-2 ring-[#0878BE]', missionStatus(mission, store.profile, store.catalog.missions) === 'locked' && 'grayscale')"
        @click="openStamp(mission)"
      >
        <div
          :class="cx('grid h-[3.2rem] w-[3.2rem] place-items-center rounded-full bg-[#eef6ff]', missionStatus(mission, store.profile, store.catalog.missions) === 'completed' && 'bg-[#E9F8EC] text-[#15803D]')"
        >
          <AppIcon
            :name="missionStatus(mission, store.profile, store.catalog.missions) === 'completed' ? 'check' : missionStatus(mission, store.profile, store.catalog.missions) === 'locked' ? 'lock' : iconKey(mission.icon)"
          />
        </div>
        <strong>Misión {{ mission.order === 7 ? "final" : mission.order }}</strong>
        <span class="text-sm">{{ mission.title }}</span>
        <span class="text-xs font-extrabold">
          {{ missionStatus(mission, store.profile, store.catalog.missions) === "current" ? "En curso" : statusLabel(missionStatus(mission, store.profile, store.catalog.missions)) }}
        </span>
      </button>
    </div>
    <article :class="cx(ui.card, 'grid gap-2 p-4')">
      <h2 class="font-display text-lg font-extrabold">Próxima insignia</h2>
      <p v-if="nextBadge">{{ nextBadge.title }}: {{ nextBadge.description }}</p>
      <p v-else>Ya desbloqueaste las insignias de este recorrido de demo.</p>
    </article>
    <h2 class="font-display text-lg font-extrabold">Insignias</h2>
    <p v-if="ownedCount === 0" :class="cx(ui.card, 'p-4 text-sm text-[#52677F]')">
      Aún no tienes insignias. Completa tu primera misión para obtener una.
    </p>
    <div class="grid gap-3">
      <button
        v-for="badge in store.catalog.badges"
        :key="badge.id"
        type="button"
        :class="cx(ui.card, 'grid gap-1 p-4 text-left', !store.profile.badgeIds.includes(badge.id) && 'opacity-70')"
        @click="openBadge(badge)"
      >
        <strong>{{ badge.title }}</strong>
        <p :class="ui.eyebrow">{{ store.profile.badgeIds.includes(badge.id) ? "Obtenida" : "Aún no desbloqueada" }}</p>
      </button>
    </div>
    <router-link :class="cx(ui.btn, ui.btnPrimary)" :to="`/actividad/${firstIncompleteActivity(nextMission, store.profile)}`">
      Continuar mi recorrido
    </router-link>
    <p class="text-sm text-[#52677F]">
      El Pasaporte reconoce tu participación y aprendizaje. No acredita idoneidad ni reemplaza el proceso formal de evaluación.
    </p>
  </section>
</template>
