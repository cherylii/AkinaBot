module.exports = {
    name: "leave",
    aliases: [],
    description: "I will leave the voice channel I am in!",
    usage: {},
    subcommands: {},
    category: "Music",
    args: false,
    cooldown: 5,
    guildOnly: true,
    execute(client, message, args, currency, category, distube, tmpMsg) {
        message.channel.send(`:x: This command has been deprecated, please use a!stop instead`)
//         if (!message.guild.me.voice.channel) return message.channel.send(":x: I'm not in a Voice Channel!")
//         if (message.guild.voice.channel !== message.member.voice.channel) return message.channel.send(":x: You must be in the same channel as me!")
//         console.log(message.guild.voice.channel);
//         message.guild.voice.channel.leave();
//             return message.channel.send("I wish you goodbye!");
    }
}