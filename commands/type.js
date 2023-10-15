const { SlashCommandBuilder } = require('discord.js');
const { keyboard } = require('@nut-tree/nut-js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('type')
    .setDescription('Sends keys to the keyboard')
    .addStringOption(option => option
      .setName('keys')
      .setDescription('The keys to send')
      .setRequired(true)
    )
    .setDMPermission(false),

  async run(interaction, client, args) {
    const keys = interaction.options ? interaction.options.getString('keys') : args.join(' ');
    await keyboard.type(keys);
    await interaction.react('✅');
  }
}
