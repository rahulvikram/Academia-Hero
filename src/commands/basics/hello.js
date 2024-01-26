const { SlashCommandBuilder } = require('discord.js');

// module.exports is a way to export commands so require() can use it
module.exports = {
  // command metadata
  data: new SlashCommandBuilder()
  .setName('hello')
  .setDescription('Basic reply command.'),
  
  // bot response on slash command (used in app.js)
  async execute(interaction) {
    await interaction.reply("Hi! I'm here to assist you with your academic needs. Use /help for a list of my commands and features!");
  }
}

