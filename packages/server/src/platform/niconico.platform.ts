import tough from "tough-cookie";
import axiosCookieJarSupport from "axios-cookiejar-support";
import axios from "axios";
import { VideoObject } from "../model/videoobject";

axiosCookieJarSupport(axios);
axios.defaults.withCredentials = true;

export class NicoNicoPlatform {
  protected async login() {
    const userName = process.env.NICONICO_USERNAME;
    const password = process.env.NICONICO_PASSWORD;

    const requestURL = "https://account.nicovideo.jp/api/v1/login?site=niconico&next_url=";
    const cookieJar = new tough.CookieJar();
    axios.defaults.jar = cookieJar;
    await axios.post(requestURL, {
      // eslint-disable-next-line @typescript-eslint/camelcase
      mail_tel: userName,
      password
    });

    if (!cookieJar.getCookieStringSync("https://nicovideo.jp").includes("user_session")) {
      throw new Error("invalid credentials");
    }

    return cookieJar;
  }

  getLoginString(): string {
    const userName = process.env.NICONICO_USERNAME;
    const password = process.env.NICONICO_PASSWORD;
    return `-u ${userName} -p ${password}`;
  }

  getDownloadLink(videoObject: VideoObject): string {
    const id = videoObject.link.replace("https://www.nicovideo.jp/watch/", "");
    return `https://www.nicovideo.jp/watch/${id}`;
  }
}
