import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  BOT_TOKEN: z.string(),
})

export const ENV = envSchema.parse(process.env)
