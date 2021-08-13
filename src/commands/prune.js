const { Permissions } = require('discord.js');
const Discord = require('discord.js')
module.exports = {
	name: 'prune',
	aliases: ['delete'],
	description: 'Deletes the past [number] of messages.',
	usage: {
		"[number]": "Number of messages to delete",
		"<subcommand>": "Subcommand to use"
	},
	subcommands: { 
		"bot": "Deletes messages from bots only" 
	},
	category: "Moderation",
	args: true,
	cooldown: 5,
	guildOnly: true,
	execute(client, message, args, currency, category, distube, tmpMsg) {
		if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES, true) && message.member != message.guild.ownerId) return message.channel.send(":x: You do not have the permissions to prune messages\nRequires `MANAGE\_MESSAGES`");

		const amount = parseInt(args[0]) + 1;

		if (args.includes("bot")) {
			let messageArr = []
			message.channel.messages.fetch({ limit: amount ? amount : 50 })
				.then((messages) => {
					messages.forEach(msg => { 
						if (msg.author.bot) messageArr.push(msg)
					})
					message.channel.bulkDelete(messageArr)
					return message.channel.send(`:white_check_mark: I have deleted bot messages from the last ${amount ? amount - 1 : 50} messages!`)
						.then(message => {
							setTimeout(() => message.delete(), 20000)
						})
				})
				.catch((err) => { return console.log(err) })
		}
		else {

			if (isNaN(amount)) {
				return message.channel.send(':x: That\'s not a number!');
			}
			else if (amount <= 1 || amount > 100) {
				return message.channel.send(':x: I can only delete up to 99 messages!');
			}

			message.channel.bulkDelete(amount, true)

				.then(() => {
					message.channel.send(`:white_check_mark: I have deleted ${amount - 1} messages!`)
						.then(message => {
							setTimeout(() => message.delete(), 20000)
						})
						.catch(error => {
							console.error("I-I failed to delete a message\n", error);
						})
				})
				.catch(error => {
					console.error(`I-I failed to prune messages...\n`, error);
					message.channel.send(':x: I-I failed to prune messages in this channel...');
				});
		}
	},
};