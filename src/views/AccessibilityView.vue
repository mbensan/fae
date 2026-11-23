<script setup>
import { ref } from "vue";
import { readPreferences, setHighContrast, setLargeText } from "@/lib/preferences";
import { cx, ui } from "@/lib/ui";

const prefs = readPreferences();
const largeText = ref(prefs.largeText);
const highContrast = ref(prefs.highContrast);

function onText(event) {
  largeText.value = event.target.checked;
  setLargeText(largeText.value);
}

function onContrast(event) {
  highContrast.value = event.target.checked;
  setHighContrast(highContrast.value);
}
</script>

<template>
  <section :class="ui.screen" aria-labelledby="screen-title">
    <h1 id="screen-title" class="font-display text-2xl font-extrabold leading-tight">Accesibilidad</h1>
    <label :class="cx(ui.card, 'flex min-h-11 items-center gap-3 p-4')">
      <input type="checkbox" :checked="largeText" @change="onText">
      Texto más grande
    </label>
    <label :class="cx(ui.card, 'flex min-h-11 items-center gap-3 p-4')">
      <input type="checkbox" :checked="highContrast" @change="onContrast">
      Contraste reforzado
    </label>
    <p>El foco del teclado es visible y las preguntas usan agrupación semántica. Esta demo respeta la preferencia de movimiento reducido del sistema.</p>
  </section>
</template>
