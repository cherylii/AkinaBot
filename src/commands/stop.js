const { Permissions } = require('discord.js');
const Discord = require('discord.js')
const { prefix, token, colorHex } = require('../config.json');
const queue = require('./queue');
module.exports = {
    name: "stop",
    aliases: [],
    description: "I will stop playing music!",
    usage: {},
    subcommands: {},
    category: "Music",
    args: false,
    cooldown: 5,
    guildOnly: true,
    execute(client, message, args, currency, category, distube, tmpMsg) {
        const stopQueue = () => {
            distube.stop(message);
            const stopEmbed = new Discord.MessageEmbed()
                .setAuthor(`Stopped the queue in ${message.guild.name}`, message.guild.me.user.displayAvatarURL({ dynamic: true }))
                .setColor(colorHex)
                .setDescription(`:notes: *Hope you enjoyed the music!* \n:wave: *See you again another time~*\n:headphones: **Stopped by:** ${message.author.tag}`)
            message.channel.send({ embeds: [stopEmbed] })
        }
        let queue = distube.getQueue(message)
        message.guild.members.fetch(queue.previousSongs.length ? queue.previousSongs[0] : queue.songs[0])
            .then((initMember) => {
                if (!queue) return message.channel.send(":x: There are no songs in queue!");
                if (!message.guild.me.voice.channel) return message.channel.send(":x: **I am not in a voice channel**");
                if (!initMember.voice.channel) return stopQueue()
                if ((message.guild.me.voice.channel.id !== initMember.voice.channel.id) || (!message.member.permissions.has(Permissions.FLAGS.MOVE_MEMBERS, Permissions.FLAGS.ADMINISTRATOR) && message.member != message.guild.ownerId && message.member.id != initMember.id)) 
                return message.channel.send(":x: **You do not have permissions to stop the queue.**\nRequires `MOVE\_MEMBERS` or `ADMINISTRATOR`\n*Alternatively, only the queue initialiser can stop the queue, or anyone else if the queue initialiser has left.*").then(m => setTimeout(() => { m.delete() }, 30000))
                stopQueue()
            })
    }
}