const Discord = require('discord.js');
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
    customId: 'next'
})

module.exports = {
    name: "queue",
    aliases: ["q"],
    description: "I will display the current queue!",
    usage: {},
    subcommands: {},
    category: "Music",
    args: false,
    cooldown: 5,
    guildOnly: true,
    execute(client, message, args, currency, category, distube, tmpMsg) {
        let queue = distube.getQueue(message)
        let currentSong = queue.songs[0]
        let listed = 10
        const formatTime = timeLeft => {
            let daysLeft = Math.floor(timeLeft / (3600 * 24))
            let hoursLeft = Math.floor(timeLeft % (3600 * 24) / 3600)
            let minutesLeft = Math.floor(timeLeft % 3600 / 60)
            let secondsLeft = Math.floor(timeLeft % 60)
            var daysLeftD = daysLeft > 0 ? daysLeft + (daysLeft == 1 ? " day, " : " days, ") : ""
            var hoursLeftD = hoursLeft > 0 ? hoursLeft + (hoursLeft == 1 ? " hour, " : " hours, ") : ""
            var minutesLeftD = minutesLeft > 0 ? minutesLeft + (minutesLeft == 1 ? " minute, " : " minutes, ") : ""
            var secondsLeftD = secondsLeft > 0 ? secondsLeft + (secondsLeft == 1 ? " second" : " seconds") : ""
            return (daysLeftD + hoursLeftD + minutesLeftD + secondsLeftD).replace(/,\s*$/, "")
        }
        const generateEmbed = start => {
            let description = ""
            const current = queue.songs.slice(start, start + listed) //number to show
            const embed = new Discord.MessageEmbed()
                .setAuthor(`Queue for ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
                .setColor(colorHex)
                .setThumbnail(`https://i.imgur.com/FWKIR7N.png`)
                .setFooter(`📖 Pages ${Math.ceil((start - 1 + listed) / listed)} of ${Math.ceil(queue.songs.length / listed)} 📖 Songs ${start}-${start - 1 + current.length} of ${queue.songs.length - 1}`)
                if (current.length == 0) description += `:sparkles: *It's sparklingly clean and empty!* \n:notes: *Add more songs to the queue!* \n:small_orange_diamond: *They will show up here!*`
            current.forEach(s => description += `:small_orange_diamond: **${start++}.** (${s.formattedDuration || "Infinite"}) **[${s.name.slice(0,28)+"..."}](${s.url})**\n`)
            embed
                .setDescription(description)
                .addField(`:satellite: **Currently playing**`, `**[${currentSong.name}](${currentSong.url})** (${currentSong.formattedDuration || "Infinite"})\n:headphones: **Queued by:** ${currentSong.user.tag} :headphones: **Playing in:** ${message.guild.me.voice.channel.name || "No channel :("}`)
                .addField(`:clock4: **Total queue duration**`, `${formatTime(queue.duration) || "Infinite"}`)
                .addField(`:dvd: **Filter / Pause**`, `\`${queue.filter || `None`} / ${queue.paused ? `True` : `False`}\``, true)
                .addField(`:repeat: **Repeat / Autoplay**`,`${queue.repeatMode ? queue.repeatMode == 2 ? "\`Queue" : "\`Song" : "\`False"} / ${queue.autoplay ? "True" : "False"}\``, true)
            return embed
        }
        const author = message.author
        message.channel.send({ embeds: [generateEmbed(1)], components: (queue.songs.length <= listed) ? [] : [new Discord.MessageActionRow({ components: [forwardButton] })] }).then(message => {
            setTimeout(() => message.delete(), 120000)
            if (queue.songs.length <= listed) return;

            const collector = message.createMessageComponentCollector({
                filter: ({ user }) => user.id === author.id,
                time: 120000,
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
        })
    }
}