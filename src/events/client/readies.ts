import { Collection, Events, REST, Routes } from "discord.js"
import Command from "../../base/classes/commands"
import CustomClient from "../../base/classes/custom-client"
import Event from "../../base/classes/events"

export default class Ready extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.ClientReady,
      description: "Ready Event",
      once: true,
    })
  }

  async Execute() {
    console.log("🚀 ~ Ready to active with:", this.client.user?.tag, "\n")

    const clientId = this.client.developmentMode
      ? this.client.config.devClientId
      : this.client.config.clientId
    const rest = new REST().setToken(this.client.config.token)

    if (!this.client.developmentMode) {
      const globalCommands: any = await rest.put(
        Routes.applicationCommands(clientId),
        {
          body: this.GetJson(
            this.client.commands.filter((command) => !command.dev),
          ),
        },
      )
      console.log(
        "🚀 ~ Successfully loaded global (/) command:",
        globalCommands.length,
      )
    }

    const devCommands: any = await rest.put(
      Routes.applicationGuildCommands(clientId, this.client.config.devGuildId),
      {
        body: this.GetJson(
          this.client.commands.filter((command) => command.dev),
        ),
      },
    )
    console.log(
      "🚀 ~ Successfully loaded develop (/) command:",
      devCommands.length,
    )
  }

  private GetJson(commands: Collection<string, Command>): object[] {
    const data: object[] = []

    commands.forEach((command) => {
      data.push({
        name: command.name,
        description: command.description,
        options: command.options,
        default_member_permissions:
          command.default_member_permissions.toString(),
        dm_permission: command.dm_permission,
      })
    })

    return data
  }
}
