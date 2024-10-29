import {
  ApplicationCommandOptionType,
  RESTPostAPIApplicationCommandsJSONBody,
  Routes,
} from "npm:discord-api-types@^0.37.67/v10";
import { REST } from "npm:@discordjs/rest@^2.2.0";
import { loadDotEnv } from "./common.ts";

await loadDotEnv({ export: true });
const BOT_TOKEN = Deno.env.get("DISCORD_BOT_TOKEN");
const APPLICATION_ID = Deno.env.get("DISCORD_APPLICATION_ID");
const GUILD_ID = Deno.env.get("DISCORD_GUILD_ID");
if (!BOT_TOKEN || !APPLICATION_ID || !GUILD_ID) {
  throw new Error("Missing env variables");
}

console.log("Updating slash commands...");
const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);
const command: RESTPostAPIApplicationCommandsJSONBody = {
  name: "target",
  description: "Set target rate for notification",
  options: [{
    name: "rate",
    description: "Target rate",
    type: ApplicationCommandOptionType.Number,
    required: true,
  }],
};
const res = await rest.put(
  Routes.applicationGuildCommands(APPLICATION_ID, GUILD_ID),
  { body: [command] },
);
console.log(`Registed ${(res as unknown[]).length} commands`);
