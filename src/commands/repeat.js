const Discord = require('discord.js');
const { prefix, token, colorHex } = require('../config.json');
module.exports = {
    name: "repeat",
    aliases: ["loop"],
    description: "I repeat the queue or song!",
    usage: { "<subcommand>": "Subcommand to use" },
    subcommands: {
        "false": "Stops repeating the song or queue.",
        "song": "Repeats the current song in the queue.",
        "queue": "Repeats the current queue. The default option if no parameters are provided."
    },
    category: "Music",
    args: false,
    cooldown: 5,
    guildOnly: true,
    execute(client, message, args, currency, category, distube, tmpMsg) {
        const formatTime = timeLeft => {
            let daysLeft = Math.floor(timeLeft / (3600 * 24))
            let hoursLeft = Math.floor(timeLeft % (3600 * 24) / 3600)
            let minutesLeft = Math.floor(timeLeft % 3600 / 60)
            let secondsLeft = Math.floor(timeLeft % 60)
            var daysLeftD = daysLeft > 0 ? daysLeft + (daysLeft == 1 ? " day, " : " days, ") : ""
            var hoursLeftD = hoursLeft > 0 ? hoursLeft + (hoursLeft == 1 ? " hour, " : " hours, ") : ""
            var minutesLeftD = minutesLeft > 0 ? minutesLeft + (minutesLeft == 1 ? " min, " : " mins, ") : ""
            var secondsLeftD = secondsLeft > 0 ? secondsLeft + (secondsLeft == 1 ? " sec" : " secs") : ""
            return (daysLeftD + hoursLeftD + minutesLeftD + secondsLeftD).replace(/,\s*$/, "")
        }
        const generateEmbed = repeatMode => {
            let descriptionAddons = ""
            descriptionAddons += repeatMode ? repeatMode == 2 ? `:small_orange_diamond: *You can add more songs, they will be repeated*` : `**[${queue.songs[0].name}](${queue.songs[0].url})** (${queue.songs[0].formattedDuration || "Infinite"})\n:headphones: **Queued by:** ${queue.songs[0].user.tag} :headphones: **Playing in:** ${message.guild.me.voice.channel.name || "No channel :("}` : `:satellite: Queue autoplay mode: **${queue.autoplay ? "True" : "False"}**\n*Autoplay adds related videos automatically*`
            const repeatEmbed = new Discord.MessageEmbed()
                .setColor(colorHex)
                .setAuthor(`Changed repeat mode for ${message.guild.name}`, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`:repeat: Repeat mode updated: ${repeatMode ? repeatMode == 2 ? `**Queue**\n${descriptionAddons}` : `**Song**\n${descriptionAddons}` : `**False**\n${descriptionAddons}`}\n:headphones: **Changed by:** ${message.author.tag}`)
            repeatMode ? repeatMode == 2 ? repeatEmbed.addField(`:clock4: **Total queue duration**`, `${formatTime(queue.duration)}`, true).addField(`:star: **Total songs**`, `${queue.songs.length} song(s)`, true) : repeatEmbed.setThumbnail(queue.songs[0].thumbnail) : ""
            return repeatEmbed
        }
        let queue = distube.getQueue(message)
        if (!queue) return message.channel.send(":x: There is nothing in queue!");
        let setRepeatMode = 0
        switch (args[0]) {
            case "false":
                setRepeatMode = 0
                break;
            case "song":
                setRepeatMode = 1
                break;
            case "queue":
                setRepeatMode = 2
                break;
            default:
                setRepeatMode = 2
        }
        distube.setRepeatMode(message, setRepeatMode)
        return message.channel.send({ embeds: [generateEmbed(queue.repeatMode)] })
    }
}