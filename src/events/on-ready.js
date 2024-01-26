const { Events } = require('discord.js');


// EVENT: When the client is ready, run this code
module.exports = {
  name: Events.ClientReady,
  once: true, // run this event only one time in the bot's online lifespan
  execute(client) {
    console.log(`Success! ${readyClient.user.tag} is online!`);
  },
};