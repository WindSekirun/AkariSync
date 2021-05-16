import { VideoObject } from "../model/videoobject";
import { NicoNicoMyListPlatform } from "./niconico.mylist.platform";
import { NicoNicoSeriesPlatform } from "./niconico.series.platform";
import { YoutubePlayListPlatform } from "./youtube.playlist.platform";

export interface Platform {
  getList(targetId: string): Promise<VideoObject[]>;

  getLoginString(): string;

  getDownloadLink(videoObject: VideoObject): string;

  getThumbnail(targetId: string);
}

export function findPlatform(platformString: string): Platform {
  let platform: Platform;
  if (platformString == NicoNicoMyListPlatform.platformType) {
    platform = new NicoNicoMyListPlatform();
  } else if (platformString == YoutubePlayListPlatform.platformType) {
    platform = new YoutubePlayListPlatform();
  } else if (platformString == NicoNicoSeriesPlatform.platformType) {
    platform = new NicoNicoSeriesPlatform();
  }
  return platform;
}
