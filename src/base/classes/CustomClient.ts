import { Client } from "discord.js";
import ICustomClient from "../interfaces/ICustomClient";
import { IConfig } from "../interfaces/IConfig";
import { ENV } from "../../config";
import Handler from "./Handler";

export default class CustomClient extends Client implements ICustomClient {
  config: IConfig
  handler: Handler

  constructor() {
    super({ intents: [] })

    this.config = { token: ENV.BOT_TOKEN }
    this.handler = new Handler(this);
  }

  Init(): void {
    this.LoadHanders();
    this.login(this.config.token)
      .catch((e) => console.error(e))
  }

  LoadHanders(): void {
    this.handler.LoadEvents()
  }
}
