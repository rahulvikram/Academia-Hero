// RUN THIS SCRIPT EVERYTIME A COMMAND IS MODIFIED

const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const token = process.env['TOKEN'];
const clientId ="1198747325431029971"

const commands = []; // empties the commands list for reloading

// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  // Grab all the command files from the commands directory you created earlier
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON()); // push slashcommand metadata to commands[] array
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

// make instance of the REST object
const rest = new REST().setToken(token);

// deploy commands via REST
(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    // REST.put to refresh all commands with current set, needed whenever new commands are made
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands }, // body of the put request (aka data to upload, aka all commands)
		);
    // if successful
    console.log(`Successfully reloaded ${data.length} application (/) commands.`); 
  } catch (error) {
    // if error, log it
    console.error(error);
  }
})(); // IIFE; immediately calls function