import { join } from "path";
import { VideoObject } from "../model/videoobject";
import fs from "fs";
import { Extension } from "../extension/extension";
import { Platform } from "src/platform/platform";

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

    const files = fs.readdirSync(tempPath).filter((fn) => fn.startsWith(videoTitle));
    return join(tempPath, files[0]);
  }

  async getPlayList(url: string) {
    const commandList = [["yt-dlp"], ["-j"], [`"${url}"`]];

    const command = commandList.map((element) => element.join(" ")).join(" ");
    const output = exec(command, { stdio: "inherit" }).toString("utf8");
    console.log(output);
  }
}
