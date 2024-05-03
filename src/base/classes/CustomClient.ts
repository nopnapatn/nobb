import { Client, Collection } from "discord.js"
import { ENV } from "../../config"
import { IConfig } from "../interfaces/IConfig"
import ICustomClient from "../interfaces/ICustomClient"
import Command from "./Command"
import Handler from "./Handler"
import SubCommand from "./SubCommand"

export default class CustomClient extends Client implements ICustomClient {
  config: IConfig
  handler: Handler
  commands: Collection<string, Command>
  subCommands: Collection<string, SubCommand>
  cooldowns: Collection<string, Collection<string, number>>

  constructor() {
    super({ intents: [] })

    this.config = {
      token: ENV.BOT_TOKEN,
      clientId: ENV.CLIENT_ID,
      guildId: ENV.GUILD_ID,
    }
    this.handler = new Handler(this)
    this.commands = new Collection()
    this.subCommands = new Collection()
    this.cooldowns = new Collection()
  }

  Init(): void {
    this.LoadHanders()
    this.login(this.config.token).catch((e) => console.error(e))
  }

  LoadHanders(): void {
    this.handler.LoadEvents()
    this.handler.LoadCommands()
  }
}
