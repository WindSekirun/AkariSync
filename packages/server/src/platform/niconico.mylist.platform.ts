import { VideoObject } from "../model/videoobject";
import { Platform } from "../platform/platform";
import { NicoNicoPlatform } from "./niconico.platform";
import axios from "axios";
import { AxiosResponse } from "axios";
import Parser from "rss-parser";
import axiosCookieJarSupport from "axios-cookiejar-support";

axiosCookieJarSupport(axios);
axios.defaults.withCredentials = true;

export class NicoNicoMyListPlatform extends NicoNicoPlatform implements Platform {
  static platformType = "niconico_mylist";

  async getList(targetId: string): Promise<VideoObject[]> {
    const cookieJar = await this.login();

    const url = `https://www.nicovideo.jp/mylist/${targetId}?rss=2.0`;
    axios.defaults.jar = cookieJar;
    const response = await axios.get(url);
    return this.handleRss(response);
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
