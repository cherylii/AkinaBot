module.exports = {
	name: 'bal',
	aliases: ['balance'],
	description: 'Get the number of stars of a user! Who\'s richer?',
    usage: {"<\@user>" : "User to check their number of stars"},
    subcommands: {},
    category: "Currency",
	args: false,
	cooldown: 5,
	guildOnly: true,
    execute(client, message, args, currency, category, distube, tmpMsg) { 
        message.channel.send(":x: Database under maintenance!")
    //     if (message.mentions.users.size) 
    //         return message.channel.send(`:sparkles: ${message.mentions.users.first().username} has **${currency.getBalance(message.mentions.users.first().id)} stars!**`);
    //     else 
    //         return message.channel.send(`:sparkles: You have **${currency.getBalance(message.author.id)} stars!**`);
    }
}