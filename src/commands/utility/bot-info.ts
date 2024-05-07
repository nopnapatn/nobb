import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js"
import ms from "ms"
import os from "os"
import Command from "../../base/classes/Command"
import CustomClient from "../../base/classes/CustomClient"
import Category from "../../base/enums/Category"

const { version, dependencies } = require(`${process.cwd()}/package.json`)

export default class BotInfo extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "botinfo",
      description: "Get a bots info",
      category: Category.Utilities,
      options: [],
      default_member_permissions:
        PermissionsBitField.Flags.UseApplicationCommands,
      dm_permission: false,
      cooldown: 0,
      dev: false,
    })
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Random")
          .setThumbnail(this.client.user?.displayAvatarURL()!).setDescription(`
            __**Bot Info**__
            > **User:** \`${this.client.user?.tag}\` - \`${
          this.client.user?.id
        }\`
            > **Account Created:** <t:${(
              this.client.user!.createdTimestamp / 1000
            ).toFixed(0)}:R>
            > **Commands:** \`${this.client.commands.size}\`
            > **DJS Version:** \`${version}\`
            > **Dependencies (${
              Object.keys(dependencies).length
            }):** \`${Object.keys(dependencies)
          .map((p) => `${p}@${dependencies[p]}`.replace(/\^/g, ""))
          .join(", ")}\`
            > **Uptime:** \`${ms(this.client.uptime!, { long: false })}\`


            __**Guild Info**__
            > **Total Guilds:** \`${(await this.client.guilds.fetch()).size}\`

            __**System Info**__
            > ** Operating System:** \`${process.platform}\`
            > **CPU:** \`${os.cpus()[0].model.trim()}\`
            > **Ram Usage:** \`${this.formatBtyes(
              process.memoryUsage().heapUsed,
            )}\`/\`${this.formatBtyes(os.totalmem())}\`

            __**Development Team**__
            > **Creator/Oweners:** \`nopnapatn\`
        `),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setLabel("Invite me!")
            .setStyle(ButtonStyle.Link)
            .setURL(
              "https://discord.com/oauth2/authorize?client_id=1235968696661311570&permissions=8&scope=bot+applications.commands",
            ),
          new ButtonBuilder()
            .setLabel("Support Server!")
            .setStyle(ButtonStyle.Link)
            .setURL("https://nopnapatn.dev/"),
          new ButtonBuilder()
            .setLabel("Website!")
            .setStyle(ButtonStyle.Link)
            .setURL("https://nopnapatn.dev/"),
        ),
      ],
    })
  }

  private formatBtyes(bytes: number) {
    if (bytes == 0) return "0"

    const sizes = ["Btyes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`
  }
}
