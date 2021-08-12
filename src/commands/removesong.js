const { Permissions } = require('discord.js');
const Discord = require('discord.js')
const { prefix, token, colorHex } = require('../config.json');

//items
const backButton = new Discord.MessageButton({
    style: 'SECONDARY',
    label: 'Back',
    emoji: '⬅️',
    customId: 'back'
})
const forwardButton = new Discord.MessageButton({
    style: 'SECONDARY',
    label: 'Next',
    emoji: '➡️',
    customId: 'forward'
})

module.exports = {
    name: "removesong",
    aliases: [],
    description: "I will remove a song from the queue!",
    usage: {},
    subcommands: {},
    category: "Music",
    args: false,
    cooldown: 5,
    guildOnly: true,
    execute(client, message, args, currency, category, distube, tmpMsg) {
        const removeSong = (index) => {
            let removedSong = queue.songs.splice(index, 1)
            const removeEmbed = new Discord.MessageEmbed()
                .setColor(colorHex)
                .setAuthor('Removed this song from queue', message.guild.iconURL({ dynamic: true }))
                .setThumbnail(removedSong[0].thumbnail)
                .setDescription(`**[${removedSong[0].name}](${removedSong[0].url})** (${removedSong[0].formattedDuration || "Infinite"})\n:headphones: **Queued by:** ${removedSong[0].user.tag} :headphones: **Removed by:** ${message.author.tag}`)
            message.channel.send({ embeds: [removeEmbed] })
                .then(msg => setTimeout(() => {
                    msg.delete()
                }, 60000))
        }
        const generateEmbed = start => {
            let description = ""
            const current = queue.songs.slice(start, start + listed) //number to show
            const embed = new Discord.MessageEmbed()
                .setAuthor(`Removing song: type the song number`, message.author.displayAvatarURL({ dynamic: true }), 'https://i.imgur.com/Y1TdsEd.png')
                .setColor(colorHex)
                .setThumbnail(`https://i.imgur.com/FWKIR7N.png`)
                .setFooter(`📖 Pages ${Math.ceil((start - 1 + listed) / listed)} of ${Math.ceil(queue.songs.length / listed)} 📖 Songs ${start}-${start - 1 + current.length} of ${queue.songs.length - 1}`)
            if (current.length == 0) description += `:sparkles: *It's sparklingly clean and empty!* \n:notes: *Add more songs to the queue!* \n:small_orange_diamond: *They will show up here!*`
            current.forEach(s => description += `:small_orange_diamond: **${start++}.** (${s.formattedDuration || "Infinite"}) **[${s.name.slice(0, 28) + "..."}](${s.url})**\n`)
            embed
                .setDescription(description)
                .addField(`:satellite: **Currently playing**`, `**[${currentSong.name}](${currentSong.url})** (${currentSong.formattedDuration || "Infinite"})\n:headphones: **Queued by:** ${currentSong.user.tag} :headphones: **Playing in:** ${message.guild.me.voice.channel.name || "No channel :("}`)
            return embed
        }
        let memberMessage = message
        let listed = 10
        let queue = distube.getQueue(message)
        if (!queue) return message.channel.send(":x: There is nothing in queue!");
        let currentSong = queue.songs[0]
        const author = message.author
        if (!message.guild.me.voice.channel) return message.channel.send(":x: **I am not in a voice channel**");
        message.channel.send({ embeds: [generateEmbed(1)], components: (queue.songs.length <= listed) ? [] : [new Discord.MessageActionRow({ components: [forwardButton] })] }).then(message => {
            setTimeout(() => message.delete(), 60000)
            if (!(queue.songs.length <= listed)) {
                const collector = message.createMessageComponentCollector({
                    filter: ({ user }) => user.id === author.id,
                    time: 60000,
                    dispose: true
                })
                let currentIndex = 0
                collector.on('collect', interaction => {
                    interaction.customId === 'back' ? (currentIndex -= listed) : (currentIndex += listed)
                    interaction.update({
                        embeds: [generateEmbed(currentIndex)],
                        components: [
                            new Discord.MessageActionRow({
                                components: [
                                    ...(currentIndex ? [backButton] : []),
                                    ...(currentIndex + listed < queue.songs.length ? [forwardButton] : [])
                                ]
                            })
                        ]
                    })
                })
            }
            msgFilter = (msg) => { return msg.author.id == author.id }
            const messageCollector = memberMessage.channel.createMessageCollector({ filter: msgFilter, time: 60000, max: 1 })
            messageCollector.on('collect', (message) => {
                message.guild.members.fetch(queue.previousSongs.length ? queue.previousSongs[0] : queue.songs[0])
                    .then((initMember) => {
                        if (isNaN(message.content)) return message.channel.send(":x: **Please input a number**");
                        if (Number(message.content) > queue.songs.length) return message.channel.send(":x: **That song number is not in queue**");
                        if (!initMember.voice.channel || (queue.songs[Number(message.content)].user.id == message.member.id));
                        else if ((memberMessage.guild.me.voice.channel.id !== initMember.voice.channel.id) || (!memberMessage.member.permissions.has(Permissions.FLAGS.MOVE_MEMBERS, true) && memberMessage.member != memberMessage.guild.ownerId && memberMessage.member.id != initMember.id))
                            return memberMessage.channel.send(":x: **You do not have permissions to remove the song.**\nRequires `MOVE\_MEMBERS` or `ADMINISTRATOR`\n*Alternatively, only the queue initialiser and song queuer can remove the song, or anyone else after the queue initialiser has left.*").then(m => setTimeout(() => { m.delete() }, 30000))
                        removeSong(Number(message.content))
                    })
            })
        })
    }
}