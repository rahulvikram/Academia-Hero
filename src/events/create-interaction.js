const { Events } = require('discord.js');

// EVENT: on slash command execution, an interaction is created; to respond, create a listener 
module.exports = {
  name: Events.InteractionCreate, // which event is this function is for?

  // run this code on the event occurance
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return; // does nothing if its not a slash command interaction 

    // retrieves interaction's command name and checks for a match in client command list
    const command = interaction.client.commands.get(interaction.commandName);

    // if no matching command found in client list, return an error
    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    // error handling if interaction response does not execute properly
    try {
      await command.execute(interaction); // execute command response
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
      } else {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
  }
};