<script setup>
import { icon } from "@/lib/icons";

defineProps({
  name: { type: String, required: true }
});
</script>

<template>
  <span class="inline-flex items-center justify-center leading-none" v-html="icon(name)"></span>
</template>
