import { VideoObject } from "../model/videoobject";
import { WebDavClient } from "../webdav/webdavclient";
import { Extension } from "./extension";
import path from "path";
import sanitize from "sanitize-filename";

export class VideoExtension implements Extension {
  static extensionType = "video";

  async findMissingList(
    syncDirectory: string,
    webdavclient: WebDavClient,
    currentPlayList: VideoObject[]
  ): Promise<VideoObject[]> {
    const syncedList = (await webdavclient.getDirectoryContents(syncDirectory)).map((element) => {
      const fileName = element.basename;
      return [fileName, path.parse(fileName).name];
    });

    const result = currentPlayList
      .map((element) => this.getTitle(element))
      .filter((element) => !syncedList.find((syncElement) => syncElement[1] == element));

    const find = result.map((element) =>
      currentPlayList.find((playListElement) => this.getTitle(playListElement).includes(element))
    );

    return find;
  }

  getTitle(videoobject: VideoObject): string {
    const pad = `${videoobject.index + 1}`.padStart(4, "0");
    return `${pad}-${sanitize(`${videoobject.title}`)}`;
  }

  getAdditionalCommand(): string[][] {
    return [["--extract-audio"], ["--audio-format", "mp3"], ["--audio-quality", "0"]];
  }
}
