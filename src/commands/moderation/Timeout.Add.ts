import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  GuildMemberRoleManager,
  TextChannel,
} from "discord.js"
import ms from "ms"
import CustomClient from "../../base/classes/CustomClient"
import SubCommand from "../../base/classes/SubCommand"
import GuildConfig from "../../base/schema/GuildConfig"

export default class TimeoutAdd extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "timeout.add",
    })
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getMember("target") as GuildMember
    const length = interaction.options.getString("length") || "5m"
    const reason = interaction.options.getString("reason") || "No reason given"
    const silent = interaction.options.getBoolean("silent") || false
    const msLength = ms(length)

    const errorEmbed = new EmbedBuilder().setColor("Red")

    if (!target)
      return interaction.reply({
        embeds: [errorEmbed.setDescription(`❌ Please provide a valid user!`)],
        ephemeral: true,
      })
    if (target.id == interaction.user.id)
      return interaction.reply({
        embeds: [errorEmbed.setDescription(`❌ You cannot timeout yourself!`)],
        ephemeral: true,
      })
    if (
      target.roles.highest.position >=
      (interaction.member?.roles as GuildMemberRoleManager).highest.position
    )
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(
            `❌ You cannot timeout a user with equal or higher roles!`,
          ),
        ],
        ephemeral: true,
      })
    if (
      target.communicationDisabledUntil != null &&
      target.communicationDisabledUntil > new Date()
    )
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(
            `❌ ${target} is already timed out util \`${target.communicationDisabledUntil.toLocaleString()}\``,
          ),
        ],
        ephemeral: true,
      })
    if (reason.length > 512)
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(
            `❌ The reason length cannot be greater than 512 characters!`,
          ),
        ],
        ephemeral: true,
      })

    try {
      await target.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setDescription(
              `
                ⌛️ You were **TIME OUT** in \`${interaction.guild?.name}\` by ${interaction.member} for \`${length}\`
                If you would like to appeal, send a message to the moderator who timed you out.

                **Reason:** \`${reason}\`
            `,
            )
            .setImage(interaction.guild?.iconURL()!),
        ],
      })
    } catch {}

    try {
      await target.timeout(msLength, reason)
    } catch {
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(
            `❌ An error occured while trying to timeout this user, please try again!`,
          ),
        ],
        ephemeral: true,
      })
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription(
            `⌛️ Time out ${target} - \`${target.id}\` for \`${length}\``,
          ),
      ],
      ephemeral: true,
    })

    if (!silent)
      interaction.channel
        ?.send({
          embeds: [
            new EmbedBuilder()
              .setColor("Blue")
              .setAuthor({ name: `️⌛️ Timeout | ${target.user.tag}` })
              .setThumbnail(target.user.displayAvatarURL({ size: 64 }))
              .setDescription(
                `
                **Reason:** \`${reason}\`
                **Expires:** <t:${((Date.now() + msLength) / 1000).toFixed(
                  0,
                )}:F>
                `,
              ),
          ],
        })
        .then(async (msg) => await msg.react("⏳"))

    const guild = await GuildConfig.findOne({ guildId: interaction.guildId })

    if (
      guild &&
      guild.logs?.moderation?.enabled &&
      guild.logs?.moderation.channelId
    )
      (
        (await interaction.guild?.channels.fetch(
          guild.logs.moderation.channelId,
        )) as TextChannel
      )?.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setAuthor({ name: "⌛️ Timeout" })
            .setThumbnail(target.user.displayAvatarURL({ size: 64 }))
            .setDescription(
              `
                          **User:** ${target} - \`${target.id}\`
                          **Reason:** \`${reason}\`
                          **Length:** \`${length}\`
                          **Expires:** <t:${(
                            (Date.now() + msLength) /
                            1000
                          ).toFixed(0)}:F> 
                      `,
            )
            .setTimestamp()
            .setFooter({
              text: `Actioned by ${interaction.user.tag} | ${interaction.user.id}`,
              iconURL: interaction.user.displayAvatarURL({}),
            }),
        ],
      })
  }
}
