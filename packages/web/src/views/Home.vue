<template>
  <v-sheet rounded="lg" class="pa-5">
    <v-btn block color="orange" class="mb-5"> Add new Entry </v-btn>
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
