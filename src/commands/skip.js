const { Permissions } = require('discord.js');
const Discord = require('discord.js')
const { prefix, token, colorHex } = require('../config.json');
module.exports = {
    name: "skip",
    aliases: [],
    description: "I will skip the current song!",
    usage: {},
    subcommands: {},
    category: "Music",
    args: false,
    cooldown: 5,
    guildOnly: true,
    execute(client, message, args, currency, category, distube, tmpMsg) {
        const skipSong = () => {
            let prevSong = distube.getQueue(message).songs[0]
            distube.getQueue(message).songs[1] == undefined ? distube.stop(message) : distube.skip(message)
            skipEmbed = new Discord.MessageEmbed()
                .setColor(colorHex)
                .setAuthor('Skipped playing this song ', message.author.displayAvatarURL({ dynamic: true }))
                .setThumbnail(prevSong.thumbnail)
                .setDescription(`**[${prevSong.name}](${prevSong.url})** (${prevSong.formattedDuration || "Infinite"})\n:headphones: **Queued by:** ${prevSong.user.tag} :headphones: **Skipped by:** ${message.author.tag}`)
            message.channel.send({ embeds: [skipEmbed] })
                .then(msg => setTimeout(() => {
                    msg.delete()
                }, 30000))
        }
        let queue = distube.getQueue(message)
        message.guild.members.fetch(queue.previousSongs.length ? queue.previousSongs[0] : queue.songs[0])
            .then((initMember) => {
                if (!queue) return message.channel.send(":x: There are no songs in queue!");
                if (!message.guild.me.voice.channel) return message.channel.send(":x: **I am not in a voice channel**");
                if (!initMember.voice.channel || (queue.songs[0].user.id == message.member.id)) return skipSong()
                if ((message.guild.me.voice.channel.id !== initMember.voice.channel.id) || (!message.member.permissions.has(Permissions.FLAGS.MOVE_MEMBERS, true) && message.member != message.guild.ownerId && message.member.id != initMember.id)) 
                return message.channel.send(":x: **You do not have permissions to skip the song.**\nRequires `MOVE\_MEMBERS` or `ADMINISTRATOR`\n*Alternatively, only the queue initialiser or song queuer can skip the song, or anyone else after the queue initialiser has left.*").then(m => setTimeout(() => { m.delete() }, 30000))
                skipSong()
            })
    }
}