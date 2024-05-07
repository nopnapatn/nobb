import {
  ApplicationCommandOptionType,
  ChannelType,
  ChatInputCommandInteraction,
  Collection,
  EmbedBuilder,
  GuildMember,
  Message,
  PermissionFlagsBits,
  TextChannel,
} from "discord.js"
import Command from "../../base/classes/commands"
import CustomClient from "../../base/classes/custom-client"
import Category from "../../base/enums/categories"
import GuildConfig from "../../base/schema/guild-config"

export default class Clear extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "clear",
      description: "Clear channel or message from a user",
      category: Category.Moderation,
      default_member_permissions: PermissionFlagsBits.ManageMessages,
      dm_permission: false,
      options: [
        {
          name: "amount",
          description: "Select an amount of message to delete - Limit: 100",
          type: ApplicationCommandOptionType.Integer,
          require: true,
        },
        {
          name: "target",
          description:
            "Select a user to delete message from - Default all users",
          type: ApplicationCommandOptionType.User,
          require: false,
        },
        {
          name: "channel",
          description:
            "Select a channel to delete from - Default current channel",
          type: ApplicationCommandOptionType.Channel,
          require: false,
          channel_type: [ChannelType.GuildText],
        },
        {
          name: "silent",
          description: "Do not send a message to the channel",
          type: ApplicationCommandOptionType.Boolean,
          require: false,
        },
      ],
      cooldown: 3,
      dev: false,
    })
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    let amount = interaction.options.getInteger("amount")!

    const channel = (interaction.options.getChannel("channel") ||
      interaction.channel) as TextChannel
    const target = interaction.options.getMember("target") as GuildMember
    const silent = interaction.options.getBoolean("silent") || false

    const errorEmbed = new EmbedBuilder().setColor("Red")

    if (amount < 1 || amount > 100)
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(
            "❌ You can only delete between 1 and 100 messages at a time!",
          ),
        ],
        ephemeral: true,
      })

    const messages: Collection<
      string,
      Message<true>
    > = await channel.messages.fetch({ limit: 100 })

    var filterMessages = target
      ? messages.filter((m) => m.author.id === target.id)
      : messages
    let deleted = 0

    try {
      deleted = (
        await channel.bulkDelete(
          Array.from(filterMessages.keys()).slice(0, amount),
          true,
        )
      ).size
    } catch {
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(
            "❌ An error occures while trying to delete messages!",
          ),
        ],
        ephemeral: true,
      })
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Orange")
          .setDescription(
            `🛀🏻 **DELETE** \`${deleted}\` messages ${
              target ? ` form ${target}` : ""
            } in ${channel}`,
          ),
      ],
      ephemeral: true,
    })

    if (!silent)
      channel
        .send({
          embeds: [
            new EmbedBuilder()
              .setColor("Orange")
              .setAuthor({ name: `🛀🏻 Clear | ${channel.name}` })
              .setDescription(`**Deleted:** \`${deleted}\` messages`)
              .setTimestamp()
              .setFooter({
                text: `Messages: ${target ? target.user.tag : "All"} messages`,
              }),
          ],
        })
        .then(async (msg) => await msg.react("🛀🏻"))

    const guild = await GuildConfig.findOne({ guildId: interaction.guild })

    if (
      guild &&
      guild?.logs?.moderation?.enabled &&
      guild?.logs?.moderation?.channelId
    )
      (
        (await interaction.guild?.channels.fetch(
          guild?.logs?.moderation?.channelId,
        )) as TextChannel
      )?.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Orange")
            .setThumbnail(interaction.user.displayAvatarURL())
            .setAuthor({ name: `🛀🏻 Clear` })
            .setDescription(
              `
                    **Channel:** ${channel} - \`${channel.id}\`
                    **Messages:** ${target ? target : "All"}
                    **Amount:** \`${deleted}\`
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
