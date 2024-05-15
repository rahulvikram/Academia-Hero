const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');

const canvasToken = process.env['CANVAS_TOKEN']

// TODO: parameterize command to accept optional TERM and YEAR args, if no args, use new built code
module.exports = {
  category: 'canvas',
  data: new SlashCommandBuilder()
    .setName('assignments')
    .setDescription('Returns a list of upcoming user assignments.'),
  async execute(interaction) {
    try {
      fetch("https://canvas.oregonstate.edu/api/v1/users/6561405/courses", {
        headers: {Authorization: `Bearer ${canvasToken}`}
      })
      .then((response) => {
        return response.json(); // parse response as JSON data
      })
      .then(async (data) => {
        console.log(data);
        await interaction.reply('success');
      });
    } catch (error) {
      await interaction.reply(`Error fetching data.\n${error}`)
    }
  }
}