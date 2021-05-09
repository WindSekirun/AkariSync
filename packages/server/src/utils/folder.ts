import fs from "fs";
import { resolve } from "path";

export function createLocalDirectoryIfAbsent(tempPath: string, id: string) {
  const idFolder = resolve(tempPath, "videos", id);
  if (!fs.existsSync(idFolder)) {
    fs.mkdirSync(idFolder, { recursive: true });
  }
  return resolve("videos", id);
}
