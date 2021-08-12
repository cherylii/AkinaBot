module.exports = {
    name: "rep",
    aliases: [],
    description: "Give someone a heart for their amazing-ness!",
    usage: {"[\@user]" : "User that you want to nominate!"},
    subcommands: {},
    category: "Currency",
    args: true,
    cooldown: 43200,
    guildOnly: true,
    execute(client, message, args, currency, category, distube, tmpMsg) {
        message.channel.send(":x: Database under maintenance!")
    //     if (!message.mentions.users.size) return message.channel.send(`:x: You must mention a user to rep them!`)
    //     const target = message.mentions.users.first()
    //     currency.addRep(target.id)
    //     return message.channel.send(`:heart: You have added reputation to **${target.username}**!`)
    }
}