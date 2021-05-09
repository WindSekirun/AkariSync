import fs from "fs";
import path from "path";
import { createClient, FileStat, WebDAVClient } from "webdav";

export class WebDavClient {
  currentClient: WebDAVClient;

  constructor() {
    this.currentClient = createClient(process.env.WEBDAV_PATH, {
      username: process.env.WEBDAV_USERNAME,
      password: process.env.WEBDAV_PASSWORD
    });
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
}
