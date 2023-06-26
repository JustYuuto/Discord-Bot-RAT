const { Client, Events } = require('discord.js');
const { prefix, token } = require('./config.json');
const { execSync } = require('child_process');

const client = new Client({
  intents: []
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === 'run') {
    try {
      await execSync(args.join(' '));
      await message.reply({
        content: 'The command has been successfully ran!'
      });
    } catch (e) {
      await message.reply({
        content: `An error occurred while running command: ${e.message}`
      });
    }
  }
});

client.login(token);
