<script setup>
import { computed, ref } from "vue";
import { useProgressStore } from "@/stores/progress";
import { closeDialog, openDialog, toast } from "@/composables/feedback";
import { missingPoints } from "@/lib/progress";
import { icon } from "@/lib/icons";
import { cx, ui } from "@/lib/ui";
import AppIcon from "@/components/AppIcon.vue";
import EthicNote from "@/components/EthicNote.vue";

const store = useProgressStore();
const filter = ref("all");

const filters = [
  ["all", "Todos"],
  ["digital", "Digitales"],
  ["experience", "Experiencias"],
  ["product", "Productos"],
  ["raffle", "Sorteos"]
];

const rewards = computed(() => store.catalog.rewards.filter((item) => filter.value === "all" || item.category === filter.value));

function askRedeem(reward) {
  if (missingPoints(store.profile, reward) > 0 || !reward.available) return;
  openDialog({
    title: "Confirmar canje",
    paragraphs: [`¿Confirmas el canje de “${reward.title}” por ${reward.cost} puntos? El MVP no procesa pagos ni despachos reales.`],
    primaryLabel: "Confirmar",
    tone: "reward",
    onPrimary() {
      const result = store.redeem(reward);
      closeDialog();
      if (!result.ok) {
        toast(result.reason);
        return;
      }
      toast(store.saveError ? "No pudimos guardar el canje." : `${reward.actionLabel} confirmado`);
    }
  });
}
</script>

<template>
  <section :class="cx(ui.screen, 'bg-gradient-to-b from-[#fffaf0] to-white')" aria-labelledby="screen-title">
    <h1 id="screen-title" class="font-display text-2xl font-extrabold leading-tight">Tienda Acoge</h1>
    <p>Premios que inspiran más familias que acogen.</p>
    <div class="flex gap-2 overflow-x-auto pb-1" role="toolbar" aria-label="Filtrar premios">
      <button
        v-for="[id, label] in filters"
        :key="id"
        type="button"
        :class="cx(ui.chip, filter === id && ui.chipOn)"
        :aria-pressed="filter === id ? 'true' : 'false'"
        @click="filter = id"
      >
        {{ label }}
      </button>
    </div>
    <p v-if="rewards.length === 0" :class="cx(ui.card, 'p-4')">No hay premios en esta categoría por ahora.</p>
    <div v-else class="grid grid-cols-2 gap-3">
      <article v-for="reward in rewards" :key="reward.id" :class="cx(ui.card, 'grid gap-2 overflow-hidden p-3')">
        <div class="reward-art" v-html="icon(reward.image)"></div>
        <h3 class="font-display text-[0.95rem] font-extrabold leading-tight">{{ reward.title }}</h3>
        <p class="text-xs text-[#52677F]">{{ reward.description }}</p>
        <p class="inline-flex items-center gap-1 text-sm font-extrabold text-[#F43F4F]">
          <AppIcon name="heart" />
          {{ reward.cost }} puntos
        </p>
        <button v-if="!reward.available" :class="cx(ui.btn, ui.btnReward)" type="button" disabled>No disponible</button>
        <button
          v-else-if="missingPoints(store.profile, reward) === 0"
          :class="cx(ui.btn, reward.category === 'raffle' ? ui.btnGhost : ui.btnReward)"
          type="button"
          @click="askRedeem(reward)"
        >
          {{ reward.actionLabel }}
        </button>
        <button v-else :class="cx(ui.btn, ui.btnReward)" type="button" disabled>
          Te faltan {{ missingPoints(store.profile, reward) }} puntos
        </button>
      </article>
    </div>
    <router-link :class="cx(ui.btn, ui.btnSecondary)" to="/premios/historial">Ver historial de canjes</router-link>
    <EthicNote />
  </section>
</template>
