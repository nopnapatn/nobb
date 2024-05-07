import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js"
import Command from "../../../base/classes/commands"
import CustomClient from "../../../base/classes/custom-client"
import Category from "../../../base/enums/categories"

export default class Ban extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "ban",
      description: "Ban a user from the guild or remove a ban",
      category: Category.Moderation,
      default_member_permissions: PermissionFlagsBits.BanMembers,
      dm_permission: false,
      cooldown: 3,
      dev: false,
      options: [
        {
          name: "add",
          description: "Ban a user from the guild",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "target",
              description: "Select a user to ban",
              type: ApplicationCommandOptionType.User,
              require: true,
            },
            {
              name: "reason",
              description: "Provide a reason for this ban",
              type: ApplicationCommandOptionType.String,
              require: false,
            },
            {
              name: "days",
              description: "Delete the users recent messages",
              type: ApplicationCommandOptionType.String,
              require: false,
              choices: [
                { name: "None", value: "0" },
                { name: "Previous 1 Day", value: "1d" },
                { name: "Previous 7 Days", value: "7d" },
              ],
            },
            {
              name: "silent",
              description: "Don't send a message to the channel",
              type: ApplicationCommandOptionType.Boolean,
              require: false,
            },
          ],
        },
        {
          name: "remove",
          description: "Remove a ban from a user",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "target",
              description: "Enter the users id to unban",
              type: ApplicationCommandOptionType.String,
              require: true,
            },
            {
              name: "reason",
              description: "Provide a reason for this ban",
              type: ApplicationCommandOptionType.String,
              require: false,
            },
            {
              name: "silent",
              description: "Don't send a message to the channel",
              type: ApplicationCommandOptionType.Boolean,
              require: false,
            },
          ],
        },
      ],
    })
  }
}
