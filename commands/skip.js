const { SlashCommandBuilder } = require('@discordjs/builders');
const play = require('play-dl')
const {
	AudioPlayerStatus,
    NoSubscriberBehavior,
	createAudioPlayer,
	createAudioResource,
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

async function endSong(connection){
    file.queue.shift(); pushJSON();
    queue = file.queue;

    if(queue.length != 0){

        file.isQueue = true; pushJSON();
        const stream = await play.stream(file.queue[0]);
        const resource = createAudioResource(stream.stream, {inputType: stream.type});
        const player = createAudioPlayer({behaviors: {noSubscriber: NoSubscriberBehavior.Play}});
        player.play(resource);
        connection.subscribe(player);
        player.on(AudioPlayerStatus.Idle, () => endSong(connection));
    }else{
        if(file.isQueue){
            file.isQueue = false;
             file.queue = []; pushJSON();
             connection.destroy(); 
         }
    }



    
}

    

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Vai para a próxima música da fila'),

    async execute(interaction) {

        const connection = joinVoiceChannel({
			channelId: interaction.member.voice.channelId,
			guildId: interaction.guildId,
			adapterCreator: interaction.guild.voiceAdapterCreator
		});

        endSong(connection);
        await interaction.reply({content:"Pulando a música"})


    }
}