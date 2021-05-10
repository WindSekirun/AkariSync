import { YoutubeDLExecutor } from "../executor/youtube.dl.executor";
import { YoutubePlayListPlatform } from "../platform/youtube.playlist.platform";

require("dotenv").config();

async function platform() {
  const youtubeDLExecutor = new YoutubeDLExecutor();
  const platform = new YoutubePlayListPlatform();
  const result = await youtubeDLExecutor.getPlayList(
    "https://www.youtube.com/playlist?list=PLcjfcO0ddWk9ueVTnp4BDFBOHOFC3GlFY",
    platform
  );
  console.log(result);
}

platform();
