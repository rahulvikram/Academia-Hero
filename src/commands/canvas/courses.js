const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');

const canvasToken = process.env['CANVAS_TOKEN']

module.exports = {
  category: 'canvas',
  data: new SlashCommandBuilder()
    .setName('courses')
    .setDescription('Returns a list of user-enrolled courses.'),
  async execute(interaction) {
    try {
      fetch("https://canvas.oregonstate.edu/api/v1/users/6561405/courses", {
        headers: {Authorization: `Bearer ${canvasToken}`}
      })
      .then((response) => {
        return response.json();
      })
      .then(async (data) => {
        // map and filter to get course strings
        const courses = data.map((course) => {
            if (course.enrollment_term_id == 7030) {
                return {name: course.name, value: `https://canvas.oregonstate.edu/courses/${course.id}`}  
            }
        }).filter(n => n);

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
        
        // return courses in non-array format
        // interaction.channel.send({ embeds: [exampleEmbed] });
        await interaction.reply({embeds: [exampleEmbed]});
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