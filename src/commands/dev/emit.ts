import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Events,
  Guild,
  PermissionsBitField,
} from "discord.js"
import Command from "../../base/classes/command"
import CustomClient from "../../base/classes/custom-client"
import Category from "../../base/enums/category"

export default class Emit extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "emit",
      description: "Emit an event",
      category: Category.Developer,
      options: [
        {
          name: "event",
          description: "The event to emit",
          require: true,
          type: ApplicationCommandOptionType.String,
          choices: [
            { name: "GuildCreate", value: Events.GuildCreate },
            { name: "GuildDelete", value: Events.GuildDelete },
          ],
        },
      ],
      default_member_permissions: PermissionsBitField.Flags.Administrator,
      dm_permission: false,
      cooldown: 1,
      dev: true,
    })
  }

  Execute(interaction: ChatInputCommandInteraction) {
    const event = interaction.options.getString("event")

    if (event == Events.GuildCreate || event == Events.GuildDelete) {
      this.client.emit(event, interaction.guild as Guild)
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setDescription(`Emitted event - \`${event}\``),
      ],
      ephemeral: true,
    })
  }
}
