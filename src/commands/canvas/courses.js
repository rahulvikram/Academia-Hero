const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');

const canvasToken = process.env['CANVAS_TOKEN']

// data store to get enrollment_term.id from canvas api obj
const termDict = {
  "fall_2023": 7029,
  "winter_2024": 7030,
  "spring_2024": 7031,
  "fall_2024": 7032,
  "winter_2025": 7033,
  "spring_2025": 7034,
  "fall_2025": 7035,
  "winter_2026": 7036,
  "spring_2026": 7037,
  "fall_2026": 7038,
  "winter_2027": 7039,
  "spring_2027": 7040,
  "undefined": 0 // returns nothing in interaction.reply if no term assigned/no registration yet
}

// TODO: parameterize command to accept optional TERM and YEAR args, if no args, use new built code
module.exports = {
  category: 'canvas',
  data: new SlashCommandBuilder()
    .setName('courses')
    .setDescription('Returns a list of user-enrolled courses.')
    .addStringOption(option => 
      option.setName("term_year") // optional parameter: # of weeks for range of assignments
        .setDescription("Specify term and year as: 'term_year' (default: thisterm_thisyear)")
      ),
  async execute(interaction) {
    try {
      // set today's date and get this year
      const today = new Date()
      let todayString = today.toLocaleString('en-US', { timeZone: 'UTC' }).split(',')[0]
      let thisYear = todayString.slice(-4);

      // create Date objects for term start and end dates
      const fallStart = Date.parse(`${"09/21"}/${thisYear}`);
      const fallEnd = Date.parse(`${"12/31"}/${thisYear}`);
      const winterStart = Date.parse(`${"01/01"}/${thisYear}`);
      const winterEnd = Date.parse(`${"03/20"}/${thisYear}`);
      const springStart = Date.parse(`${"03/21"}/${thisYear}`);
      const springEnd = Date.parse(`${"06/20"}/${thisYear}`);

      // today's Date object to be checked
      let checkString = Date.parse(todayString);

      // returns seasondict key based on today's date
      var seasonDictRef;
      if (checkString <= winterEnd && checkString >= winterStart) {
          seasonDictRef = `winter_${thisYear}`;    
      } else if (checkString <= fallEnd && checkString >= fallStart) {
          seasonDictRef = `fall_${thisYear}`;       
      } else if (checkString <= springEnd && checkString >= springStart) {
          seasonDictRef = `spring_${thisYear}`;       
      } else {
          seasonDictRef = 'undefined';   
      }
      
      // retrive user courses via Canvas API
      fetch("https://canvas.oregonstate.edu/api/v1/users/6561405/courses", {
        headers: {Authorization: `Bearer ${canvasToken}`}
      })
      .then((response) => {
        return response.json(); // parse response as JSON data
      })
      .then(async (data) => {
        // map and filter to get course strings
        const courses = data.map((course) => {
          // if user provides a term year, map by that
          if (interaction.options.get('term_year')) {
            seasonDictRef = interaction.options.get('term_year').value;
          }
          
          if (course.enrollment_term_id == termDict[seasonDictRef]) {
              return {name: course.name, value: `https://canvas.oregonstate.edu/courses/${course.id}`}  
          }
        }).filter(n => n);

        // creating and formatting embed message for reply
        const exampleEmbed = new EmbedBuilder()
          .setColor(0xe80030)
          .setTitle('User Courses')
          .setURL('https://canvas.oregonstate.edu/courses')
          .setAuthor({ name: 'Canvas LMS', iconURL: 'https://www.instructure.com/sites/default/files/image/2021-12/canvas_reversed_logo.png', url: 'https://canvas.oregonstate.edu/' })
          .setThumbnail('https://scontent.fhio3-1.fna.fbcdn.net/v/t39.30808-6/305582667_590044565820620_1219664435155922301_n.png?_nc_cat=106&ccb=1-7&_nc_sid=efb6e6&_nc_ohc=oC5SnQGLuBkAX8gVarJ&_nc_ht=scontent.fhio3-1.fna&oh=00_AfCc5haSzQ4Ein843H8NeOje28UX5K230KdAsrwZg4AnaQ&oe=65C9CEC7')
          .setDescription(`List of courses for ${interaction.user.tag}`)
          .addFields(
            courses
          )
          .setTimestamp()
          .setFooter({ text: 'Powered by Canvas LMS API', iconURL: 'https://www.instructure.com/sites/default/files/image/2021-12/canvas_reversed_logo.png', url: 'https://canvas.instructure.com/doc/api/'});
        
        // reply to slashcommmand with embed
        await interaction.reply({embeds: [exampleEmbed]});
        console.log(seasonDictRef);
      })
      .catch( async (err) => {
        await interaction.reply(`Error fetching data.\n${err}`);
        console.log(err);
      })
    } catch (error) {
      await interaction.reply(`Error fetching data.\n${error}`)
    }
  }
}