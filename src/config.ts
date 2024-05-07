import "dotenv/config"
import { z } from "zod"

const envSchema = z.object({
  BOT_TOKEN: z.string(),
  CLIENT_ID: z.string(),
  MONGO_URL: z.string(),

  DEV_USER_ID: z.string(),

  DEV_BOT_TOKEN: z.string(),
  DEV_CLIENT_ID: z.string(),
  DEV_GUILD_ID: z.string(),
  DEV_MONGO_URL: z.string(),
})

export const ENV = envSchema.parse(process.env)
