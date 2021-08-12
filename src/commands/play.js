module.exports = {
    name: "play",
    aliases: ["p"],
    description: "I will play the song that you requested!",
    usage: { "[song name/url]": "Name of the song you want to play" },
    subcommands: {"$related": "Add a related song to the queue!" },
    category: "Music",
    args: true,
    cooldown: 5,
    guildOnly: true,
    execute(client, message, args, currency, category, distube, tmpMsg) {
        const queue = distube.getQueue(message.guild.id)
        if (message.member.voice.channel) {
            if (!message.member.voice.channel.permissionsFor(message.client.user).has("CONNECT")) return message.channel.send(`**I-I can't connect to ${message.author.tag}'s Voice Channel!**\nMissing permissions!`);
            if (!message.member.voice.channel.permissionsFor(message.client.user).has("SPEAK")) return message.channel.send(`**I-I can't speak in ${message.author.tag}'s Voice Channel!**\nMissing permissions!`);
        }
        else return message.channel.send(":x: **You are not in a Voice Channel**")
        if (args[0] === "$related" && queue.playing)
            distube.addRelatedSong(queue)
        else
            distube.play(message, args.join(""))
    }
}