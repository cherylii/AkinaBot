const Discord = require('discord.js');
const { prefix, token, colorHex } = require('../config.json');
module.exports = {
    name: "autoplay",
    aliases: [],
    description: "I will autoplay songs after the queue!",
    usage: {},
    subcommands: {},
    category: "Music",
    args: false,
    cooldown: 5,
    guildOnly: true,
    execute(client, message, args, currency, category, distube, tmpMsg) {
        let queue = distube.getQueue(message)
        if (!queue) return message.channel.send(":x: There is nothing in queue!");
        distube.toggleAutoplay(message)
        const autoplayEmbed = new Discord.MessageEmbed()
            .setAuthor(`Toggled autoplay for ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
            .setColor(colorHex)
            .setDescription(`:arrow_forward: Autoplay has been toggled: **${queue.autoplay ? "True" : "False"}**\n*Autoplay adds similar songs into the queue*\n*Repeat should be turned off for autoplay to work*\n:headphones: **Toggled by:** ${message.author.tag} :headphones: **Playing in:** ${message.guild.me.voice.channel.name || "No channel :("}`)
        message.channel.send({ embeds: [autoplayEmbed] });
    }
}