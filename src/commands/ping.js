const Discord = require('discord.js');
const { colorHex } = require('../config.json');
module.exports = {
    name: "ping",
    aliases: ["pong"],
    description: "Check my ping! That's how fast I'll respond back to you!",
    usage: {},
    subcommands: {},
    category: "Information",
    args: false,
    cooldown: 5,
    guildOnly: false,
    execute(client, message, args, currency, category, distube, tmpMsg) {

        function pingEmbed() {
            return new Discord.MessageEmbed()
                .setColor(colorHex)
                .setAuthor(`${response}`, messageAuthor.displayAvatarURL({ dynamic: true }))
                .setDescription("`Akina's ping!  -- " + (Date.now() - message.createdAt || "None").toString() + " ms`\n`API ping! -- " + (Math.round(client.ws.ping) || "None").toString() + " ms`")
                .setFooter(`Requested by ${messageAuthor.tag}`, messageAuthor.displayAvatarURL({ dynamic: true }))
                .setTimestamp(true)
        }

        const choices = ["I'm Akina and I\'m... lagging?", "Eek, is it good?", "Oh no, I hope it isn\'t terrible..."];
        const response = choices[Math.floor(Math.random() * choices.length)];
        const messageAuthor = message.author

        return message.channel.send("Pinging")
            .then(message => {
                message.edit({ content:'Done pinging!', embeds: [pingEmbed()] })
            })
            .catch(error => {
                console.error("I-I couldn\'t ping...\n", error);
                message.channel.send(":x: I-I failed to ping... Sorry!")
            })

    }
}
