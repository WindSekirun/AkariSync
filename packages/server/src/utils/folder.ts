import fs from "fs";

export function makeFolder(tempPath: string, id: string) {
  if (!fs.existsSync(`${tempPath}/videos/`)) {
    fs.mkdirSync(`${tempPath}/videos/`);
  }

  if (!fs.existsSync(`${tempPath}/videos/${id}`)) {
    fs.mkdirSync(`${tempPath}/videos/${id}`);
  }
}
