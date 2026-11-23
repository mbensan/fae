<script setup>
import { nextTick, ref, watch } from "vue";
import { closeDialog, dialogState } from "@/composables/feedback";
import { cx, ui } from "@/lib/ui";

const el = ref(null);

const tones = {
  primary: ui.btnPrimary,
  reward: `${ui.btnReward} w-full`,
  danger: ui.btnDanger
};

watch(dialogState, async (value) => {
  await nextTick();
  const node = el.value;
  if (!node) return;
  if (value && !node.open) node.showModal();
  if (!value && node.open) node.close();
});

function onNativeClose() {
  if (dialogState.value) dialogState.value = null;
}

function runPrimary() {
  dialogState.value?.onPrimary?.();
}
</script>

<template>
  <dialog ref="el" :class="ui.dialog" aria-labelledby="dialog-title" @close="onNativeClose">
    <template v-if="dialogState">
      <h2 id="dialog-title" class="mb-3 font-display text-xl font-extrabold">{{ dialogState.title }}</h2>
      <p v-for="(paragraph, index) in dialogState.paragraphs || []" :key="index">{{ paragraph }}</p>
      <ul v-if="dialogState.items?.length" class="grid list-none gap-3 p-0">
        <li v-for="(item, index) in dialogState.items" :key="index">{{ item }}</li>
      </ul>
      <ul v-if="dialogState.links?.length" class="mt-3 grid list-none gap-3 p-0">
        <li v-for="link in dialogState.links" :key="link.href">
          <a class="font-semibold text-[#07559A]" :href="link.href" target="_blank" rel="noopener noreferrer">{{ link.label }}</a>
        </li>
      </ul>
      <div :class="ui.dialogActions">
        <router-link
          v-if="dialogState.primaryTo"
          :class="cx(ui.btn, ui.btnPrimary)"
          :to="dialogState.primaryTo"
          @click="closeDialog"
        >
          {{ dialogState.primaryLabel }}
        </router-link>
        <button
          v-else-if="dialogState.primaryLabel"
          type="button"
          :class="cx(ui.btn, tones[dialogState.tone] || ui.btnPrimary)"
          @click="runPrimary"
        >
          {{ dialogState.primaryLabel }}
        </button>
        <button type="button" :class="cx(ui.btn, ui.btnSecondary)" @click="closeDialog">Cerrar</button>
      </div>
    </template>
  </dialog>
</template>
