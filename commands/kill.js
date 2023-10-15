const { SlashCommandBuilder } = require('discord.js');
const { execSync } = require('child_process');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kill')
    .setDescription('Kills a process')
    .addStringOption(option => option
      .setName('process')
      .setDescription('The process to kill')
      .setRequired(true)
    )
    .setDMPermission(false),

  async run(message, client, args, legacyMsg) {
    !legacyMsg && await message.deferReply();
    try {
      await execSync('taskkill /f /im ' + (legacyMsg ? args[0] : args.getString('process')));
      legacyMsg ? await message.react('✅') : await message.editReply({ content: '✅' });
    } catch (e) {
      await message[legacyMsg ? 'reply' : 'editReply']({
        content: `\`\`\`${e.message}\`\`\``, ephemeral: true
      });
    }
  }
}
