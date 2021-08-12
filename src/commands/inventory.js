const { colorHex } = require('../config.json');
// const { Users, CurrencyShop } = require('../database/dbShopObjects.js');
const Discord = require('discord.js');
module.exports = {
    name: "inventory",
    aliases: ["inv","bag"],
    description: "Check your inventory! Have you restocked on health potions yet?",
    usage: {"<\@user>" : "User's inventory that you want to search"},
    subcommands: {},
    category: "Currency",
    args: false,
    cooldown: 5,
    guildOnly: false,
    async execute(client, message, args, currency, category, distube, tmpMsg) {
        message.channel.send(":x: Database under maintenance!")
        // const target = message.mentions.users.first() || message.author;
        // const user = await Users.findOne({ where: { user_id: target.id } });
        // const items = await user.getItems();

        // if (!items.length) {
        //     if(!target == message.author)
        //         return message.channel.send(`${target.tag} has nothing!`);
        //         return message.channel.send(`You have nothing!`)
        //     }
        // return message.channel.send(`${target.username}'s inventory' ${items.map(i => `${i.item.icon} x${i.amount}`).join('  ')}`);
    }
}