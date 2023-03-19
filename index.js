const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, messageLink, Message } = require('discord.js');
const { token } = require('./config.json');
const { channel } = require('node:diagnostics_channel');
const reactioncheck = new Map();
const gambleboards = new Map();
isGamble = false;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}


client.once(Events.ClientReady, () => {
	console.log('Ready!');
});



function gambletimer(message)
{
	
	//console.log(message);


	holding = message.content;
	holding2 = holding.concat('\n \n Voting has ended ! ! !');
	message.edit(holding2);
	isGamble = false;
	
};



//client.on('messageCreate', (oldmessage, message) => {
	client.on('messageUpdate', (oldmessage, message) => {
		var that = this.message;

		if(message.author.bot && message.author.username == "valbets" && message.content.includes("PREDICTIONS"))
		{
			/*
			if(isGamble && message.content.includes("WIN"))    /// NEED TO FIGURE OUT HOW  TO NOT CHANGE ON EDITS
			{
				message.edit("A prediction is currently happening")
				setTimeout(() => message.delete(), 3000);
			}
			*/


			if(!isGamble)
			{
				//console.log(`The bot said: ${message.content}`);
				message.react('😄')
					.then(() => message.react('🙁'))
					.catch(error => console.error('One of the emojis failed to react:', error));

				isGamble = true;

				
				setTimeout(gambletimer, 5000, message);

				
			}
			
			
		}
	
});


client.on("messageReactionAdd", function(messageReaction, user){
	if(!user.bot && messageReaction.message.content.includes("PREDICTIONS") && messageReaction.message.author.username == "valbets")
	{
		

		if(reactioncheck.get(user.username) != messageReaction.message.id && !messageReaction.message.content.includes("ended"))
		{
			reactioncheck.set(user.username, messageReaction.message.id)
			hold = messageReaction.message.content;
			hold2 = hold.substring(0, hold.length-3);

			if(messageReaction.emoji.name == '😄')
			{
					hold3 = hold2.concat
				(`
				
		${user.username} :: WIN` 
				);

				hold3 = hold3.concat("```"); 
				messageReaction.message.edit(hold3);
				console.log("updated");
			}

			if(messageReaction.emoji.name == '🙁')
			{
					hold3 = hold2.concat
				(`
				
		${user.username} :: LOSE` 
				);

				hold3 = hold3.concat("```"); 
				messageReaction.message.edit(hold3);
				console.log("updated");
			}
		}
		//console.log(messageReaction.emoji);
		
		
		

		
		
	}

	
});





client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(token);