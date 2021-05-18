<template>
  <div>
    <v-row>
      <v-col cols="12" sm="12" md="6" lg="3" v-for="(item, index) in mainList" :key="index">
        <v-card outlined shaped>
          <v-img
            max-height="250"
            :src="item.thumbnail"
            :lazy-src="item.thumbnail"
            aspect-ratio="1.7778"
            class="white--text align-end"
          >
            <v-card-title class="text-stroke">{{ item.name }}</v-card-title>
            <template #placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-subtitle>{{ getPlatformLabel(item) }}</v-list-item-subtitle>
              <v-list-item-subtitle>{{ getExtensionLabel(item) }} </v-list-item-subtitle>
              <v-list-item-subtitle>Sync Directory: {{ item.syncDirectory }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-card-actions>
            <v-btn text @click="clickEdit(item)">
              EDIT
            </v-btn>
            <v-btn text @click="clickSync(item)">
              Sync Now
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar">
      {{ snackbarText }}
    </v-snackbar>
    <sync-data-detail-view ref="syncDetailView" />
  </div>
</template>

<script lang="ts">
import { SyncDataDto } from "@akari-sync/dto";
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import SyncDataDetailView from "@/component/SyncDataDetailView.vue";
import {
  platformList,
  platformLabelList,
  extensionList,
  extensionLabelList
} from "@akari-sync/dto/Constants";

@Component({
  components: {
    SyncDataDetailView
  },
  computed: {
    ...mapState({
      mainList: "mainList"
    })
  }
})
export default class SyncDataView extends Vue {
  mainList: SyncDataDto[];
  snackbar: boolean | null = false;
  snackbarText: string = "";

  getExtensionLabel(syncData: SyncDataDto) {
    return `Extension: ` + extensionLabelList[extensionList.indexOf(syncData.extension)];
  }

  getPlatformLabel(syncData: SyncDataDto) {
    return `Platform: ` + platformLabelList[platformList.indexOf(syncData.platform)];
  }

  clickEdit(syncData: SyncDataDto) {
    const detailView = this.$refs.syncDetailView as SyncDataDetailView;
    detailView.openDialog(syncData);
  }

  async clickSync(syncData: SyncDataDto) {
    await Vue.axios.post("/syncdata/sync", syncData);
    this.snackbarText = `${syncData.name} is requested.`;
    this.snackbar = true;
  }
}
</script>

<style>
.text-stroke {
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
}
</style>
