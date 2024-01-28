const { SlashCommandBuilder } = require('discord.js');

// module.exports is a way to export commands so require() can use it
module.exports = {
  // command metadata
  data: new SlashCommandBuilder()
  .setName('test')
  .setDescription('Basic reply 2.'),
  
  // bot response on slash command (used in app.js)
  async execute(interaction) {
    await interaction.reply("Test to see why reload wont fucking work.");
  }
}

