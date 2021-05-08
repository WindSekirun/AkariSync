import fs from "fs";

export function makeFolder(id: string) {
  if (!fs.existsSync(`./videos/`)) {
    fs.mkdirSync(`videos/`);
  }

  if (!fs.existsSync(`./videos/${id}`)) {
    fs.mkdirSync(`videos/${id}`);
  }
}
