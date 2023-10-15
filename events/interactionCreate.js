const { Events } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async run(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.run(interaction, client, interaction.options);
    } catch (e) {}
  }
}
