import { Events } from "discord.js";
import Event from "../../base/classes/Event";
import CustomClient from "../../base/classes/CustomClient";

export default class Ready extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.ClientReady,
      description: "Ready Event",
      once: true,
    })
  }

  Execute() {
      console.log(`${this.client.user?.tag} is now ready!`);
  }
}
