import { OnQueueActive, OnQueueWaiting, Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { YoutubeDLExecutor } from "./executor/youtube.dl.executor";
import { AudioExtension } from "./extension/audio.extension";
import { Extension } from "./extension/extension";
import { VideoExtension } from "./extension/video.extension";
import { NicoNicoMyListPlatform } from "./platform/niconico.mylist.platform";
import { Platform } from "./platform/platform";
import { SyncData } from "./schema/syncdata.schema";
import { createLocalDirectoryIfAbsent } from "./utils/folder";
import { WebDavClient } from "./webdav/webdavclient";
import fs from "fs";

@Processor("syncQueue")
export class SyncQueueConsumer {
  webDavClient: WebDavClient;
  extractor = new YoutubeDLExecutor();

  constructor() {
    this.webDavClient = new WebDavClient();
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(`Processing job ${job.id} of type ${job.name} with data ${job.data}...`);
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

    // extension matching
    let extension: Extension;
    if (syncData.extension == AudioExtension.extensionType) {
      extension = new AudioExtension();
    } else if (syncData.extension == VideoExtension.extensionType) {
      extension = new VideoExtension();
    }

    await this.webDavClient.createDirectoryIfAbsent(syncData.syncDirectory);
    const tempPath = createLocalDirectoryIfAbsent(process.env.TEMP_PATH);
    const videoList = await platform.getList(syncData.targetId);
    const missingList = await extension.findMissingList(
      syncData.syncDirectory,
      this.webDavClient,
      videoList
    );
    if (missingList.length == 0) {
      console.log("No missing list found.");
    }

    const downloadedList = await Promise.all(
      missingList.map((missingFile) =>
        this.extractor.downloadFile(platform, extension, missingFile, tempPath)
      )
    );

    await Promise.all(
      downloadedList.map((element) => this.webDavClient.writeFile(element, syncData.syncDirectory))
    );

    downloadedList.forEach((element) => fs.unlinkSync(element));

    job.moveToCompleted();
  }
}
