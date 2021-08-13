const { prefix, colorHex } = require('../config.json');
const { Permissions } = require('discord.js');
const Discord = require('discord.js')
module.exports = {
    name: "kick",
    aliases: [],
    description: "Kicks a member from the server, A good warning for them.",
    usage: { "[\@user]": "User that you want to kick" },
    subcommands: {},
    category: "Moderation",
    args: true,
    cooldown: 5,
    guildOnly: true,
    execute(client, message, args, currency, category, distube, tmpMsg) {
        const kickArgs = message.content.slice(prefix.length).trim().split(/ +/); //args = array
        const kickName = kickArgs.shift().toLowerCase();  //messy code
        const kickPlayer = kickArgs.shift().toLowerCase();
        const messageAuthor = message.author;
        if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS, true) && message.member != message.guild.ownerId) return message.channel.send(":x: You do not have permissions to kick members!\nRequires `KICK\_MEMBERS`");
        let user = message.guild.members.cache.get(message.mentions.users.first().id);
        let kickReason = message.content.slice(prefix.length + kickName.length + kickPlayer.length + 3);
        if (!(message.member.roles.highest.position > user.roles.highest.position)) return message.channel.send(":x: You do not have permissions to kick this member!\nRole hierarchy same or lower!")

        if (!kickReason) kickReason = "None";
        if (!user || !message.guild.members.cache.get(user.id))
            return message.channel.send(":x: I-I can\'t find that user")

        user.kick({ reason: kickReason })
            .then(() => {

                const embed = new Discord.MessageEmbed()
                    .setColor(colorHex)
                    .setTitle(":white_check_mark: I have kicked a user")
                    .addFields(
                        { name: "Staff member responsible", value: messageAuthor.tag },
                        { name: "Member who was kicked", value: message.mentions.users.first().tag },
                        { name: "Reason for kick", value: kickReason },
                    )
                    .setTimestamp()
                    .setFooter(`kicked by ${messageAuthor.tag}`, messageAuthor.displayAvatarURL({ dynamic: true }))

                message.channel.send({ embeds: [embed] });
            })
            .catch(error => {
                message.channel.send(":x: I-I failed to do that... Do I have the permissions?");
                console.error("I-I failed to kick\n", error);
            });

    }
}