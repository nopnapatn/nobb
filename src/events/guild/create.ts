import { EmbedBuilder, Events, Guild } from "discord.js"
import CustomClient from "../../base/classes/custom-client"
import Event from "../../base/classes/event"
import GuildConfig from "../../base/schema/guild-config"

export default class GuildCreate extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.GuildCreate,
      description: "Guild join event",
      once: false,
    })
  }

  async Execute(guild: Guild) {
    try {
      if (!(await GuildConfig.exists({ guildId: guild.id })))
        await GuildConfig.create({ guildId: guild.id })
    } catch (e) {
      console.error(e)
    }

    const owner = await guild.fetchOwner()
    owner
      ?.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setDescription(`Hey! Thanks for inviting me to your server!`),
        ],
      })
      .catch()
  }
}
