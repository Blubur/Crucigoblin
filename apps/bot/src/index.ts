import { Client, GatewayIntentBits } from "discord.js";
import "dotenv/config";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.once("ready", () => {
  console.log(`Bot conectado como ${client.user?.tag}`);
});

const token = process.env.DISCORD_BOT_TOKEN;

if (!token) {
  console.error(
    "Falta DISCORD_BOT_TOKEN en el .env. Crea la app en el Discord Developer Portal primero.",
  );
  process.exit(1);
}

client.login(token);
