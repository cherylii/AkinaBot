const axios = require('axios')
function formRequest(keywords, limit = 15) {
    return `http://api.search.nicovideo.jp/api/v2/video/contents/search?q=${keywords}&targets=title&fields=contentId,title&_sort=-viewCounter&_limit=${limit}&_context=discordbot`
}
module.exports = {
    name: "playnico",
    aliases: ["pni"],
    description: "I will play the niconico song that you requested!",
    usage: { "[song name/url]": "Name of the song you want to play" },
    subcommands: {},
    category: "Music",
    args: true,
    cooldown: 5,
    guildOnly: true,
    execute(client, message, args, currency, category, distube, tmpMsg) {
        message.channel.send("Command is still under construction!")
    //     if (message.member.voice.channel) {
    //         if (!message.member.voice.channel.permissionsFor(message.client.user).has("CONNECT")) return message.channel.send(`**I-I can't connect to ${message.author.tag}'s Voice Channel!**\nMissing permissions!`);
    //         if (!message.member.voice.channel.permissionsFor(message.client.user).has("SPEAK")) return message.channel.send(`**I-I can't speak in ${message.author.tag}'s Voice Channel!**\nMissing permissions!`);
    //     }
    //     else return message.channel.send(":x: **You are not in a Voice Channel**")
    //     axios.get(formRequest(search, limit))
    //         .then((response) => {
                
    //         })
    //     distube.play(message,)

    }
}