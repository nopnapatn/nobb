import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
} from "discord.js"
import CustomClient from "../classes/custom-client"
import Category from "../enums/category"

export default interface ICommand {
  client: CustomClient
  name: string
  description: string
  category: Category
  options: object
  default_member_permissions: bigint
  dm_permission: boolean
  cooldown: number
  dev: boolean

  Execute(interaction: ChatInputCommandInteraction): void
  AutoComplete(interaction: AutocompleteInteraction): void
}
