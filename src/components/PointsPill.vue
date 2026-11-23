<script setup>
import { useProgressStore } from "@/stores/progress";
import { openDialog } from "@/composables/feedback";
import { ui } from "@/lib/ui";
import AppIcon from "@/components/AppIcon.vue";

const store = useProgressStore();

function openPoints() {
  const movements = [...(store.profile.pointMovements || [])].reverse().slice(0, 8);
  openDialog({
    title: "Tus puntos",
    items: movements.length
      ? movements.map((item) => `${item.delta > 0 ? "+" : ""}${item.delta} · ${item.label}`)
      : ["Aún no hay movimientos."]
  });
}
</script>

<template>
  <button :class="ui.points" type="button" :aria-label="`${store.profile.points} puntos`" @click="openPoints">
    <AppIcon name="heart" />
    <strong>{{ store.profile.points }}</strong>
  </button>
</template>
