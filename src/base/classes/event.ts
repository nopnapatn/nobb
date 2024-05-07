import { Events } from "discord.js"
import IEvent from "../interfaces/event"
import IEventOptions from "../interfaces/event-options"
import CustomClient from "./custom-client"

export default class Event implements IEvent {
  client: CustomClient
  name: Events
  description: string
  once: boolean

  constructor(client: CustomClient, options: IEventOptions) {
    this.client = client
    this.name = options.name
    this.description = options.description
    this.once = options.once
  }

  Execute(...args: any): void {}
}
