import { Job, DoneCallback } from "bull";
import { AudioExtension } from "./extension/audio.extension";
import { Extension } from "./extension/extension";
import { VideoExtension } from "./extension/video.extension";
import { NicoNicoMyListPlatform } from "./platform/niconico.mylist.platform";
import { Platform } from "./platform/platform";
import { SyncData } from "./schema/syncdata.schema";
import { createLocalDirectoryIfAbsent } from "./utils/folder";
import fs from "fs";
import { YoutubeDLExecutor } from "./executor/youtube.dl.executor";
import { TelegramNotifyExecutor } from "./executor/telegram.dl.executor";
import { WebDavClient } from "./webdav/webdavclient";
import { YoutubePlayListPlatform } from "./platform/youtube.playlist.platform";
import { NicoNicoSeriesPlatform } from "./platform/niconico.series.platform";

export default async function (job: Job, cb: DoneCallback) {
  const webDavClient = new WebDavClient();
  const youtubeDLExecutor = new YoutubeDLExecutor();
  const telegramNotifyExecutor = new TelegramNotifyExecutor();

  const syncData: SyncData = job.data.syncData;
  console.log(`Sync Started for ${syncData.name}`);

  // platform matching
  let platform: Platform;
  if (syncData.platform == NicoNicoMyListPlatform.platformType) {
    platform = new NicoNicoMyListPlatform();
  } else if (syncData.platform == YoutubePlayListPlatform.platformType) {
    platform = new YoutubePlayListPlatform();
  } else if (syncData.platform == NicoNicoSeriesPlatform.platformType) {
    platform = new NicoNicoSeriesPlatform();
  }

  // extension matching
  let extension: Extension;
  if (syncData.extension == AudioExtension.extensionType) {
    extension = new AudioExtension();
  } else if (syncData.extension == VideoExtension.extensionType) {
    extension = new VideoExtension();
  }

  if (!platform || !extension) {
    console.log("Can't find available extensions");
    cb();
    return;
  }

  await webDavClient.createDirectoryIfAbsent(syncData.syncDirectory);
  const tempPath = createLocalDirectoryIfAbsent(process.env.TEMP_PATH);
  const videoList = await platform.getList(syncData.targetId);
  const missingList = await extension.findMissingList(
    syncData.syncDirectory,
    webDavClient,
    videoList
  );

  if (missingList.length == 0) {
    console.log("No missing list found.");
    await telegramNotifyExecutor.sendMessage(`There are no new contents in ${syncData.name}`);
    cb();
    return;
  }

  const downloadedList = await Promise.all(
    missingList.map((missingFile) =>
      youtubeDLExecutor.downloadFile(platform, extension, missingFile, tempPath)
    )
  );

  await Promise.all(
    downloadedList.map((element) => webDavClient.writeFile(element, syncData.syncDirectory))
  );

  downloadedList.forEach((element) => fs.unlinkSync(element));

  await telegramNotifyExecutor.sendMessage(`Sync completed in ${syncData.name}`);
  cb();
}
