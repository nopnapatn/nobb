import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js"
import Command from "../base/classes/command"
import CustomClient from "../base/classes/custom-client"
import Category from "../base/enums/category"

export default class HealthCheck extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "health",
      description: "Command for check health.",
      category: Category.Utilities,
      default_member_permissions:
        PermissionsBitField.Flags.UseApplicationCommands,
      dm_permission: false,
      options: [],
      cooldown: 3,
      dev: false,
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
