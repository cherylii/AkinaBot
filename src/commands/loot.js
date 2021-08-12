module.exports = {
    name: "loot",
    aliases: [],
    description: "Search for fallen stars! It is tiring though. Do take a break!",
    usage: {},
    subcommands: {},
    category: "Currency",
    args: false,
    cooldown: 300,
    guildOnly: false,
    execute(client, message, args, currency, category, distube, tmpMsg) {
        message.channel.send(":x: Database under maintenance!")
        // let lootFloor = 25;
        // let lootCeiling = 75;
        // let lootAmount = Math.floor(Math.random() * (lootCeiling - lootFloor + 1)) + lootFloor;
        // currency.add(message.author.id, lootAmount)
        // currency.addExp(message.author.id, lootAmount/5)
        
        // return message.channel.send(`:sparkles: You looted **${lootAmount} stars!**`);
    }
}