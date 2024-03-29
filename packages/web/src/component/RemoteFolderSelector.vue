<template>
  <div>
    <v-dialog v-model="dialog" scrollable max-width="80vh">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="orange lighten-1" dark v-bind="attrs" v-on="on">
          Open Folder Selector
        </v-btn>
      </template>
      <v-card class="pa-2">
        <v-card-title class="headline">Folder Selector</v-card-title>
        <v-card-subtitle>
          {{ description }} <br />
          Selected Path: {{ selectedPath }}
        </v-card-subtitle>
        <v-card-text style="height: 300px;">
          <v-list-item
            @click="clickNode(item)"
            v-for="(item, index) in items"
            :key="index"
            class="mb-2"
          >
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ item.path }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <!-- make directory -->
          <v-dialog v-model="directoryDialog" max-width="80vh" persistent>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="orange darken-1" text v-bind="attrs" v-on="on">
                Make Directory
              </v-btn>
            </template>

            <v-card class="pa-2">
              <v-card-title class="headline">Make new Folder</v-card-title>
              <v-card-text class="mt-5">
                <v-text-field v-model="directoryName" label="Directory Name" color="orange" />
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="orange darken-1" text @click="directoryDialog = false">
                  Close
                </v-btn>
                <v-btn color="orange darken-1" text @click="clickMakeDirectory()">
                  Make
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-spacer />
          <v-btn color="grey darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="orange darken-1" text @click="clickConfirm()">
            Confirm
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
import { WebDavClient } from "@akari-sync/util/webdav/webdavclient";
import { FileStat } from "webdav";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { DESCRIPTION_FOLDER_SELECT } from "../Constants";
import LoadingOverlayView from "@/component/LoadingOverlayView.vue";

class FolderItem {
  name: string;
  path: string;

  static fromStat(fileStat: FileStat) {
    const item = new FolderItem();
    item.name = fileStat.basename;
    item.path = fileStat.filename + "/";
    return item;
  }

  static parent() {
    const item = new FolderItem();
    item.name = "../";
    item.path = "Move to Parent";
    return item;
  }
}

@Component({
  components: {
    LoadingOverlayView
  }
})
export default class RemoteFolderSelector extends Vue {
  @Prop({ type: String, default: DESCRIPTION_FOLDER_SELECT }) description: string;
  webdavClient: WebDavClient;
  items: FolderItem[] = [];
  selectedPath: string | null = null;

  dialog: boolean | null = false;
  directoryDialog: boolean | null = false;

  snackbar: boolean | null = false;
  snackbarText: string = "";

  directoryName: string | null = null;
  parent: string;
  parentItem = FolderItem.parent();

  @Watch("dialog")
  async onDialogStateChanged(newValue: boolean) {
    if (newValue) {
      this.selectedPath = "/";
      await this.loadPath("/", false);
    }
  }

  async mounted() {
    this.webdavClient = new WebDavClient(
      process.env.VUE_APP_WEBDAV_PATH,
      process.env.VUE_APP_WEBDAV_USERNAME,
      process.env.VUE_APP_WEBDAV_PASSWORD
    );

    await this.loadPath("/", false);
  }

  async clickMakeDirectory() {
    if (!this.directoryName) {
      this.snackbarText = "Directory can't be empty!";
      this.snackbar = true;
      return;
    }

    const overlayView = this.$refs.overlay as LoadingOverlayView;
    overlayView.showOverlay();

    await this.webdavClient.createDirectoryIfAbsent(this.selectedPath + this.directoryName);
    await this.loadPath(this.selectedPath || "");
    overlayView.hideOverlay();

    this.directoryDialog = false;
  }

  clickConfirm() {
    this.$emit("confirm-click", this.selectedPath);
    this.dialog = false;
  }

  async clickNode(node: FolderItem) {
    if (node.name == "../" && this.parent) {
      this.selectedPath = this.parent;
      await this.loadPath(this.parent);
    } else {
      this.selectedPath = node.path;
      await this.loadPath(node.path);
    }
  }

  private async loadPath(path: string, includeParent: boolean = true) {
    const main = await this.webdavClient.getDirectoryContents(path);
    const folderItemList = main
      .filter((element) => element.type == "directory")
      .filter((element) => !parent || element.basename != parent.name)
      .map((element) => FolderItem.fromStat(element));

    this.items = [];
    if (includeParent) {
      this.items.push(this.parentItem);
    }
    this.items.push(...folderItemList);

    this.calculateParent(path);
    this.$forceUpdate();
  }

  private calculateParent(path: string) {
    const split = path.split("/").filter((element) => element != "");
    if (split.length >= 2) {
      this.parent =
        "/" +
        split.slice(0, split.length - 1).reduce((previous, current) => `${previous}/${current}`);
    } else {
      this.parent = "/";
    }
  }
}
</script>
