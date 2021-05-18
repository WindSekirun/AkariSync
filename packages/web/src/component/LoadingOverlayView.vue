<template>
  <v-overlay :z-index="zIndex" :value="overlay">
    <v-progress-circular indeterminate color="orange"></v-progress-circular>
  </v-overlay>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class LoadingOverlayView extends Vue {
  zIndex = 10000;
  overlay: boolean | null = false;

  showOverlay() {
    this.overlay = true;
  }

  hideOverlay() {
    this.overlay = false;
  }
}
</script>
