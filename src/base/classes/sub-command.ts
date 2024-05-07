import { CacheType, ChatInputCommandInteraction } from "discord.js"
import ISubCommand from "../interfaces/sub-command"
import ISubCommandOptions from "../interfaces/sub-command-options"
import CustomClient from "./custom-client"

export default class SubCommand implements ISubCommand {
  client: CustomClient
  name: string

  constructor(client: CustomClient, options: ISubCommandOptions) {
    this.client = client
    this.name = options.name
  }

  Execute(interaction: ChatInputCommandInteraction<CacheType>): void {}
}
