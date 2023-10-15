const { Events } = require('discord.js');
const { prefix } = require('../config.json');

module.exports = {
  name: Events.MessageCreate,
  async run(message, client) {
    if (message.author.bot || !message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = client.commands.get(args.shift().toLowerCase());
    if (!command) return;

    try {
      await command.run(message, client, args);
    } catch (e) {}
  }
}
