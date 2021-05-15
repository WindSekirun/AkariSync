import fs from "fs";
import path from "path";
import { createClient, FileStat, WebDAVClient } from "webdav";

require("dotenv").config();

export class WebDavClient {
  currentClient: WebDAVClient;

  constructor(
    path: string | undefined,
    username: string | undefined,
    password: string | undefined
  ) {
    this.internalInitialization(path || "", username || "", password || "");
  }

  static fromEnv() {
    const path = process.env.WEBDAV_PATH || "";
    const username = process.env.WEBDAV_USERNAME || "";
    const password = process.env.WEBDAV_PASSWORD || "";
    console.log(path, username, password);
    if (!path || !username || !password) {
      throw Error("WEBDAV_PATH, WEBDAV_USERNAME, WEBDAV_PASSWORD are needed to run AkariSync");
    }
    return new WebDavClient(path, username, password);
  }

  async getDirectoryContents(remotePath: string): Promise<Array<FileStat>> {
    return (await this.currentClient.getDirectoryContents(remotePath)) as Array<FileStat>;
  }

  async createDirectoryIfAbsent(directory: string): Promise<void> {
    const directoryExists = await this.currentClient.exists(directory);
    if (!directoryExists) {
      return await this.currentClient.createDirectory(directory);
    }
  }

  async exists(file: string): Promise<boolean> {
    return await this.currentClient.exists(file);
  }

  async writeFile(originFile: string, targetDirectory: string): Promise<string> {
    console.log(`Writing file ${originFile} into ${targetDirectory}`);
    const filename = path.basename(originFile);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const promise = new Promise((resolve, _reject) => {
      const writeStream = this.currentClient.createWriteStream(`${targetDirectory}/${filename}`);
      writeStream.on("finish", resolve);
      fs.createReadStream(originFile).pipe(writeStream);
    });

    await promise;

    return originFile;
  }

  internalInitialization(path: string, username: string, password: string) {
    this.currentClient = createClient(path, {
      username: username,
      password: password
    });
  }
}
