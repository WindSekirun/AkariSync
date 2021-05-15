import { VideoObject } from "src/model/videoobject";
import { WebDavClient } from "@akari-sync/util/webdav/webdavclient";

export interface Extension {
  findMissingList(
    syncDirectory: string,
    webdavclient: WebDavClient,
    currentPlayList: VideoObject[]
  ): Promise<VideoObject[]>;

  getTitle(videoObject: VideoObject): string;

  getAdditionalCommand(): string[][];
}
