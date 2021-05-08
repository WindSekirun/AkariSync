import axios from "axios";
import Parser from "rss-parser";
import { VideoObject } from "src/model/videoobject";

export async function handleRss(url: string): Promise<VideoObject[]> {
  const parser = new Parser();
  const response = await axios.get(url);
  const feed = await parser.parseString(response.data);
  return (feed.items ?? [])
    .sort((a, b) => {
      const aDate = Date.parse(a.pubDate || "");
      const bDate = Date.parse(b.pubDate || "");
      return aDate - bDate;
    })
    .map((item, index: number) => new VideoObject(index, item.title, item.link))
    .sort((a, b) => (a.index < b.index ? -1 : a.index > b.index ? 1 : 0));
}
