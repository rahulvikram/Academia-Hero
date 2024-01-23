// Import js classes and authentication token
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const token = process.env['TOKEN']

// Create a new client instance with all its intents
const client = new Client({
  intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildBans,
      GatewayIntentBits.GuildEmojisAndStickers,
      GatewayIntentBits.GuildIntegrations,
      GatewayIntentBits.GuildWebhooks,
      GatewayIntentBits.GuildInvites,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildMessageTyping,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.DirectMessageReactions,
      GatewayIntentBits.DirectMessageTyping,
      GatewayIntentBits.GuildScheduledEvents,
      GatewayIntentBits.MessageContent
  ]
});

// When the client is ready, run this code
client.once(Events.ClientReady, readyClient => {
  console.log(`${readyClient.user.tag} is online!`);
});
/*--------------- Loads command files into client's command collection ---------------*/
// collection of commands
client.commands = new Collection();

// append commands folder to path 
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

// iterates through each folder and subfolder looking for .js files
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // filters out files that aren't .js
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    // ensures both 'data' and 'execute' are in the command.js file
    if ('data' in command && 'execute' in command) {
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      client.commands.set(command.data.name, command);
      // otherwise, do not add command to clients collection
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

// on slash command execution, an interaction is created; to respond, create a listener 
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return; // does nothing if its not a slash command interaction 

  // retrieves interaction's command name and checks for a match in client command list
  const command = interaction.client.commands.get(interaction.commmandName);
  // if no matching command found in client list, return an error
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  // error handling if interaction response does not execute properly
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
})




// Log in to Discord with client's token
client.login(token);


