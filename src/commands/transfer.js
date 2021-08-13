module.exports = {
    name: "transfer",
    aliases: ["pay"],
    description: "Transfer stars to another user! Great that you're donating!",
    usage: {"[\@user]" : "User that you want to transfer to",
            "[bal]" : "Number of stars to transfer"},
    subcommands: {},
    category: "Currency",
    args: true,
    cooldown: 5,
    guildOnly: true,
    execute(client, message, args, currency, category, distube, tmpMsg) {
        message.channel.send(":x: Database under maintenance!")
        // const currentAmount = currency.getBalance(message.author.id);
        // const transferAmount = args[1]
        // const transferTarget = message.mentions.users.first();

        // if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`:x: That is not a valid amount!`);
        // if (transferAmount > currentAmount) return message.channel.send(`:x: You only have ${currentAmount} stars!`);
        // if (transferAmount <= 0) return message.channel.send(`:x: You cannot send a negative amount!`);

        // currency.add(message.author.id, -transferAmount);
        // currency.add(transferTarget.id, transferAmount);

        // return message.channel.send(`You transferred **${transferAmount} stars** to **${transferTarget.username}!** You have **${currency.getBalance(message.author.id)} stars!**`);
    }
}