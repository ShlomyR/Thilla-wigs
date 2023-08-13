<template>
  <div :class="{ 'fonts-loaded': isFontLoaded, 'fonts-loading': !isFontLoaded }">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import FontFaceObserver from 'fontfaceobserver';

const font = ref(new FontFaceObserver('Roboto')); // Use the same font name as in the webfontloader configuration

const isFontLoaded = ref(false);

onMounted(async () => {
  try {
    await font.value.load(); // Wait for the font to load
    isFontLoaded.value = true;
  } catch (error) {
    console.error('Error loading font:', error);
  }
});
</script>

<style scoped>
/* Apply a fallback font while the web font is loading */
.fonts-loading {
  font-family: sans-serif;
  /* Use a generic sans-serif font */
}

/* Apply the loaded web font once it's available */
.fonts-loaded {
  font-family: 'Roboto', sans-serif;
  /* Use the loaded web font */
}
</style>
