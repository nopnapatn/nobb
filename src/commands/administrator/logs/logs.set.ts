import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  TextChannel,
} from "discord.js"
import CustomClient from "../../../base/classes/custom-client"
import SubCommand from "../../../base/classes/sub-command"
import GuildConfig from "../../../base/schema/guild-config"

export default class LogsSet extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "logs.set",
    })
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const logType = interaction.options.getString("log-type")
    const channel = interaction.options.getChannel("channel") as TextChannel

    await interaction.deferReply({ ephemeral: true })

    try {
      let guild = await GuildConfig.findOne({ guildId: interaction.guildId })

      if (!guild)
        guild = await GuildConfig.create({ guildId: interaction.guildId })

      //@ts-ignore
      guild.logs[`${logType}`].channelId = channel.id

      await guild.save()

      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setDescription(
              `✅ Updated \`${logType}\` logs to send to ${channel}`,
            ),
        ],
      })
    } catch (e) {
      console.error(e)
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "❌ There was an error while updating the database, please try again!",
            ),
        ],
      })
    }
  }
}
