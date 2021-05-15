<template>
  <v-sheet rounded="lg" class="pa-2" min-height="80vh">
    <h2>Instant</h2>
    <remote-folder-selector />
    <h2>List</h2>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import RemoteFolderSelector from "@/component/RemoteFolderSelector.vue";

@Component({
  components: {
    RemoteFolderSelector
  }
})
export default class Home extends Vue {}
</script>
