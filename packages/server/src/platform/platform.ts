import { VideoObject } from "../model/videoobject";

export interface Platform {
  getList(targetId: string): Promise<VideoObject[]>;

  getLoginString(): string;

  getDownloadLink(videoObject: VideoObject): string;
}
