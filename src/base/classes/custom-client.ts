import { Client, Collection, GatewayIntentBits } from "discord.js"
import { connect } from "mongoose"
import { ENV } from "../../config"
import { IConfig } from "../interfaces/config"
import ICustomClient from "../interfaces/custom-client"
import Command from "./command"
import Handler from "./handlers"
import SubCommand from "./sub-command"

export default class CustomClient extends Client implements ICustomClient {
  config: IConfig
  handler: Handler
  commands: Collection<string, Command>
  subCommands: Collection<string, SubCommand>
  cooldowns: Collection<string, Collection<string, number>>
  developmentMode: boolean

  constructor() {
    super({ intents: [GatewayIntentBits.Guilds] })

    this.config = {
      token: ENV.BOT_TOKEN,
      clientId: ENV.CLIENT_ID,
      mongoUrl: ENV.MONGO_URL,
      developerUserId: ENV.DEV_USER_ID.split(", "),
      devToken: ENV.DEV_BOT_TOKEN,
      devClientId: ENV.DEV_CLIENT_ID,
      devGuildId: ENV.DEV_GUILD_ID,
      devMongoUrl: ENV.DEV_MONGO_URL,
    }
    this.handler = new Handler(this)
    this.commands = new Collection()
    this.subCommands = new Collection()
    this.cooldowns = new Collection()
    this.developmentMode = process.argv.slice(2).includes("--development")
  }

  Init(): void {
    console.log(
      "🚀 ~ Start mode with:",
      `${this.developmentMode ? "development" : "production"}`,
    )

    this.LoadHanders()
    this.login(
      this.developmentMode ? this.config.devToken : this.config.token,
    ).catch((e) => console.error(e))

    connect(
      this.developmentMode ? this.config.devMongoUrl : this.config.mongoUrl,
    )
      .then(() => console.log("🚀 ~ Successfully connected to MongoDB."))
      .catch((e) => console.error(e))
  }

  LoadHanders(): void {
    this.handler.LoadEvents()
    this.handler.LoadCommands()
  }
}
