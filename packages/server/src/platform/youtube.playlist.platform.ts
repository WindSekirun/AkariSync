import { YoutubeDLExecutor } from "../executor/youtube.dl.executor";
import { VideoObject } from "../model/videoobject";
import { Platform } from "./platform";

export class YoutubePlayListPlatform implements Platform {
  youtubeDLExecutor = new YoutubeDLExecutor();

  getList(targetId: string): Promise<VideoObject[]> {
    throw new Error("Method not implemented.");
  }

  getLoginString(): string {
    // currently, we don't suppot login feature in youtube platform.
    return ``;
  }

  getDownloadLink(videoObject: VideoObject): string {
    throw new Error("Method not implemented.");
  }
}
