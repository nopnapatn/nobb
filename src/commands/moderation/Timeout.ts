import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js"
import Command from "../../base/classes/Command"
import CustomClient from "../../base/classes/CustomClient"
import Category from "../../base/enums/Category"

export default class Timeout extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "timeout",
      description: "Manage timeouts",
      category: Category.Moderation,
      default_member_permissions: PermissionFlagsBits.MuteMembers,
      dm_permission: false,
      options: [
        {
          name: "add",
          description: "Add a timeout to a user",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "target",
              description: "Select a member to timeout",
              type: ApplicationCommandOptionType.User,
              require: true,
            },
            {
              name: "length",
              description: "Length to the timeout",
              type: ApplicationCommandOptionType.String,
              require: false,
              choices: [
                { name: "5 Minutes", value: "5m" },
                { name: "10 Minutes", value: "10m" },
                { name: "15 Minutes", value: "15m" },
                { name: "30 Minutes", value: "30m" },
                { name: "1 Hour", value: "1h" },
                { name: "2 Hours", value: "2h" },
                { name: "6 Hours", value: "6h" },
                { name: "12 Hours", value: "12h" },
                { name: "1 Day", value: "1d" },
                { name: "3 Days", value: "3d" },
                { name: "1 Week", value: "1w" },
                { name: "2 Weeks", value: "2w" },
                { name: "1 Month", value: "4w" },
              ],
            },
            {
              name: "reason",
              description: "Reason fot timing out this user",
              type: ApplicationCommandOptionType.String,
              require: false,
            },
            {
              name: "silent",
              description: "Do not send a message to the channel",
              type: ApplicationCommandOptionType.Boolean,
              require: false,
            },
          ],
        },
        {
          name: "remove",
          description: "Remove a timeout to a user",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "target",
              description: "Select a member to timeout",
              type: ApplicationCommandOptionType.User,
              require: true,
            },
            {
              name: "reason",
              description: "Reason fot untiming out this user",
              type: ApplicationCommandOptionType.String,
              require: false,
            },
            {
              name: "silent",
              description: "Do not send a message to the channel",
              type: ApplicationCommandOptionType.Boolean,
              require: false,
            },
          ],
        },
      ],
      cooldown: 3,
      dev: false,
    })
  }
}
