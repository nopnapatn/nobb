import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js"
import Command from "../base/classes/Command"
import CustomClient from "../base/classes/CustomClient"
import Category from "../base/enums/Category"

export default class HealthCheck extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "health",
      description: "Command for check health.",
      category: Category.Utilities,
      default_member_permissions:
        PermissionsBitField.Flags.UseApplicationCommands,
      dm_permission: false,
      cooldown: 3,
      options: [],
    })
  }

  Execute(interaction: ChatInputCommandInteraction) {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setDescription("✅ Health check has been good!"),
      ],
      ephemeral: true,
    })
  }
}
