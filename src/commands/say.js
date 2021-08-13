const { Permissions } = require('discord.js');
const Discord = require('discord.js')
const { prefix } = require('../config.json');
module.exports = {
    name: "say",
    aliases: ["repeat", "broadcast"],
    description: "I will repeat what you say! Anything! ...",
    usage: {
        "<subcommand>": "Subcommand to use",
        "<anything>": "Anything!"
    },
    subcommands: {
        "in:": "Sends message to mentioned channel instead. An example of this will be \`in:<#channelId>\`",
        "mention:": "Mentions the role/user before the message. An example of this will be \`mention:<@&roleID>\` or \`mention:<@!userID>\`"
    },
    category: "Fun",
    args: false,
    cooldown: 5,
    guildOnly: false,
    execute(client, message, args, currency, category, distube, tmpMsg) {
        const allArgs = args.join("")
        const sayArgs = message.content.slice(prefix.length).trim().split(/ +/); //args = array
        const sayName = sayArgs.shift().toLowerCase();  //messy code

        let messageContent = message.content.slice(prefix.length + sayName.length + 1).trim();
        let sentChannel = message.channel.id
        let mentionedOutput = "";

        //user mention
        if (allArgs.length && !(allArgs.search(/mention:<@!\d{18}>/) == -1)) { mentionedOutput = `${allArgs.slice(allArgs.search(/<@!\d{18}>/), allArgs.search(/<@!\d{18}>/) + 22)}\n`; messageContent = messageContent.slice(31).trim(); }
        //role mention
        if (allArgs.length && !(allArgs.search(/mention:<@&\d{18}>/) == -1)) { mentionedOutput = `${allArgs.slice(allArgs.search(/<@&\d{18}>/), allArgs.search(/<@&\d{18}>/) + 22)}\n`; messageContent = messageContent.slice(30).trim(); }
        //everyone and here mention
        if (allArgs.length && !(allArgs.search(/mention:@everyone/) == -1)) { if (!message.member.permissions.has(Permissions.FLAGS.MENTION_EVERYONE, true) && message.member != message.guild.ownerId) return message.channel.send(":x: You do not have permissions to mention everyone!\nRequires `MENTION\_EVERYONE`"); mentionedOutput = `@everyone\n`; messageContent = messageContent.slice(17).trim(); }
        if (allArgs.length && !(allArgs.search(/mention:@here/) == -1)) { if (!message.member.permissions.has(Permissions.FLAGS.MENTION_EVERYONE, true) && message.member != message.guild.ownerId) return message.channel.send(":x: You do not have permissions to mention here!\nRequires `MENTION\_EVERYONE`"); mentionedOutput = `@here\n`; messageContent = messageContent.slice(13).trim(); }

        if (allArgs.length && !(allArgs.search(/in:<#\d{18}>/) == -1)) {
            const mentionedChannelID = allArgs.slice(allArgs.search(/<#\d{18}>/), allArgs.search(/<#\d{18}>/) + 21).replace(/[\\<>@#&!]/g, "");
            sentChannel = mentionedChannelID
            messageContent = messageContent.slice(24).trim()
            if (!(client.channels.cache.get(sentChannel).guild.id == message.guild.id)) return message.channel.send(":x: I can only send messages within the same server!");
            if ((!client.channels.cache.get(sentChannel).permissionsFor(message.member).has(Permissions.FLAGS.SEND_MESSAGES, true) || !client.channels.cache.get(sentChannel).permissionsFor(message.member).has(Permissions.FLAGS.VIEW_CHANNEL, true)) && message.member != message.guild.ownerId) return message.channel.send(":x: You do not have permission to send messages to that channel!\nRequires `VIEW\_CHANNEL` and `SEND\_MESSAGES`");
        }
        
        if (mentionedOutput.length + messageContent.length)
            client.channels.cache.get(sentChannel).send(`${mentionedOutput}${messageContent}`)
                .catch(err => { console.log(err); return message.channel.send(":x: I-I couldn't find the channel, or I was lacking permissions"); });
        else
            message.channel.send("Nothing...? O-ops...");
    }
}