<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useProgressStore } from "@/stores/progress";
import { closeDialog, toastMessage } from "@/composables/feedback";
import { ui } from "@/lib/ui";
import { applyPreferences } from "@/lib/preferences";
import AppHeader from "@/components/AppHeader.vue";
import BottomNav from "@/components/BottomNav.vue";
import AppDialog from "@/components/AppDialog.vue";

const route = useRoute();
const store = useProgressStore();
const main = ref(null);
const offline = ref(typeof navigator !== "undefined" ? !navigator.onLine : false);

function onOffline() {
  offline.value = true;
}
function onOnline() {
  offline.value = false;
}

onMounted(() => {
  applyPreferences();
  window.addEventListener("offline", onOffline);
  window.addEventListener("online", onOnline);
});

onUnmounted(() => {
  window.removeEventListener("offline", onOffline);
  window.removeEventListener("online", onOnline);
});

watch(
  () => route.fullPath,
  async () => {
    closeDialog();
    await nextTick();
    main.value?.focus({ preventScroll: true });
  }
);
</script>

<template>
  <a :class="ui.skip" href="#main-content">Saltar al contenido</a>
  <div :class="ui.shell">
    <AppHeader />
    <p v-if="offline" id="offline-banner" :class="ui.offline">
      Modo sin conexión. Tu avance se guardará en este dispositivo.
    </p>
    <main
      id="main-content"
      ref="main"
      tabindex="-1"
      :class="route.name === 'missions' ? 'flex-1 bg-[#5aad4a]' : 'flex-1'"
    >
      <router-view />
    </main>
    <BottomNav />
  </div>
  <div class="pointer-events-none fixed inset-x-0 bottom-24 z-40 grid justify-items-center" aria-live="polite" aria-atomic="true">
    <div v-if="toastMessage" :class="ui.toastInner">{{ toastMessage }}</div>
  </div>
  <p class="sr-only" aria-live="polite">{{ store.profile.points }} puntos</p>
  <AppDialog />
</template>
