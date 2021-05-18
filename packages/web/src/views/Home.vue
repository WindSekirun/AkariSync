<template>
  <v-sheet rounded="lg" class="pa-5">
    <sync-data-view />
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SyncDataView from "@/component/SyncDataView.vue";

@Component({
  components: {
    SyncDataView
  }
})
export default class Home extends Vue {}
</script>
