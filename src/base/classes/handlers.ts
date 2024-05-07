import { glob } from "glob"
import path from "path"
import IHandler from "../interfaces/handler"
import Command from "./command"
import CustomClient from "./custom-client"
import Event from "./event"

export default class Handler implements IHandler {
  client: CustomClient

  constructor(client: CustomClient) {
    this.client = client
  }

  async LoadEvents() {
    const files = (await glob(`build/events/**/*.js`)).map((filePath) =>
      path.resolve(filePath),
    )

    files.map(async (file: string) => {
      const event: Event = new (await import(file)).default(this.client)

      if (!event.name)
        return (
          delete require.cache[require.resolve(file)] &&
          console.log(`${file.split("/").pop()} does not have name.`)
        )

      const execute = (...args: any) => event.Execute(...args)

      //@ts-ignore
      if (event.once) this.client.once(event.name, execute)
      //@ts-ignore
      else this.client.on(event.name, execute)

      return delete require.cache[require.resolve(file)]
    })
  }

  async LoadCommands() {
    const files = (await glob(`build/commands/**/*.js`)).map((filePath) =>
      path.resolve(filePath),
    )

    files.map(async (file: string) => {
      const command: Command = new (await import(file)).default(this.client)

      if (!command.name)
        return (
          delete require.cache[require.resolve(file)] &&
          console.log(`${file.split("/").pop()} does not have name.`)
        )

      if (file.split("/").pop()?.split(".")[2])
        return this.client.subCommands.set(command.name, command)

      this.client.commands.set(command.name, command as Command)

      return delete require.cache[require.resolve(file)]
    })
  }
}
