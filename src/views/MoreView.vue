<script setup>
import { useRouter } from "vue-router";
import { useProgressStore } from "@/stores/progress";
import { closeDialog, openDialog, toast } from "@/composables/feedback";
import { ui, cx } from "@/lib/ui";
import AppIcon from "@/components/AppIcon.vue";

const store = useProgressStore();
const router = useRouter();

function openHelp() {
  openDialog({
    title: "Ayuda",
    paragraphs: [
      "Completa misiones, responde casos y canjea puntos. Si te equivocas, verás una explicación para seguir aprendiendo. Nada de esto evalúa si puedes acoger."
    ]
  });
}

function openPrivacy() {
  openDialog({
    title: "Privacidad",
    paragraphs: ["Todos los casos son ficticios. El avance se guarda solo en este dispositivo con localStorage. El MVP no envía datos a un servidor."]
  });
}

function openCredits() {
  openDialog({
    title: "Créditos y fuentes",
    links: store.catalog.sources.map((source) => ({
      href: source.url,
      label: `${source.title} — ${source.publisher}`
    }))
  });
}

function askReset() {
  openDialog({
    title: "Reiniciar demo",
    paragraphs: ["Esto restaura el perfil de Camila, los 350 puntos y el avance inicial. No se puede deshacer."],
    primaryLabel: "Reiniciar demo",
    tone: "danger",
    onPrimary() {
      store.resetDemo();
      closeDialog();
      router.push("/inicio");
      toast("Demo restaurada");
    }
  });
}
</script>

<template>
  <section :class="cx(ui.screen, 'bg-[#FFF9EF]')" aria-labelledby="screen-title">
    <h1 id="screen-title" class="font-display text-2xl font-extrabold leading-tight">Más</h1>
    <p>Ayuda, privacidad y ajustes de esta demo.</p>
    <div :class="cx(ui.card, 'divide-y divide-[#D8DEE6] overflow-hidden')">
      <router-link class="flex min-h-11 w-full items-center justify-between px-4 py-4 text-left no-underline" to="/mas/accesibilidad">
        <span>Accesibilidad</span>
        <AppIcon name="chevron" />
      </router-link>
      <button class="flex min-h-11 w-full items-center justify-between px-4 py-4 text-left" type="button" @click="openHelp">
        <span>Ayuda</span>
        <AppIcon name="chevron" />
      </button>
      <button class="flex min-h-11 w-full items-center justify-between px-4 py-4 text-left" type="button" @click="openPrivacy">
        <span>Privacidad</span>
        <AppIcon name="chevron" />
      </button>
      <button class="flex min-h-11 w-full items-center justify-between px-4 py-4 text-left" type="button" @click="openCredits">
        <span>Créditos y fuentes</span>
        <AppIcon name="chevron" />
      </button>
      <button class="flex min-h-11 w-full items-center justify-between px-4 py-4 text-left" type="button" @click="askReset">
        <span>Reiniciar demo</span>
        <AppIcon name="chevron" />
      </button>
    </div>
    <p :class="ui.eyebrow">El contenido de esta demo está pendiente de validación técnica del programa antes de producción.</p>
    <p :class="ui.eyebrow">Los puntos reconocen participación y aprendizaje. No representan idoneidad para acoger.</p>
    <ul class="grid list-none gap-3 p-0">
      <li v-for="source in store.catalog.sources" :key="source.id">
        <a class="font-semibold text-[#07559A]" :href="source.url" target="_blank" rel="noopener noreferrer">{{ source.title }}</a>
      </li>
    </ul>
  </section>
</template>
