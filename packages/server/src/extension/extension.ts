import { VideoObject } from "src/model/videoobject";
import { WebDavClient } from "@akari-sync/util/webdav/webdavclient";
import { VideoExtension } from "./video.extension";
import { AudioExtension } from "./audio.extension";

export interface Extension {
  findMissingList(
    syncDirectory: string,
    webdavclient: WebDavClient,
    currentPlayList: VideoObject[]
  ): Promise<VideoObject[]>;

  getTitle(videoObject: VideoObject): string;

  getAdditionalCommand(): string[][];
}

export function findExtension(extensionString: string): Extension {
  let extension: Extension;
  if (extensionString == AudioExtension.extensionType) {
    extension = new AudioExtension();
  } else if (extensionString == VideoExtension.extensionType) {
    extension = new VideoExtension();
  }
  return extension;
}

