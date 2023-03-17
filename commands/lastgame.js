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

		await interaction.deferReply({ ephemeral: false });


		nameinput = interaction.options.getString('name') ?? 'No name provided';
		taginput = interaction.options.getString('tag') ?? 'No tag provided';
		//console.log(nameinput);
		//console.log(taginput);

		/*
		if(nameinput = "")
		{return interaction.reply(`No tag entered`);}
		if(nameinput = "")
		{return interaction.reply(`No name entered`);}
		*/
		

		oldname = nameinput.toLowerCase();
		nameinput = nameinput.replace(/\s/g, '%20');
		taginput = taginput.replace('#', '');
		
		//console.log(nameinput);
		//console.log(taginput);
		try{
			apiresult = await request(`https://api.henrikdev.xyz/valorant/v3/matches/na/${nameinput}/${taginput}?filter=competitive`);
			file  = await apiresult.body.json();
		  }
		  catch(e){
			return interaction.editReply(`Crashed, ${e}`);
		  }

		//console.log(file);
		
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
			return interaction.editReply(`Crashed, ${e}`);
		}
		
		


		if(winningteam.red.has_won)
		{redteam = true;}
		else 
		{blueteam = true;}

		var player = {};



		for (keys in everyone) 
		{
			//console.log(everyone[keys].name.toLowerCase());
			if(everyone[keys].name.toLowerCase() == oldname)
			{
				player = everyone[keys];
				console.log(player.name);
				
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


		return interaction.editReply({ content: `\`\`\`
	RESULT: ${winmessage}
		Alias: ${player.name} 
		Kills: ${statkills}
		Deaths: ${statdeaths}
		Assists: ${statassists}\`\`\`
		`});
		
		
		//return interaction.reply(`Test`);
		

	},
};