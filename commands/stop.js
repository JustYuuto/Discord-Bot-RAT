const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stops the bot'),

  async run(interaction) {
    await interaction.reply({
      content: 'Shutting down bot...'
    });
    process.exit(0);
  }
}
