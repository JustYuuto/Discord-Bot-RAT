const { Events, REST, Routes } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  async run(client) {
    console.log(`Logged in as ${client.user.tag}`);

    const rest = new REST().setToken(process.env.BOT_TOKEN);

    try {
      const data = await rest.put(Routes.applicationCommands(client.user.id), { body: client.commands.map(c => c.data) });
      console.log(`Successfully reloaded ${data.length} application commands.`);
    } catch (err) {
      console.error(err);
    }
  }
}
