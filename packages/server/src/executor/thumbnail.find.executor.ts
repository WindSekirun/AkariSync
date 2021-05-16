import { findPlatform } from "src/platform/platform";

export class ThumbnailFindExecutor {
  async find(targetId: string, platformString: string): Promise<string> {
    const platform = findPlatform(platformString);
    return await platform.getThumbnail(targetId);
  }
}
