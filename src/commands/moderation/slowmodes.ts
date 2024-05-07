import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  TextChannel,
} from "discord.js"
import Command from "../../base/classes/commands"
import CustomClient from "../../base/classes/custom-client"
import Category from "../../base/enums/categories"
import GuildConfig from "../../base/schema/guild-config"

export default class Slowmode extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "slowmode",
      description: "Set the slowmode for a channel",
      category: Category.Moderation,
      default_member_permissions: PermissionFlagsBits.ManageChannels,
      dm_permission: false,
      options: [
        {
          name: "rate",
          description: "Select the slowmode massage rate",
          type: ApplicationCommandOptionType.Integer,
          require: true,
          choices: [
            { name: "None", value: "0" },
            { name: "5 Seconds", value: "5" },
            { name: "10 Seconds", value: "10" },
            { name: "15 Seconds", value: "15" },
            { name: "30 Seconds", value: "30" },
          ],
        },
        {
          name: "reason",
          description:
            "Select a channel to set the slowmode in - Default current channel",
          type: ApplicationCommandOptionType.Channel,
          require: false,
        },
        {
          name: "silent",
          description: "Do not send a message to the channel",
          type: ApplicationCommandOptionType.Boolean,
          require: false,
        },
      ],
      cooldown: 0,
      dev: false,
    })
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const messageRate = interaction.options.getInteger("rate")!
    const channel = (interaction.options.getChannel("channel") ||
      interaction.channel) as TextChannel
    const reason =
      interaction.options.getString("reason") || "No reason provided"
    const silent = interaction.options.getBoolean("silent") || false

    const errorEmbed = new EmbedBuilder().setColor("Red")

    if (messageRate < 0 || messageRate > 21600)
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(
            "❌ You can only set the slowmode between 0 and 6 hours (21600 seconds)!",
          ),
        ],
        ephemeral: true,
      })

    try {
      channel.setRateLimitPerUser(messageRate, reason)
    } catch {
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(
            "❌ An error occured while trying to set the slowmode!",
          ),
        ],
        ephemeral: true,
      })
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setDescription(`⏳ Slowmode set to \`${messageRate}\` seconds!`),
      ],
      ephemeral: true,
    })

    if (!silent)
      channel
        ?.send({
          embeds: [
            new EmbedBuilder()
              .setColor("Green")
              .setAuthor({ name: `⏳ Slowmode | ${channel.name}` })
              .setDescription(`**Slowmode:** \`${messageRate}\` seconds`)
              .setTimestamp()
              .setFooter({ text: `Channel Id: ${channel.id}` }),
          ],
        })
        .then(async (msg) => await msg.react("⏳"))

    const guild = await GuildConfig.findOne({ guildId: interaction?.guildId })

    if (
      guild &&
      guild?.logs?.moderation?.enabled &&
      guild?.logs?.moderation?.channelId
    )
      (
        (await interaction.guild?.channels.fetch(
          guild.logs.moderation.channelId,
        )) as TextChannel
      )?.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setAuthor({ name: `⏳ Slowmode` })
            .setDescription(
              `
                **Channel:** ${channel}
                **Slowmode:** \`${messageRate}\` seconds
            `,
            )
            .setTimestamp()
            .setFooter({
              text: `Actioned by ${interaction.user.tag} | ${interaction.user.id}`,
              iconURL: interaction.user.displayAvatarURL(),
            }),
        ],
      })
  }
}
