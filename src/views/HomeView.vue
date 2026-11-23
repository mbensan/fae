<script setup>
import { computed } from "vue";
import { useProgressStore } from "@/stores/progress";
import { openDialog } from "@/composables/feedback";
import { currentMission, firstIncompleteActivity, missionProgress } from "@/lib/progress";
import { iconKey } from "@/lib/missions";
import { publicUrl } from "@/lib/publicUrl";
import { cx, ui } from "@/lib/ui";
import AppIcon from "@/components/AppIcon.vue";
import EthicNote from "@/components/EthicNote.vue";
import PointsPill from "@/components/PointsPill.vue";

const store = useProgressStore();
const mission = computed(() => currentMission(store.profile, store.catalog.missions));
const progress = computed(() => missionProgress(mission.value, store.profile));
const activityId = computed(() => firstIncompleteActivity(mission.value, store.profile));

function openCommunity() {
  openDialog({
    title: "Comunidad",
    paragraphs: [
      "Este espacio reunirá a familias que se están preparando. En el MVP no hay ranking ni comparación entre participantes."
    ]
  });
}
</script>

<template>
  <section
    :class="cx(ui.screen, 'bg-[radial-gradient(120%_60%_at_80%_18%,#fff6c9_0%,transparent_55%),linear-gradient(180deg,#f4fbff_0%,#FFF9EF_38%,#fff_100%)]')"
    aria-labelledby="screen-title"
  >
    <div class="flex items-start justify-between gap-3">
      <p class="mt-2 text-sm text-[#52677F]">Aprende. Reflexiona. Suma puntos. Cambia vidas.</p>
      <PointsPill />
    </div>
    <div class="px-2">
      <img
        :src="publicUrl('screens/familia.png')"
        alt="Familia abrazada con un perro. Las grandes historias también empiezan con una pregunta."
        class="mx-auto block h-auto w-full max-w-sm"
      >
    </div>
    <router-link :class="cx(ui.card, 'grid grid-cols-[auto_1fr_auto] items-center gap-3 p-4 no-underline')" :to="`/misiones/${mission.id}`">
      <div v-if="mission.id === 'mission-1'" class="h-14 w-14 overflow-hidden rounded-[1.1rem] bg-[#fff4e5]">
        <img :src="publicUrl('screens/nina.png')" alt="" class="h-full w-full object-cover object-top">
      </div>
      <div v-else class="grid h-14 w-14 place-items-center rounded-[1.1rem] bg-[#fff4e5]">
        <AppIcon :name="iconKey(mission.icon)" />
      </div>
      <div>
        <p :class="ui.eyebrow">Misión actual</p>
        <h2 id="screen-title" class="font-display text-lg font-extrabold leading-tight">{{ mission.title }}</h2>
      </div>
      <AppIcon name="chevron" />
      <div class="col-span-full">
        <p class="text-sm text-[#52677F]">{{ mission.shortDescription }}</p>
        <div class="mt-3 flex items-center justify-between gap-3 text-sm font-bold text-[#52677F]">
          <progress :class="ui.progress" max="100" :value="progress.percent">{{ progress.percent }}%</progress>
          <span class="shrink-0">{{ progress.percent }}%</span>
        </div>
      </div>
    </router-link>
    <router-link :class="cx(ui.btn, ui.btnPrimary)" :to="`/actividad/${activityId}`">Continuar misión →</router-link>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <router-link :class="cx(ui.card, 'grid min-h-[6.5rem] justify-items-center gap-2 p-3 text-center no-underline')" to="/misiones">
        <AppIcon name="target" />
        <strong class="text-sm">Misiones</strong>
        <span class="text-[0.7rem] text-[#52677F]">Tu ruta de aprendizaje</span>
      </router-link>
      <router-link :class="cx(ui.card, 'grid min-h-[6.5rem] justify-items-center gap-2 p-3 text-center no-underline')" to="/pasaporte">
        <AppIcon name="passport" />
        <strong class="text-sm">Tu Pasaporte</strong>
        <span class="text-[0.7rem] text-[#52677F]">Sella tu recorrido</span>
      </router-link>
      <router-link :class="cx(ui.card, 'grid min-h-[6.5rem] justify-items-center gap-2 p-3 text-center no-underline')" to="/premios">
        <AppIcon name="gift" />
        <strong class="text-sm">Tienda de premios</strong>
        <span class="text-[0.7rem] text-[#52677F]">Canjea tus puntos</span>
      </router-link>
      <button :class="cx(ui.card, 'grid min-h-[6.5rem] justify-items-center gap-2 p-3 text-center')" type="button" @click="openCommunity">
        <AppIcon name="community" />
        <strong class="text-sm">Comunidad</strong>
        <span class="text-[0.7rem] text-[#52677F]">Juntos por más familias</span>
      </button>
    </div>
    <EthicNote />
  </section>
</template>
