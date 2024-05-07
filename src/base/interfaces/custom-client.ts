import { Collection } from "discord.js"
import Command from "../classes/command"
import SubCommand from "../classes/sub-command"
import { IConfig } from "./config"

export default interface ICustomClient {
  config: IConfig
  commands: Collection<string, Command>
  subCommands: Collection<string, SubCommand>
  cooldowns: Collection<string, Collection<string, number>>
  developmentMode: boolean

  Init(): void
  LoadHanders(): void
}
