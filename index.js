const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { readdirSync } = require('fs');
const { resolve } = require('path');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages
  ]
});
client.commands = new Collection();

const events = readdirSync(resolve('events')).filter(f => f.endsWith('.js'));
events.forEach((event) => {
  const file = require(resolve('events', event));
  client.on(file.name, async (...args) => file.run(...args, client));
});

const commands = readdirSync(resolve('commands')).filter(f => f.endsWith('.js'));
commands.forEach((command) => {
  const path = resolve('commands', command);
  const file = require(path);
  if ('data' in file && 'run' in file) {
    client.commands.set(file.data.name, file);
    console.log(`Loaded ${file.data.name} command`);
  } else {
    console.log(`[WARNING] The command at ${path} is missing a required "data" or "run" property.`);
  }
});

client.login(process.env.BOT_TOKEN);
