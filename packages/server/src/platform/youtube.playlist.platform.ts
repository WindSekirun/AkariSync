import { YoutubeDLExecutor } from "../executor/youtube.dl.executor";
import { VideoObject } from "../model/videoobject";
import { Platform } from "./platform";

export class YoutubePlayListPlatform implements Platform {
  static platformType = "youtube_playlist";

  youtubeDLExecutor = new YoutubeDLExecutor();

  async getList(targetId: string): Promise<VideoObject[]> {
    return await this.youtubeDLExecutor.getPlayList(
      `https://www.youtube.com/playlist?list=${targetId}`,
      this
    );
  }

  getLoginString(): string {
    // currently, we don't support login feature in youtube platform.
    return ``;
  }

  getDownloadLink(videoObject: VideoObject): string {
    return `https://www.youtube.com/watch?v=${videoObject.link}`;
  }
}
