<script setup>
import { ui } from "@/lib/ui";
</script>

<template>
  <a :class="ui.brand" href="#/inicio" aria-label="Desafío Acoge, ir al inicio">
    <span :class="ui.brandDesafioSm">DESAFÍO</span>
    <span :class="ui.brandAcogeSm">ACOGE</span>
  </a>
</template>
