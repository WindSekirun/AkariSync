import fs from "fs";
import { AuthType, createClient, WebDAVClient } from "webdav";

export class WebDavClient {
  currentClient: WebDAVClient;

  constructor() {
    this.currentClient = createClient(process.env.WEBDAV_PATH, {
      authType: AuthType.Digest,
      username: process.env.WEBDAV_USERNAME,
      password: process.env.WEBDAV_PASSWORD
    });
  }

  async getDirectoryContents(remotePath: string) {
    return await this.currentClient.getDirectoryContents(remotePath);
  }

  async createDirectory(directory: string) {
    return await this.currentClient.createDirectory(directory);
  }

  async exists(file: string): Promise<boolean> {
    return await this.currentClient.exists(file);
  }

  async writeFile(origin: string, target: string): Promise<string> {
    const read = fs.createReadStream(origin);
    const write = this.currentClient.createWriteStream(target);
    read.pipe(write);

    return new Promise((resolve, reject) => {
      write.on("end", () => resolve(target));
      read.on("error", reject);
    });
  }
}
