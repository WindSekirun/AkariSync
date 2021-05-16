import fs from "fs";
import { Job, DoneCallback } from "bull";
import { findExtension } from "./extension/extension";
import { findPlatform } from "./platform/platform";
import { SyncData } from "./schema/syncdata.schema";
import { createLocalDirectoryIfAbsent } from "./utils/folder";
import { YoutubeDLExecutor } from "./executor/youtube.dl.executor";
import { TelegramNotifyExecutor } from "./executor/telegram.notify.executor";
import { WebDavClient } from "@akari-sync/util/webdav/webdavclient";

export default async function (job: Job, cb: DoneCallback) {
  const webDavClient = WebDavClient.fromEnv();
  const youtubeDLExecutor = new YoutubeDLExecutor();
  const telegramNotifyExecutor = new TelegramNotifyExecutor();

  const syncData: SyncData = job.data.syncData;
  console.log(`Sync Started for ${syncData.name}`);

  const platform = findPlatform(syncData.platform);
  const extension = findExtension(syncData.extension);

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
