import { Client } from "discord.js";
import ICustomClient from "../interfaces/ICustomClient";
import { IConfig } from "../interfaces/IConfig";
import { ENV } from "../../config";

export default class CustomClient extends Client implements ICustomClient {
  config: IConfig;

  constructor() {
    super({ intents: [] })
    this.config = { token: ENV.BOT_TOKEN }
  }
  Init(): void {
    this.login(this.config.token)
      .then(() => console.log("Login Success!"))
      .catch((e) => console.error(e))
  }
}
