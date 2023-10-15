const { SlashCommandBuilder } = require('discord.js');
const { spawnSync } = require('child_process');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rs-admin')
    .setDescription('Restarts the bot with admin permissions'),

  run() {
    const cmdArgs = process.argv;
    const cmdProcess = cmdArgs.shift();
    const cmd = `Start-Process "${cmdProcess}" -WindowStyle Hidden -Verb RunAs -ArgumentList "${cmdArgs.join(' ').replace('"', '`"')}" -WorkingDirectory "${process.cwd()}"`;
    spawnSync('powershell', cmd.split(' '));
    process.exit(0);
  }
}
