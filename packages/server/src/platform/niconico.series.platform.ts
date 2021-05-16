import { VideoObject } from "../model/videoobject";
import { Platform } from "./platform";
import { NicoNicoPlatform } from "./niconico.platform";
import axios from "axios";
import { AxiosResponse } from "axios";
import Parser from "rss-parser";
import axiosCookieJarSupport from "axios-cookiejar-support";
import { YoutubeDLExecutor } from "src/executor/youtube.dl.executor";

axiosCookieJarSupport(axios);
axios.defaults.withCredentials = true;

export class NicoNicoSeriesPlatform extends NicoNicoPlatform implements Platform {
  static platformType = "niconico_series";

  youtubeDLExecutor = new YoutubeDLExecutor();

  async getList(targetId: string): Promise<VideoObject[]> {
    const cookieJar = await this.login();

    const url = `https://rss.1ni.co/series/${targetId}`;
    axios.defaults.jar = cookieJar;
    const response = await axios.get(url);
    return this.handleRss(response);
  }

  async getThumbnail(targetId: string) {
    const list = await this.getList(targetId);
    const video = list[list.length - 1];
    return this.youtubeDLExecutor.getThumbnail(video.link);
  }

  private async handleRss(response: AxiosResponse): Promise<VideoObject[]> {
    const parser = new Parser();
    const feed = await parser.parseString(response.data);
    return (feed.items ?? [])
      .sort((a, b) => {
        const aDate = Date.parse(a.pubDate || "");
        const bDate = Date.parse(b.pubDate || "");
        return aDate - bDate;
      })
      .map(
        (item, index: number) =>
          new VideoObject(index, item.title, item.link, (this as unknown) as Platform)
      )
      .sort((a, b) => (a.index < b.index ? -1 : a.index > b.index ? 1 : 0));
  }
}
