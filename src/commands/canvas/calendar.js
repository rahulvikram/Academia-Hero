const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');

const canvasToken = process.env['CANVAS_TOKEN']


module.exports = {
  category: 'canvas',
  data: new SlashCommandBuilder()
    .setName('weekly')
    .setDescription('Returns assignments for the current week.')
    .addIntegerOption(option =>
      option.setName("weeks") // optional parameter: # of weeks for range of assignments
        .setDescription("Specify number of weeks for assignment scope (default: 1)")
        .setMinValue(1)
        .setMaxValue(4) // avoids discord API message overload or TOS breakage
      ),
  async execute(interaction) {
    try {
      let startDate = new Date(); // initialize start date to today
      // return an end date if the user provides a range of weeks
      const createEndDate = (starting_date) => {
        // check if weeks parameter was provided by user
        if (interaction.options.get('weeks')){
          // if provided, calculate days to go forward for query range
          const daysToAdd = interaction.options.get('weeks')*7;

          // create new end date based on days to add
          var endDate = new Date(); // set enddate to today
          endDate.setDate(endDate.getDate() + daysToAdd); // adds days to add to endDate

          // return the end date
          return endDate;
        }       
        // if no input is provided, return today as the end date to make start & end the same
        return starting_date;
      }
      let endDate = createEndDate(startDate); // create enddate variable

      startDate = startDate.toISOString()
      endDate = endDate.toISOString();

      // set GET request data and URL for querystring
      const url = 'https://canvas.oregonstate.edu/api/v1/users/6561405/calendar_events'
      let data = {
        type: 'assignment',
        start_date: startDate,
        end_date: endDate
      }
      // querystring using url and data
      let queryString = new URLSearchParams(data).toString();
      // final URL with parameters
      const paramsURL = `${url}?${queryString}`;

      // use final URL to make fetch request
      fetch(paramsURL, {
        headers: {Authorization: `Bearer ${canvasToken}`}
      })
      .then((response) => {
        return response.json();
      })
      .then(async (data) => {
        await interaction.reply(typeof(data));
      })
      .catch( async (err) => {
        await interaction.reply(`Error fetching data.\n${err}`);
        console.log(err);
      });
    } catch (error) {
      await interaction.reply(`Error fetching data.\n${error}`)
      console.log(error);
    } 
  }
}