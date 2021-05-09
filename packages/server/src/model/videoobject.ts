import { Platform } from "src/platform/platform";

export class VideoObject {
  title = "";
  link = "";
  index = 0;
  platform: Platform;

  constructor(
    index: number,
    title: string | undefined,
    link: string | undefined,
    platform: Platform
  ) {
    this.index = index;
    this.title = title ?? "";
    this.link = link;
    this.platform = platform;
  }

  getDownloadLink() {
    return this.platform.getDownloadLink(this);
  }
}
