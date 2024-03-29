import { createLocalDirectoryIfAbsent } from "../utils/folder";
import { YoutubeDLExecutor } from "../executor/youtube.dl.executor";
import { NicoNicoMyListPlatform } from "../platform/niconico.mylist.platform";
import { WebDavClient } from "@akari-sync/util/webdav/webdavclient";
import { AudioExtension } from "../extension/audio.extension";
import fs from "fs";

require("dotenv").config();

async function sync() {
  const syncData = {
    name: "test",
    platform: "niconico_mylist",
    extension: "video",
    syncDirectory: "/Data1/test/niconico/71008452",
    targetId: "71008452"
  };
  const client = WebDavClient.fromEnv();
  const platform = new NicoNicoMyListPlatform();
  const extension = new AudioExtension();
  const extractor = new YoutubeDLExecutor();
  await client.createDirectoryIfAbsent(syncData.syncDirectory);

  const tempPath = createLocalDirectoryIfAbsent(process.env.TEMP_PATH);
  const videoList = await platform.getList(syncData.targetId);

  const missingList = await extension.findMissingList(syncData.syncDirectory, client, videoList);
  if (missingList.length == 0) {
    console.log("No missing list found.");
  }

  const downloadedList = await Promise.all(
    missingList.map((missingFile) =>
      extractor.downloadFile(platform, extension, missingFile, tempPath)
    )
  );

  await Promise.all(
    downloadedList.map((element) => client.writeFile(element, syncData.syncDirectory))
  );

  downloadedList.forEach((element) => fs.unlinkSync(element));

  console.log("Sync completed!");
}

sync();
