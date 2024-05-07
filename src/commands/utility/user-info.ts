import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  PermissionFlagsBits,
  PermissionsBitField,
} from "discord.js"
import Command from "../../base/classes/commands"
import CustomClient from "../../base/classes/custom-client"
import Category from "../../base/enums/categories"

export default class UserInfo extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "userinfo",
      description: "Get a users info",
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

    const fetchedMember = await target.fetch()

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(fetchedMember.user.accentColor || "Green")
          .setAuthor({
            name: `${fetchedMember.user.tag} profile`,
            iconURL: fetchedMember.displayAvatarURL(),
          }).setDescription(`
                __**User Info**__
                > **Id:** \`${fetchedMember.id}\`
                > **Bot:** ${fetchedMember.user.bot ? "Yes" : "No"}
                > **Account Created:** 🗓️ <t:${(
                  fetchedMember.user.createdTimestamp / 1000
                ).toFixed(0)}:D>

                __**Member Info**__               
                > **Nickname:** \`${
                  fetchedMember.nickname || fetchedMember.user.username
                }\`
                > **Roles (${fetchedMember.roles.cache.size - 1}):** ${
          fetchedMember.roles.cache
            .map((r) => r)
            .join(", ")
            .replace("@everyone", "") || "None"
        }
                > **Admin:** \`${fetchedMember.permissions.has(
                  PermissionFlagsBits.Administrator,
                )}\`
                > **Joined:** 🗓️ <t:${(
                  fetchedMember.joinedTimestamp! / 1000
                ).toFixed(0)}:D>
                > **Joined Position:** \`#${
                  this.GetJoinPosition(interaction, fetchedMember)! + 1
                } / #${interaction.guild?.memberCount}\`
            `),
      ],
    })
  }

  GetJoinPosition(
    interaction: ChatInputCommandInteraction,
    target: GuildMember,
  ) {
    let pos = null
    const joinPosition = interaction.guild?.members.cache.sort(
      (a, b) => a.joinedTimestamp! - b.joinedTimestamp!,
    )!

    Array.from(joinPosition).find((member, index) => {
      if (member[0] == target.user.id) pos = index
    })

    return pos
  }
}
