const { colorHex } = require('../config.json');
// const { Op } = require('sequelize');
// const { Users, CurrencyShop } = require('../database/dbShopObjects.js');
const Discord = require('discord.js');
module.exports = {
    name: "market",
    aliases: ["shop"],
    description: "Browse the shop! What shall we buy next..?",
    usage: {
        "<subcommand>": "Subcommand to use",
        "<item>": "The item name to buy/sell",
        "<amount>": "Number of items to use"
    },
    subcommands: {
        buy: `Buy an item from the shop, you can buy multiple items if you add a number after this`,
        sell: `Sell an item to the shop, you can sell multiple items if you add a number after this`
    },
    category: "Currency",
    args: false,
    cooldown: 5,
    guildOnly: false,
    async execute(client, message, args, currency, category, distube, tmpMsg) {
        message.channel.send(":x: Database under maintenance!")

        // const itemAmount = args[2] || 1;
        // let amount = 0;

        // if (args[0] && args[0].toLowerCase() == "buy" && args[1]) {
        //     const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: args[1] } } });
        //     if (!item) return message.channel.send(`:x: I don't sell that!`);
        //     if (itemAmount <= 0) return message.channel.send(`:x: You cannot buy negative or zero items!`)
        //     if (item.buy * itemAmount > currency.getBalance(message.author.id)) {
        //         return message.channel.send(`:x: You do not have enough stars!`);
        //     }

        //     const user = await Users.findOne({ where: { user_id: message.author.id } });
        //     currency.add(message.author.id, Number(-item.buy) * itemAmount);
        //     await user.addItem(item, itemAmount);

        //     message.channel.send(`Successfully purchased ${itemAmount} ${item.name}!`);
        // }
        // else if (args[0] && args[0].toLowerCase() == "sell" && args[1]) {
        //     const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: args[1] } } });
        //     if (!item) return message.channel.send(`:x: You cannot sell nothing!`);
        //     if (itemAmount <= 0) return message.channel.send(`:x: You cannot sell negative or zero items!`)

        //     const user = await Users.findOne({ where: { user_id: message.author.id } });
        //     const userItems = await user.getItems();
        //     userItems.map(async uItem => {
        //         const name = uItem.item.name;
        //         amount = uItem.amount;
        //         if (name == item.name)
        //             if (amount < itemAmount)
        //                 return message.channel.send(`You do not have enough ${name} to sell!`)
        //         if (amount >= itemAmount) {
        //             currency.add(message.author.id, Number(item.sell) * itemAmount);
        //             await user.addItem(item, -itemAmount);

        //             message.channel.send(`Successfully sold ${itemAmount} ${item.name}!`);
        //         }
        //     })
        // }
        // else {
        //     const items = await CurrencyShop.findAll();
        //     const marketEmbed = new Discord.MessageEmbed()
        //         .setColor(colorHex)
        //         .setAuthor('Akina\'s Star Market!', message.author.displayAvatarURL({ dynamic: true }))
        //         .setDescription('You can buy and sell stuff!')
        //         .setFooter('Current page: -/-', message.author.displayAvatarURL({ dynamic: true }));

        //     items.map(item => {
        //         let name = item.name;
        //         let buy = item.buy;
        //         let sell = item.sell;
        //         let icon = item.icon;
        //         let description = item.description
        //         marketEmbed.addField(`${icon} ${name}`, `${description}\n> **Buy:** ${buy}:sparkles: || **Sell:** ${sell}:sparkles:`)
        //     })  

        //     message.channel.send({ embeds: [marketEmbed] })
        // }
    }
}