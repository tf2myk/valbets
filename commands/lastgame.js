const { SlashCommandBuilder } = require('discord.js');
const { request } = require('undici');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lastgame')
		.setDescription('Shows most recent match results')
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
		if(nameinput = "")
		{return interaction.reply(`No tag entered`);}
		if(nameinput = "")
		{return interaction.reply(`No name entered`);}

		
		oldname = nameinput.toLowerCase();


		taginput.replace('#', '');
		nameinput.replace(' ', '%20');
		
        catResult = await request(`https://api.henrikdev.xyz/valorant/v3/matches/na/${nameinput}/${taginput}?filter=competitive`);
		file  = await catResult.body.json();

		console.log(file);
		
		
		everyone = file.data[0].players.all_players;
		winningteam = file.data[0].teams;
		map = file.data[0].metadata.map;
		matchident = file.data[0].metadata.matchid;
		//console.log(map);
		blueteam = false;
		redteam = false;
		winmessage = "LOSS";
		


		if(winningteam.red.has_won)
		{redteam = true;}
		else 
		{blueteam = true;}

		var player = {};

		//console.log(oldname);

		for (keys in everyone) 
		{
			//console.log(everyone[keys].name.toLowerCase());
			if(everyone[keys].name.toLowerCase() == oldname)
			{
				player = everyone[keys];
				//console.log(player);
				
			}
		}

		

		
		
		statkills = player.stats.kills;
		statdeaths = player.stats.deaths;
		statassists = player.stats.assists;
		
		
		
		if(player.team == "Red" && redteam)
		{winmessage = "WIN";}
		if(player.team == "Blue" && blueteam)
		{winmessage = "WIN"}

		console.log(`${player.name}'s stats have been pulled`);


		return interaction.reply({ content: `\`\`\`
	RESULT: ${winmessage}
		Alias: ${player.name} 
		Kills: ${statkills}
		Deaths: ${statdeaths}
		Assists: ${statassists}\`\`\`
		`});
		
		
		return interaction.reply(`Test`);
		

	},
};