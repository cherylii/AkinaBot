const { prefix, colorHex } = require('../config.json');
const Discord = require('discord.js')
const { Permissions } = require('discord.js');
module.exports = {
    name: "ban",
    aliases: [],
    description: "Bans a member from the server, rule violators arn't welcome.",
    usage: { "[\@user]": "User that you want to ban" },
    subcommands: {},
    category: "Moderation",
    args: true,
    cooldown: 5,
    guildOnly: true,
    execute(client, message, args, currency, category, distube, tmpMsg) {

        const banArgs = message.content.slice(prefix.length).trim().split(/ +/); //args = array
        const banName = banArgs.shift().toLowerCase();  //messy code
        const banPlayer = banArgs.shift().toLowerCase();
        const messageAuthor = message.author;

        if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS, true) && message.member != message.guild.ownerId) return message.channel.send(":x: You do not have permissions to ban members!\nRequires `BAN\_MEMBERS`");
        let user = message.guild.members.cache.get(message.mentions.users.first().id);
        let banReason = message.content.slice(prefix.length + banName.length + banPlayer.length + 3);
        if (!(message.member.roles.highest.position > user.roles.highest.position)) return message.channel.send(":x: You do not have permissions to kick this member!\nRole hierarchy same or lower!")

        if (!banReason) banReason = "None";
        if (!user || !message.guild.members.cache.get(user.id))
            return message.channel.send(":x: I-I can\'t find that user")

        user.ban({ reason: banReason })
            .then(() => {

                const embed = new Discord.MessageEmbed()
                    .setColor(colorHex)
                    .setTitle(":white_check_mark: I have banned a user")
                    .addFields(
                        { name: "Staff member responsible", value: messageAuthor.tag },
                        { name: "Member who was banned", value: message.mentions.users.first().tag },
                        { name: "Reason for ban", value: banReason },
                    )
                    .setTimestamp()
                    .setFooter(`Banned by ${messageAuthor.tag}`, messageAuthor.displayAvatarURL({ dynamic: true }))

                message.channel.send({ embeds: [embed] });
            })
            .catch(error => {
                message.channel.send(":x: I-I failed to do that... Do I have the permissions?");
                console.error("I-I failed to ban\n", error);
            });

    }
}