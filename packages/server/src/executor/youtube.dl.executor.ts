import { join, resolve } from "path";
import { VideoObject } from "../model/videoobject";
import fs from "fs";
import { Extension } from "../extension/extension";
import { Platform } from "src/platform/platform";

const exec = require("child_process").execSync;

export class YoutubeDLExecutor {
  binaryPath: string;

  constructor() {
    this.binaryPath = join(__dirname, "../../../../youtube-dl/youtube_dl/__main__.py");
  }

  async downloadFile(
    platform: Platform,
    extension: Extension,
    videoObject: VideoObject,
    tempPath: string
  ) {
    const videoTitle = extension.getTitle(videoObject);
    const destination = resolve(tempPath, `${videoTitle}.%(ext)s`);

    console.log(`Starting download ${videoObject.title}`);

    const commandList = [
      ["python", this.binaryPath],
      ["-o", `"${destination}"`],
      [platform.getLoginString()],
      [videoObject.getDownloadLink()]
    ];

    commandList.push(...extension.getAdditionalCommand());

    const command = commandList.map((element) => element.join(" ")).join(" ");
    console.log(command);

    exec(command, { stdio: "inherit" });

    const files = fs.readdirSync(tempPath).filter((fn) => fn.startsWith(videoTitle));
    return files[1];
  }
}
