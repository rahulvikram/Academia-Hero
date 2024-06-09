// Import js classes and authentication token
const fs = require('node:fs');
const path = require('node:path');
const express = require('express')
const { Client, Collection, Events, GatewayIntentBits, ActivityType } = require('discord.js');
const token = process.env['TOKEN']

console.log(token);

const app = express()
const port = 3000;
app.get('/', (req, res) => {
  res.json({
    'hey': 'test'
  })
})

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})

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
module.exports.client = client;

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

// same as above code, but for events/ folder instead of commands/ folder
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
// shorter code because we aren't searching for subfolders
for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  // execute event callback function using ...args (similar to *args in python)
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// UPDATE STATUS EVERY 10 SECONDS
// dict of videos to choose from
const activities = {
  "Multivariable Calculus": "nIJQPX5kxp4",
  "Data Structures & Algorithms": "8hly31xKli0",
  "Organic Chemistry Compounds":"wOqhVPtmoz0",
  "Intro to Circuit Boards":"iZYedWOERN0",
  "ML: Convolutional Neural Networks":"aircAruvnKk",
  "Intro to Fluid Mechanics":"clVwKynHpB0",
  "Ordinary Differential Equations":"HKvP2ESjJbA"
};

// returns random video from activities objects
function randomActivity(obj) {
    var keys = Object.keys(obj);
    return keys[keys.length * Math.random() << 0];
};

// returns random link from activities object
function randomLink(obj) {
    var keys = Object.keys(obj);
    return `https://www.youtube.com/watch?v=${obj[keys[ keys.length * Math.random() << 0]]}`;
};

// refreshing status every 10 seconds to random activity
client.on("ready", () => {
  // run every 10 seconds
  setInterval(() => {
    // generate random activity and link.
    let activity = randomActivity(activities);
    let link = randomLink(activities);

    // update the user activity with desired type
    client.user.setActivity(activity, { 
      name: 'Teaching',
      type: ActivityType.Watching,
      url: link,
    });
  }, 10_000);
});


// Log in to Discord with client's token
client.login(token);


