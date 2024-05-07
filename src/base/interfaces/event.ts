import { Events } from "discord.js"
import CustomClient from "../classes/custom-client"

export default interface IEvent {
  client: CustomClient
  name: Events
  description: string
  once: boolean
}
