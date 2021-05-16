import axios from "axios";

export class TelegramNotifyExecutor {
  botToken: string;
  userId: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN;
    this.userId = process.env.TELEGRAM_USER_ID;
  }

  async sendMessage(message: string) {
    if (!this.botToken || !this.userId) return;
    const encoded = encodeURI(message);
    const requestURL = `https://api.telegram.org/bot${this.botToken}/sendMessage?chat_id=${this.userId}&text=${encoded}`;
    return await axios.get(requestURL);
  }
}
