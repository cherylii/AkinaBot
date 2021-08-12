const Discord = require('discord.js');
const { prefix, token, colorHex } = require('../config.json');
module.exports = {
    name: "shuffle",
    aliases: ["sff"],
    description: "I will shuffle the current queue!",
    usage: {},
    subcommands: {},
    category: "Music",
    args: false,
    cooldown: 5,
    guildOnly: true,
    execute(client, message, args, currency, category, distube, tmpMsg) {
        let queue = distube.getQueue(message)
        if (!queue) return message.channel.send(":x: There is nothing in queue!");
        distube.shuffle(message)
        let start = 1
        let listed = 6
        let description = ""
        const current = queue.songs.slice(start, start + listed) //number to show
        const nextSongEmbed = new Discord.MessageEmbed()
            .setAuthor(`Shuffled Queue for ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
            .setColor(colorHex)
            .setThumbnail(`https://i.imgur.com/FWKIR7N.png`)
        description += `:sparkles: *It's sparklingly new and shuffled!* \n:notes: *The next six songs in queue!* \n`
        current.forEach(s => description += `:small_orange_diamond: **${start++}.** (${s.formattedDuration || "Infinite"}) **[${s.name.slice(0, 28) + "..."}](${s.url})**\n`)
        description += `:headphones: **Shuffled by:** ${message.author.tag} :headphones: **Playing in:** ${message.guild.me.voice.channel.name || "No channel :("}`
        nextSongEmbed.setDescription(description)
        message.channel.send({ embeds: [nextSongEmbed] });
    }
}