const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, messageLink } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages,] });

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


client.on('messageCreate', (message) => {
	//console.log(message.content);
	//console.log(message.author);
	if(message.author.bot && message.author.username == "valbets" && message.content.includes("PREDICTIONS"))
	{
		//console.log(`The bot said: ${message.content}`);
		console.log("Bot started predicitions");
		message.react('😄')
			.then(() => message.react('🙁'))
			.catch(error => console.error('One of the emojis failed to react:', error));
	}
});

/*

const filter = (reaction, user) => {
	return reaction.emoji.name === '😄' && message.content.includes("PREDICTIONS") && message.author.username == "valbets";
};
const collector = message.createReactionCollector({ filter});

collector.on('collect', (reaction, user) => {
	console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
});
*/

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