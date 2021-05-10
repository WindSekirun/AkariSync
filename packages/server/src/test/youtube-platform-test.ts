import { YoutubeDLExecutor } from "../executor/youtube.dl.executor";
import { YoutubePlayListPlatform } from "../platform/youtube.playlist.platform";

require("dotenv").config();

async function platform() {
  const youtubeDLExecutor = new YoutubeDLExecutor();
  youtubeDLExecutor.getPlayList(
    "https://www.youtube.com/playlist?list=PLq1XYNuoV1jKy3NsiiYSHAik6TMIQIHVF"
  );
}

platform();
