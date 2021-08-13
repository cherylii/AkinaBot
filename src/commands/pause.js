const Discord = require('discord.js');
const { prefix, token, colorHex } = require('../config.json');
module.exports = {
    name: "pause",
    aliases: [],
    description: "I will pause/resume the queue!",
    usage: {},
    subcommands: {},
    category: "Music",
    args: false,
    cooldown: 5,
    guildOnly: true,
    execute(client, message, args, currency, category, distube, tmpMsg) {
        let queue = distube.getQueue(message)
        if (!queue) return message.channel.send(":x: There is nothing in queue!");
        queue.paused ? distube.resume(message) : distube.pause(message)
        const pauseEmbed = new Discord.MessageEmbed()
            .setAuthor(`${queue.pause ? ` Paused the queue` : "Resumed the queue"} for ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
            .setColor(colorHex)
            .setThumbnail(queue.songs[0].thumbnail)
            .setDescription(`${queue.paused ? `:pause_button: The queue has been **paused**` : `:arrow_forward: The queue has been **resumed**`}\n**[${queue.songs[0].name}](${queue.songs[0].url})** (${queue.songs[0].formattedDuration || "Infinite"})\n:headphones: **Queued by:** ${queue.songs[0].user.tag} :headphones: **Playing in:** ${message.guild.me.voice.channel.name || "No channel :("}`)
        message.channel.send({ embeds: [pauseEmbed] })
            .then((m) => {
                if (queue.paused) return tmpMsg.set(m.guild.id, m.id)
                else {
                    client.guilds.cache.get(m.guild.id).channels.cache.get(m.channel.id).messages.fetch(tmpMsg.get(m.guild.id)).then(msg => msg.delete())
                    setTimeout(() => {
                        msg.delete()
                    }, 45000)
                }
            })
    }
}