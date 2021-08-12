module.exports = {
    name: "join",
    aliases: [],
    description: "I will join the voice channel you are in!",
    usage: {},
    subcommands: {},
    category: "Music",
    args: false,
    cooldown: 5,
    guildOnly: true,
    execute(client, message, args, currency, category, distube, tmpMsg) {
        message.channel.send(`:x: This command has been deprecated, please use a!play instead`);
    //     if (message.member.voice.channel) {
    //         if (!message.member.voice.channel.permissionsFor(message.client.user).has("CONNECT")) return message.channel.send(`**I-I can't connect to ${message.author.tag}'s Voice Channel!**\nMissing permissions!`);
    //         if (!message.member.voice.channel.permissionsFor(message.client.user).has("SPEAK")) return message.channel.send(`**I-I can't speak in ${message.author.tag}'s Voice Channel!**\nMissing permissions!`);
    //         message.member.voice.channel.join()
    //             .then(() => {
    //                 return message.channel.send("Do \`akina play <url/song name>\` for me to play music!");
    //             })
    //             .catch(error => {
    //                 message.channel.send(":x: I-I failed to do that... Do I have the permissions?\nPerhaps I timed out... eek");
    //                 console.error("I-I failed to join a voice channel\n", error);
    //             });
    //     }
    //     else return message.channel.send(":x: You are not in a Voice Channel")
    //         .catch(error => {
    //             message.channel.send(":x: I-I failed to do that... Do I have the permissions?");
    //             console.error("I-I failed to join\n", error);
    //         });
    }
}