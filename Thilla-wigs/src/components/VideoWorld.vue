<template>
  <div class="iframe-container" :style="{ height: isMobile ? '245px' : '579px' }">
    <div v-if="!isMobile" class="overlay-top"></div>
    <iframe
      class="disabled-iframe"
      :style="{ height: isMobile ? '400px' : '700px' }"
      width="100%"
      src="https://www.youtube-nocookie.com/embed/0zVXkrDp5aU?controls=0&mute=1&autoplay=1&loop=1&playlist=0zVXkrDp5aU"
      frameborder="0"
      allowfullscreen
    ></iframe>
    <div
      v-if="!isMobile"
      :style="{
        background: sticky ? '#121212' : 'white',
      }"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { useAuth } from "@/components/useAuth";

const { sticky, isMobile } = useAuth();
</script>

<style scoped>
.iframe-container {
  position: relative;
  width: 100%; /* Set the width of the iframe */
  /* height: 700px; Set the height of the visible portion of the video */
  margin: 0 auto; /* Center the container */
  overflow: hidden; /* Hide the overflow */
}

.disabled-iframe {
  pointer-events: none;
  position: relative;
  top: -80px; /* Adjust the value to move the iframe up */
}

.overlay-top {
  position: absolute;
  width: 100%;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  text-align: center;
  padding: 10px;
}

.overlay-bottom {
  position: absolute;
  width: 100%;
  height: 50px;
  text-align: center;
  padding: 10px;
}

.overlay-bottom {
  bottom: 80px;
}
</style>
