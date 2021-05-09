import fs from "fs";
import { resolve } from "path";

export function createLocalDirectoryIfAbsent(tempPath: string) {
  const folder = resolve(tempPath, "videos");
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
  return folder;
}
