<script setup lang="ts">
import { ref } from 'vue';

const title = ref(import.meta.env.VITE_PROJECT_TITLE);
const author = ref(import.meta.env.VITE_AUTHOR);
</script>

<template>
  <header>
    <h1 v-text="title"></h1>
  </header>
  <main>
  </main>
  <footer>Made by: {{author}}</footer>
</template>

