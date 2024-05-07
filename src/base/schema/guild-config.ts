import { Schema, model } from "mongoose"

interface IGuildConfig {
  guildId: string
  logs: {
    moderation: {
      channelId: string
      enabled: boolean
    }
  }
}

export default model<IGuildConfig>(
  "GuildConfig",
  new Schema<IGuildConfig>(
    {
      guildId: String,
      logs: {
        moderation: {
          channelId: String,
          enabled: Boolean,
        },
      },
    },
    {
      timestamps: true,
    },
  ),
)
