<script setup>
import { useRoute } from "vue-router";
import { cx, ui } from "@/lib/ui";
import AppIcon from "@/components/AppIcon.vue";

const route = useRoute();

const items = [
  { nav: "home", to: "/inicio", icon: "home", label: "Inicio" },
  { nav: "missions", to: "/misiones", icon: "map", label: "Misiones" },
  { nav: "passport", to: "/pasaporte", icon: "passport", label: "Pasaporte" },
  { nav: "rewards", to: "/premios", icon: "gift", label: "Premios" },
  { nav: "more", to: "/mas", icon: "more", label: "Más" }
];
</script>

<template>
  <nav v-if="route.meta.nav" :class="ui.nav" aria-label="Navegación principal">
    <router-link
      v-for="item in items"
      :key="item.nav"
      :class="cx(ui.navItem, route.meta.nav === item.nav && ui.navItemActive)"
      :to="item.to"
      :aria-current="route.meta.nav === item.nav ? 'page' : undefined"
    >
      <AppIcon :name="item.icon" />
      <span>{{ item.label }}</span>
    </router-link>
  </nav>
</template>
