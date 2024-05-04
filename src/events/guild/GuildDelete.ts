import { Events, Guild } from "discord.js"
import CustomClient from "../../base/classes/CustomClient"
import Event from "../../base/classes/Event"
import GuildConfig from "../../base/schema/GuildConfig"

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
