<script setup>
import { computed } from "vue";
import { useProgressStore } from "@/stores/progress";
import { findById } from "@/lib/catalog";
import { cx, ui } from "@/lib/ui";

const store = useProgressStore();
const items = computed(() => store.profile.redemptions || []);

function titleOf(item) {
  return item.title || findById(store.catalog.rewards, item.rewardId)?.title || item.rewardId;
}

function when(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short" });
}
</script>

<template>
  <section :class="ui.screen" aria-labelledby="screen-title">
    <h1 id="screen-title" class="font-display text-2xl font-extrabold leading-tight">Historial de canjes</h1>
    <p v-if="items.length === 0" :class="cx(ui.card, 'p-4')">
      Aún no has canjeado premios. Tus puntos siguen disponibles en este dispositivo.
    </p>
    <ul v-else class="grid list-none gap-3 p-0">
      <li v-for="item in items" :key="item.id" :class="cx(ui.card, 'grid gap-1 p-4')">
        <strong>{{ titleOf(item) }}</strong>
        <p>{{ item.cost }} puntos · saldo {{ item.balanceAfter }}</p>
        <p :class="ui.eyebrow">
          <time :datetime="item.createdAt">{{ when(item.createdAt) }}</time>
        </p>
      </li>
    </ul>
  </section>
</template>
