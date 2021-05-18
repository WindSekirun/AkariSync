<template>
  <div>
    <v-dialog v-model="dialog" max-width="80vh" persistent>
      <v-card>
        <v-card-title class="headline">
          {{ title }}
        </v-card-title>
        <v-card-text class="mt-5">
          <v-text-field v-model="name" label="Name" color="orange" />
          <v-radio-group v-model="platform" row class="ma-0">
            <span class="me-2">Platform</span>
            <v-radio
              v-for="(item, index) in platformList"
              :key="index"
              :label="item"
              :value="index"
              color="orange"
            />
          </v-radio-group>
          <v-radio-group v-model="extension" row class="ma-0">
            <span class="me-2">Extension</span>
            <v-radio
              v-for="(item, index) in extensionList"
              :key="index"
              :label="item"
              :value="index"
              color="orange"
            />
          </v-radio-group>
          <v-text-field v-model="targetId" label="Target PlayList/Series ID" color="orange" />
          <v-row align="center">
            <v-col cols="8">
              <v-text-field
                v-model="syncDirectory"
                label="Remote Sync Directory"
                readonly
                color="orange"
              />
            </v-col>
            <v-col cols="4">
              <remote-folder-selector @confirm-click="submitRemoteFolder" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red darken-1" text @click="clickDelete()" v-if="editMode">
            Delete
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="orange darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="orange darken-1" text @click="clickSave()">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar">
      {{ snackbarText }}
    </v-snackbar>
    <loading-overlay-view ref="overlay" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { SyncDataDto } from "@akari-sync/dto";
import RemoteFolderSelector from "@/component/RemoteFolderSelector.vue";
import LoadingOverlayView from "@/component/LoadingOverlayView.vue";
import {
  platformList,
  platformLabelList,
  extensionList,
  extensionLabelList
} from "@akari-sync/dto/Constants";
import { LOAD_MAIN_LIST } from "../Constants";

@Component({
  components: {
    RemoteFolderSelector,
    LoadingOverlayView
  }
})
export default class SyncDataDetailView extends Vue {
  dialog = false;
  editMode = false;
  platformList = platformLabelList;
  extensionList = extensionLabelList;
  snackbar: boolean | null = false;
  snackbarText: string = "";

  // v-model
  name: string | null = null;
  platform: number | null = 0;
  extension: number | null = 0;
  targetId: string | null = null;
  syncDirectory: string | null = null;

  dataId: string | undefined = undefined;

  get title() {
    if (this.editMode) {
      return "Edit SyncData";
    } else {
      return "Add SyncData";
    }
  }

  async clickDelete() {
    await Vue.axios.delete(`/syncdata/delete/${this.dataId}`);
    this.snackbarText = `${this.name} is Deleted.`;
    this.snackbar = true;
    await this.requestRefresh();
    this.dialog = false;
  }

  async clickSave() {
    const syncData: SyncDataDto = {
      name: this.name || "",
      targetId: this.targetId || "",
      platform: platformList[this.platform || 0],
      extension: extensionList[this.extension || 0],
      syncDirectory: this.syncDirectory || ""
    };

    const overlayView = this.$refs.overlay as LoadingOverlayView;

    overlayView.showOverlay();
    if (this.editMode) {
      await Vue.axios.patch(`/syncdata/patch/${this.dataId}`, syncData);
      this.snackbarText = `${syncData.name} is edited.`;
    } else {
      await Vue.axios.put("/syncdata/create", syncData);
      this.snackbarText = `${syncData.name} is created.`;
    }

    this.snackbar = true;
    await this.requestRefresh();
    this.dialog = false;
    overlayView.hideOverlay();
  }

  openDialog(syncData: SyncDataDto | null) {
    if (syncData != null) {
      this.editMode = true;
      this.dataId = syncData._id;
      this.name = syncData.name;
      this.platform = platformList.indexOf(syncData.platform);
      this.extension = extensionList.indexOf(syncData.extension);
      this.targetId = syncData.targetId;
      this.syncDirectory = syncData.syncDirectory;
    } else {
      this.editMode = false;
      this.dataId = "";
      this.name = "";
      this.platform = 0;
      this.extension = 0;
      this.targetId = "";
      this.syncDirectory = "";
    }
    this.dialog = true;
  }

  submitRemoteFolder(syncDirectory: string) {
    this.syncDirectory = syncDirectory;
  }

  async requestRefresh() {
    await this.$store.dispatch(LOAD_MAIN_LIST);
  }
}
</script>
