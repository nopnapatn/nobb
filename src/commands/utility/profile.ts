import { profileImage } from "discord-arts"
import {
  ApplicationCommandOptionType,
  AttachmentBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  PermissionsBitField,
} from "discord.js"
import Command from "../../base/classes/Command"
import CustomClient from "../../base/classes/CustomClient"
import Category from "../../base/enums/Category"

export default class Profile extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "profile",
      description: "Get a users profile",
      category: Category.Utilities,
      options: [
        {
          name: "target",
          description: "Select a user",
          type: ApplicationCommandOptionType.User,
          require: false,
        },
      ],
      default_member_permissions:
        PermissionsBitField.Flags.UseApplicationCommands,
      dm_permission: false,
      cooldown: 0,
      dev: false,
    })
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const target = (interaction.options.getMember("target") ||
      interaction.member) as GuildMember
    await interaction.deferReply({ ephemeral: true })

    const buffer = await profileImage(target.id, {
      badgesFrame: true,
      removeAvatarFrame: false,
      presenceStatus: target.presence?.status,
    })

    const attachment = new AttachmentBuilder(buffer).setName(
      `${target.user.username}_profile.png`,
    )

    const color = (await target.user.fetch()).accentColor

    interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(color ?? "Green")
          .setDescription(`Profile for ${target}`)
          .setImage(`attachment://${target.user.username}_profile.png`),
      ],
      files: [attachment],
    })
  }
}
