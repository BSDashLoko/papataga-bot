const { SlashCommandBuilder } = require('@discordjs/builders');
const {
	joinVoiceChannel,
} = require('@discordjs/voice');

const fs = require('fs');
const fileName = './queue.json';
const file = require(fileName);

function pushJSON(){
    fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
        if (err) return console.log(err);
      })
    }
    

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Para a música'),

    async execute(interaction) {

        await interaction.reply({content:"Parando a música"})

        file.queue = [];
        file.isQueue = false;
        pushJSON();
        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channelId,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator
        });
        connection.destroy();
        


    }
}