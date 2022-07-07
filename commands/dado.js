const { SlashCommandBuilder, time } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('d')
		.setDescription('Lança um ou mais dados, de x lados')

		.addNumberOption(option =>
			option.setName('numdado')
				.setDescription('Número de lados do(s) dado(s)')
				.setRequired(true))

		.addNumberOption(option =>
			option.setName('timesdado')
				.setDescription('Número de dados a serem lançados')
				.setRequired(false)),
				
	async execute(interaction) {
		
		numDado = parseInt(interaction.options.getNumber("numdado"));
		timesDado = parseInt(interaction.options.getNumber("timesdado"));
		random = []
		if(timesDado !== timesDado){
			timesDado = 1
		}

		for (let i = 0; i < timesDado; i++) {

			random[i]= Math.floor((Math.random() * numDado)+1);


		}

		output = random.join(", ")
		output = "Resultado do "+timesDado+"d"+numDado+": "+output
		await interaction.reply({content:output})




	}
}