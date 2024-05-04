import {
  ChatInputCommandInteraction,
  Collection,
  EmbedBuilder,
  Events,
} from "discord.js"
import Command from "../../base/classes/Command"
import CustomClient from "../../base/classes/CustomClient"
import Event from "../../base/classes/Event"

export default class CommandHandler extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.InteractionCreate,
      description: "Command handler event",
      once: false,
    })
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.isChatInputCommand()) return

    const command: Command = this.client.commands.get(interaction.commandName)!
    const { cooldowns } = this.client

    //@ts-ignore
    if (!command)
      return (
        (await interaction.reply({
          content: "This command does not exist!",
          ephemeral: true,
        })) && this.client.commands.delete(interaction.commandName)
      )

    if (
      command.dev &&
      !this.client.config.developerUserId.includes(interaction.user.id)
    )
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`❌ This command is only availble to developers.`),
        ],
      })

    if (!cooldowns.has(command.name))
      cooldowns.set(command.name, new Collection())

    const now = Date.now()
    const timestamps = cooldowns.get(command.name)!
    const cooldownAmout = (command.cooldown || 3) * 1000

    if (
      timestamps.has(interaction.user.id) &&
      now < (timestamps.get(interaction.user.id) || 0) + cooldownAmout
    )
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `❌ Please wait another \`${(
                ((timestamps.get(interaction.user.id) || 0) +
                  cooldownAmout -
                  now) /
                1000
              ).toFixed(1)}\` seconds to run this command!`,
            ),
        ],
        ephemeral: true,
      })

    timestamps.set(interaction.user.id, now)
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmout)

    try {
      const subCommandGroup = interaction.options.getSubcommandGroup(false)
      const subCommand = `${interaction.commandName}${
        subCommandGroup ? `.${subCommandGroup}` : ""
      }.${interaction.options.getSubcommand(false) || ""}`

      return (
        this.client.subCommands.get(subCommand)?.Execute(interaction) ||
        command.Execute(interaction)
      )
    } catch (e) {
      console.log(e)
    }
  }
}
