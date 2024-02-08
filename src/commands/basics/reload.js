 const { SlashCommandBuilder } = require('discord.js');

// this file is for the reload command, which is needed only when a command is updated, NOT when a completely new command is created
module.exports = {
  category: 'basics',
  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Reloads a command.')
    .addStringOption(option =>
      option.setName('command') // parameter of .reload command, tells script which command to reload
        .setDescription('The command to reload.')
        .setRequired(true)),
  // ensures that the command does in fact exist 
  async execute(interaction) {
    const commandName = interaction.options.getString('command', true).toLowerCase();
    const command = interaction.client.commands.get(commandName);

    if (!command) {
      return interaction.reply(`There is no command with name \`${commandName}\`!`);
    }

    // deletes the earlier version of the command from the cache
    delete require.cache[require.resolve(`./${command.data.name}.js`)];

    // loads the new version of the command into the command handler
    try {
      interaction.client.commands.delete(command.data.name);
      const newCommand = require(`./${command.data.name}.js`);
      interaction.client.commands.set(newCommand.data.name, newCommand);
      await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
    } catch (error) {
      console.error(error);
      await interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
    }
    
  },
};