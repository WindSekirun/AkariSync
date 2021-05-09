/* eslint-disable  */
import {
  OnQueueActive,
  OnQueueWaiting,
  Process,
  Processor
} from "@nestjs/bull";
import { Job } from "bull";
import { NicoNicoMyListPlatform } from "./platform/niconico.mylist.platform";
import { Platform } from "./platform/platform";
import { SyncData } from "./schema/syncdata.schema";
import { WebDavClient } from "./webdav/webdavclient";

@Processor("syncQueue")
export class SyncQueueConsumer {
  webDavClient: WebDavClient;

  constructor() {
    this.webDavClient = new WebDavClient();
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`
    );
  }

  @OnQueueWaiting()
  onWaiting(jobid: number | string) {
    console.log(`Job waiting ${jobid}`);
  }

  @Process()
  async syncStart(job: Job) {
    const syncData: SyncData = job.data.syncData;
    console.log(`Sync Started for ${syncData.name}`);

    // platform matching
    let platform: Platform;
    if (syncData.platform == NicoNicoMyListPlatform.platformType) {
      platform = new NicoNicoMyListPlatform();
    }

    const videoList = await platform.getList(syncData.targetId);
    const syncedList = await this.webDavClient.getDirectoryContents(
      syncData.syncDirectory
    );
    console.log(syncedList);

    job.moveToCompleted();
  }
}
