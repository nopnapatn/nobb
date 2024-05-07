import {
  ApplicationCommandOptionType,
  ChannelType,
  PermissionFlagsBits,
} from "discord.js"
import Command from "../../../base/classes/command"
import CustomClient from "../../../base/classes/custom-client"
import Category from "../../../base/enums/category"

export default class Logs extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "logs",
      description: "Configure the logs for server",
      category: Category.Administrator,
      options: [
        {
          name: "toggle",
          description: "Toggle the logs for server",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "log-type",
              description: "Type of log to toggle",
              type: ApplicationCommandOptionType.String,
              require: true,
              choices: [{ name: "Moderation Logs", value: "moderation" }],
            },
            {
              name: "toggle",
              description: "Toggle the log",
              type: ApplicationCommandOptionType.Boolean,
              require: true,
            },
          ],
        },
        {
          name: "set",
          description: "Set the logs for server",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "log-type",
              description: "Type of log to set",
              type: ApplicationCommandOptionType.String,
              require: true,
              choices: [{ name: "Moderation Logs", value: "moderation" }],
            },
            {
              name: "channel",
              description: "Channel to set the log",
              type: ApplicationCommandOptionType.Channel,
              require: true,
              channel_types: [ChannelType.GuildText],
            },
          ],
        },
      ],
      default_member_permissions: PermissionFlagsBits.Administrator,
      dm_permission: false,
      cooldown: 3,
      dev: false,
    })
  }
}
