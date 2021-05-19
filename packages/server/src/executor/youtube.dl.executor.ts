import { join } from "path";
import { VideoObject } from "../model/videoobject";
import fs from "fs";
import { Extension } from "../extension/extension";
import { Platform } from "src/platform/platform";
import sanitize from "sanitize-filename";

const exec = require("child_process").execSync;

export class YoutubeDLExecutor {
  async downloadFile(
    platform: Platform,
    extension: Extension,
    videoObject: VideoObject,
    tempPath: string
  ) {
    const videoTitle = extension.getTitle(videoObject);
    const destination = join(tempPath, `${videoTitle}.%(ext)s`);

    console.log(`Starting download ${videoObject.title}`);

    const commandList = [
      ["yt-dlp"],
      ["-o", `"${destination}"`],
      [platform.getLoginString()],
      [videoObject.getDownloadLink()]
    ];

    commandList.push(...extension.getAdditionalCommand());

    const command = commandList.map((element) => element.join(" ")).join(" ");
    console.log(command);

    exec(command, { stdio: "inherit" });

    const files = fs.readdirSync(tempPath);
    return join(tempPath, files[0]);
  }

  async getPlayList(url: string, platform: Platform): Promise<VideoObject[]> {
    const commandList = [["yt-dlp"], ["--get-title", "--get-id"], [`"${url}"`]];

    const command = commandList.map((element) => element.join(" ")).join(" ");
    const output: string = exec(command, { encoding: "UTF-8" }).toString();

    return this.chunk(output.split("\n"), 2)
      .filter((element) => element.length == 2)
      .map((value, index) => new VideoObject(index, value[0], value[1], platform));
  }

  async getThumbnail(url: string): Promise<string> {
    const commandList = [["yt-dlp"], ["--get-thumbnail"], [`"${url}"`]];
    const command = commandList.map((element) => element.join(" ")).join(" ");
    const output: string = exec(command, { encoding: "UTF-8" }).toString();
    return output.replace("\n", "");
  }

  private chunk<T>(arr: T[], len: number) {
    const chunks = [];
    let i = 0;
    const n = arr.length;

    while (i < n) {
      chunks.push(arr.slice(i, (i += len)));
    }

    return chunks;
  }
}
