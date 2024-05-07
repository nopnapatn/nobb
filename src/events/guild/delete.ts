import { Events, Guild } from "discord.js"
import CustomClient from "../../base/classes/custom-client"
import Event from "../../base/classes/event"
import GuildConfig from "../../base/schema/guild-config"

export default class GuildDelete extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.GuildDelete,
      description: "Guild leave event",
      once: false,
    })
  }

  async Execute(guild: Guild) {
    try {
      await GuildConfig.deleteOne({ guildId: guild.id })
    } catch (e) {
      console.error(e)
    }
  }
}
