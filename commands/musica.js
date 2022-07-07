const { SlashCommandBuilder } = require('@discordjs/builders');
const play = require('play-dl')
const {
	AudioPlayerStatus,
    NoSubscriberBehavior,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} = require('@discordjs/voice');
const yt = require('youtube-search-without-api-key')

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
		.setName('m')
		.setDescription('Toca alguma música do youtube, funciona com link ou nome')
        .addStringOption(option =>
            option.setName('music')
                .setDescription('Link do youtube ou nome da música')
                .setRequired(true)),

	async execute(interaction) {


		const connection = joinVoiceChannel({
			channelId: interaction.member.voice.channelId,
			guildId: interaction.guildId,
			adapterCreator: interaction.guild.voiceAdapterCreator
		});


        music = interaction.options.getString("music");

        if(music.indexOf("https://www.youtube.com/watch?v=") === 0){
            inputURL = music;
            ytId = music.replace('https://www.youtube.com/watch?v=','');
            videos= await yt.search(ytId);
            videoTitle = videos[0].snippet.title;

        }else{
            const videos = await yt.search(music);
            inputURL = videos[0].snippet.url;
            videoTitle = videos[0].snippet.title
        }

        await interaction.reply({content:"Tocando "+ videoTitle})

        file.queue.push(inputURL); pushJSON();



        if(file.isQueue == false){
            file.isQueue = true; pushJSON();

            const stream = await play.stream(file.queue[0]);
            const resource = createAudioResource(stream.stream, {inputType: stream.type});
            const player = createAudioPlayer({behaviors: {noSubscriber: NoSubscriberBehavior.Play}});
            player.play(resource);
            connection.subscribe(player);
            player.on(AudioPlayerStatus.Idle, () => endSong(connection));
        }


    }
}