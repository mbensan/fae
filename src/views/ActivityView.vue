<script setup>
import { computed, nextTick, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useProgressStore } from "@/stores/progress";
import { closeDialog, openDialog, toast } from "@/composables/feedback";
import { findById } from "@/lib/catalog";
import { TYPE_LABELS } from "@/lib/missions";
import { optionLetter } from "@/lib/scoring";
import { cx, ui } from "@/lib/ui";
import AppIcon from "@/components/AppIcon.vue";
import { publicUrl } from "@/lib/publicUrl";

const route = useRoute();
const store = useProgressStore();
const selectedIds = ref([]);
const feedbackEl = ref(null);

const activity = computed(() => findById(store.catalog.activities, route.params.activityId));
const mission = computed(() => (activity.value ? findById(store.catalog.missions, activity.value.missionId) : null));
const record = computed(() => (activity.value ? store.profile.completedActivities[activity.value.id] : null));
const answered = computed(() => Boolean(record.value?.awardedAt));
const multiple = computed(() => activity.value?.type === "multiple-choice");
const index = computed(() => (mission.value && activity.value ? mission.value.activityIds.indexOf(activity.value.id) : 0));

const nextTo = computed(() => {
  if (!mission.value || !activity.value) return "/pasaporte";
  const following = mission.value.activityIds.slice(index.value + 1);
  if (following.length) return `/actividad/${following[0]}`;
  return `/actividad-resumen/${mission.value.id}`;
});

function syncSelection() {
  selectedIds.value = [...(record.value?.selectedOptionIds || [])];
}

watch(() => route.params.activityId, syncSelection, { immediate: true });

function toggle(id) {
  if (answered.value) return;
  if (multiple.value) {
    selectedIds.value = selectedIds.value.includes(id)
      ? selectedIds.value.filter((item) => item !== id)
      : [...selectedIds.value, id];
    return;
  }
  selectedIds.value = [id];
}

function optionExtra(option) {
  if (!answered.value || !activity.value) return "";
  const expected = new Set(activity.value.correctOptionIds);
  const picked = selectedIds.value.includes(option.id);
  const reflective = activity.value.type === "reflection" || activity.value.type === "family-activity";
  if (!reflective && expected.has(option.id)) return "border-[#22A84A] bg-[#E9F8EC]";
  if (picked) return reflective ? "border-[#22A84A] bg-[#E9F8EC]" : "border-[#e2b93a] bg-[#fff8de]";
  return "";
}

function markClass(option) {
  if (!answered.value || !activity.value) return ui.optionMark;
  const expected = new Set(activity.value.correctOptionIds);
  const reflective = activity.value.type === "reflection" || activity.value.type === "family-activity";
  if (!reflective && expected.has(option.id)) {
    return "grid h-[2.1rem] w-[2.1rem] place-items-center rounded-full bg-[#22A84A] font-extrabold text-white";
  }
  return ui.optionMark;
}

async function onSubmit() {
  if (!activity.value || selectedIds.value.length === 0 || answered.value) return;
  const result = store.submitActivity(activity.value, [...selectedIds.value]);
  await nextTick();
  feedbackEl.value?.focus();
  if (store.saveError) toast("No pudimos guardar el avance. Reintenta o continúa sin cerrar esta pestaña.");
  else if (!result.alreadyAwarded) toast(`+${result.pointsAwarded} puntos`);
  if (result.newBadges[0]) {
    openDialog({
      title: "Insignia desbloqueada",
      paragraphs: [`${result.newBadges[0].title}. ${result.newBadges[0].description}`]
    });
  }
}
</script>

<template>
  <section v-if="!activity || !mission" :class="ui.screen">
    <h1 id="screen-title" class="font-display text-2xl font-extrabold">No disponible</h1>
    <p>No encontramos esa actividad.</p>
    <router-link :class="cx(ui.btn, ui.btnPrimary)" to="/inicio">Volver al inicio</router-link>
  </section>
  <section v-else :class="ui.screenActivity" aria-labelledby="screen-title">
    <div class="grid grid-cols-[1fr_auto] items-center gap-3">
      <progress :class="ui.progress" :max="mission.activityIds.length" :value="index + 1">{{ index + 1 }} de {{ mission.activityIds.length }}</progress>
      <span :class="ui.eyebrow">Pregunta {{ index + 1 }} de {{ mission.activityIds.length }}</span>
    </div>
    <div class="inline-flex items-center gap-2 font-extrabold text-[#063B78]">
      <AppIcon name="book" />
      <div>
        <p>{{ TYPE_LABELS[activity.type] }}</p>
        <p :class="ui.eyebrow">Misión {{ mission.order }} · {{ mission.title }}</p>
      </div>
    </div>
    <h1 id="screen-title" class="sr-only">{{ activity.title }}</h1>
    <img
      v-if="mission.id === 'mission-1'"
      :src="publicUrl('screens/nina.png')"
      alt="Niña pensando con un lápiz. Pequeñas preguntas, grandes cambios."
      class="mx-auto block h-auto max-h-56 w-full rounded-[1.25rem] object-contain"
    >
    <p class="text-[1.05rem] font-semibold">{{ activity.prompt }}</p>
    <p v-if="activity.question" class="font-display text-lg font-extrabold">{{ activity.question }}</p>
    <form @submit.prevent="onSubmit">
      <fieldset class="m-0 grid min-w-0 gap-3 border-0 p-0">
        <legend class="sr-only">{{ multiple ? "Elige una o más alternativas" : "Elige una alternativa" }}</legend>
        <label
          v-for="(option, optionIndex) in activity.options"
          :key="option.id"
          :class="cx(ui.option, optionExtra(option), answered && 'cursor-default opacity-95')"
        >
          <input
            class="option-input"
            :type="multiple ? 'checkbox' : 'radio'"
            name="activity-option"
            :value="option.id"
            :checked="selectedIds.includes(option.id)"
            :disabled="answered"
            @change="toggle(option.id)"
          >
          <span :class="markClass(option)">{{ optionLetter(optionIndex) }}</span>
          <span>{{ option.text }}</span>
        </label>
      </fieldset>
      <button
        v-if="!answered"
        :class="cx(ui.btn, ui.btnPrimary, 'mt-5')"
        type="submit"
        :disabled="selectedIds.length === 0"
      >
        Responder →
      </button>
    </form>
    <router-link v-if="answered" :class="cx(ui.btn, ui.btnPrimary)" :to="nextTo" @click="closeDialog">Siguiente →</router-link>
    <article
      v-if="answered"
      id="activity-feedback"
      ref="feedbackEl"
      tabindex="-1"
      :class="cx(ui.card, 'grid gap-2 p-4', record.isRecommended ? 'border-[#b7e4c3] bg-[#E9F8EC]' : 'border-[#f0d78c] bg-[#fff8de]')"
    >
      <h2 class="font-display text-lg font-extrabold">{{ record.isRecommended ? "¡Buen análisis!" : "Miremos esta situación nuevamente" }}</h2>
      <p>{{ record.isRecommended ? activity.feedback.recommended : activity.feedback.review }}</p>
      <p :class="ui.eyebrow">{{ record.pointsAwarded ? `+${record.pointsAwarded} puntos` : "Ya habías recibido estos puntos" }}</p>
    </article>
    <p :class="cx(ui.card, 'grid grid-cols-[auto_1fr] gap-3 p-4 text-sm text-[#52677F]')">
      <AppIcon name="bulb" />
      <span>Recuerda: no hay respuestas perfectas. Lo importante es reflexionar y aprender juntos.</span>
    </p>
  </section>
</template>
