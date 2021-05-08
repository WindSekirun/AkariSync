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

@Processor("syncQueue")
export class SyncQueueConsumer {
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
    if (syncData.platform == "niconico_mylist") {
      platform = new NicoNicoMyListPlatform();
    }

    const list = await platform.getList(syncData);
    console.log(list);

    job.moveToCompleted(list);
  }
}
