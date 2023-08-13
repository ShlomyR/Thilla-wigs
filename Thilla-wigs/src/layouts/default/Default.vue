<template>
  <v-app>
    <!-- <FontLoader> -->
      <default-bar />
      <default-view />
      <Footer/>
    <!-- </FontLoader> -->
  </v-app>
</template>

<script lang="ts" setup>
  import Footer from './Footer.vue';
  import DefaultBar from './AppBar.vue'
  import DefaultView from './View.vue'
</script>
