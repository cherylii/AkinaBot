const Discord = require('discord.js')
const { prefix, token, colorHex } = require('../config.json')
module.exports = {
	name: 'avatar',
	aliases: ['icon', 'pfp'],
	description: 'Get the profile picture of a user! they must\'ve a really good one...',
	usage: { "<\@user>": "User that you want to get the picture of" },
	subcommands: {},
	category: "Information",
	args: false,
	cooldown: 5,
	guildOnly: false,
	execute(client, message, args, currency, category, distube, tmpMsg) {

		if (!message.mentions.users.size) {
			avatarEmbed = new Discord.MessageEmbed()
				.setColor(colorHex)
				.setAuthor(`${message.author.username}'s profile avatar`, message.author.displayAvatarURL({ dynamic: true }))
				.setDescription(`**[Here's a link to their avatar!](${message.author.displayAvatarURL({ dynamic: true })})**`)
				.setImage(message.author.displayAvatarURL({ dynamic: true, size: 1024 }))
				.setFooter(`Isn't it beautifully pristine?`, message.author.displayAvatarURL({ dynamic: true }))
			return message.channel.send({ embeds: [avatarEmbed] });
		}
		if (message.mentions.users.size == 1) {
			let user = message.mentions.users.first()
			avatarEmbed = new Discord.MessageEmbed()
				.setColor(colorHex)
				.setAuthor(`${user.id.toString() === "776735927229087764" ? "Your cutest bot" : user.username}'s profile avatar`, user.displayAvatarURL({ dynamic: true }))
				.setDescription(`**[${user.id.toString() === "776735927229087764" ? "Here's a link to see me even more clearly!" : "Here's a link to their avatar!"}](${user.displayAvatarURL({ dynamic: true })})**`)
				.setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
				.setFooter(`${user.id.toString() === "776735927229087764" ? "Hehe, It's the cutest thing ever!" : "Isn't it beautifully pristine?"}`, user.displayAvatarURL({ dynamic: true }))
			return message.channel.send({ content: `${ user.id.toString() === "776735927229087764" ? "*Hehe, you wish to see me more clearly? <3*" : ' '}`, embeds: [avatarEmbed] });
		}
		if (message.mentions.users.size > 1 && message.mentions.users.size < 11) {
			avatarEmbed = new Discord.MessageEmbed()
				.setColor(colorHex)
				.setAuthor(`All of their profile avatars!`, client.user.displayAvatarURL({ dynamic: true }))
				.setFooter(`Aren't they all beautifully pristine?`, client.user.displayAvatarURL({ dynamic: true }))
			var description = `**Here are links to their avatars!**\n`
			let counter = 1
			message.mentions.users.map(user => {
				description += `**${counter++}. ${user}'s avatar! : [Click this link! :)](${user.displayAvatarURL({ dynamic: true, size: 1024 })})**\n`
			})
			avatarEmbed.setDescription(description)
			return message.channel.send({ embeds: [avatarEmbed] });
		}
		return message.channel.send(`:x: You can only display up to 10 users' avatars at once!`)
	},
};