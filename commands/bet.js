const { SlashCommandBuilder } = require('discord.js');
const { request } = require('undici');
const { Client, GatewayIntentBits } = require('discord.js');
var player = {};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bet')
		.setDescription('Opens the predictions menu')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('Insert name, EX: phonkk')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('tag')
				.setDescription('Insert tag without, EX: beat')
				.setRequired(true)),
		
	async execute(interaction) {

		nameinput = interaction.options.getString('name') ?? 'No name provided';
		taginput = interaction.options.getString('tag') ?? 'No tag provided';
		oldname = nameinput.toLowerCase();

		await interaction.deferReply({ ephemeral: false });


		taginput.replace('#', '');
		nameinput.replace(' ', '%20');
		
        catResult = await request(`https://api.henrikdev.xyz/valorant/v3/matches/na/${nameinput}/${taginput}?filter=competitive`);
		file  = await catResult.body.json();


		try
		{
			everyone = file.data[0].players.all_players;
			winningteam = file.data[0].teams;
			map = file.data[0].metadata.map;
			matchident = file.data[0].metadata.matchid;
			blueteam = false;
			redteam = false;
			winmessage = "LOSS";
		}
		catch(e)
		{
			return interaction.editReply("Couldnt find your name && tag");
		}

		for (keys in everyone) 
		{
			//console.log(everyone[keys].name.toLowerCase());
			if(everyone[keys].name.toLowerCase() == oldname)
			{
				player = everyone[keys];
				console.log(player.name);
				
			}
		}

		
		message = `\`\`\`     PREDICTIONS FOR  ${player.name.toUpperCase()}        `
		message = message.concat("```");
		//message = `Vote to start predictions for ${player.name.toUpperCase()}`;
		await interaction.editReply(message);
		
		

	},
};