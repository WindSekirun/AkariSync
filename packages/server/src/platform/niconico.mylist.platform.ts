import { VideoObject } from "src/model/videoobject";
import { SyncData } from "src/schema/syncdata.schema";
import { Platform } from "./platform";
import axiosCookieJarSupport from "axios-cookiejar-support";
import tough from "tough-cookie";
import axios from "axios";
import { handleRss } from "src/utils/rss";
import { makeFolder } from "src/utils/folder";

axiosCookieJarSupport(axios);
axios.defaults.withCredentials = true;

export class NicoNicoMyListPlatform implements Platform {
  platformType = "niconico_mylist";

  async getList(syncData: SyncData): Promise<VideoObject[]> {
    await this.login();
    makeFolder(syncData.remote);

    return await handleRss(
      `https://www.nicovideo.jp/mylist/${syncData.remote}?rss=2.0`
    );
  }

  private async login() {
    const userName = process.env.NICONICO_USERNAME;
    const password = process.env.NICONICO_PASSWORD;
    console.log(userName, password);

    const requestURL =
      "https://account.nicovideo.jp/api/v1/login?site=niconico&next_url=";
    const cookieJar = new tough.CookieJar();
    axios.defaults.jar = cookieJar;
    await axios.post(requestURL, {
      // eslint-disable-next-line @typescript-eslint/camelcase
      mail_tel: userName,
      password
    });

    if (
      !cookieJar
        .getCookieStringSync("https://nicovideo.jp")
        .includes("user_session")
    ) {
      throw new Error("invalid credentials");
    }
  }
}
