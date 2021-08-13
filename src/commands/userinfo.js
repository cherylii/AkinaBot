const { Permissions } = require('discord.js');
const Discord = require('discord.js')
const { colorHex } = require('../config.json');
module.exports = {
    name: 'userinfo',
    aliases: [],
    description: 'Get the discord information of a member! Learn more about their discord accounts!',
    usage: { "<\@user>": "User that you want to search up" },
    subcommands: {"-i" : "Get more information about the user!"},
    category: "Information",
    args: false,
    cooldown: 5,
    guildOnly: true,
    execute(client, message, args, currency, category, distube, tmpMsg) {
        let targetMember = message.mentions.members.first() || message.member;
        let targetUser = targetMember.user;
        const iPos = message.mentions.members.first() ? '1' : '0'

        function formatDate(date) {
            var hours = date.getUTCHours()
            var minutes = date.getUTCMinutes()
            var seconds = date.getUTCSeconds()
            var ampm = hours >= 12 ? 'PM' : 'AM'
            hours = hours % 12
            hours = hours ? hours : 12
            minutes = minutes < 10 ? '0' + minutes : minutes
            seconds = seconds < 10 ? '0' + seconds : seconds
            var timeAMPM = `${hours}:${minutes}:${seconds} ${ampm}`
            return timeAMPM;
        }
        function dateOrdinal(date) {
            return date + (31 == date || 21 == date || 1 == date ? "st" : 22 == date || 2 == date ? "nd" : 23 == date || 3 == date ? "rd" : "th")
        }
        if (args[iPos] && args[iPos] == '-i' || args[iPos] == '-info') {
            if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES, true) && message.member != message.guild.ownerId) return message.channel.send(":x: You do not have the permissions to view detailed userinfo\nRequires `MANAGE\_ROLES`");
            let permissionOutput = targetUser.id == message.guild.ownerId ? '`OWNER` - Has every permission and is non-managable' : targetMember.permissions.has(Permissions.FLAGS.ADMINISTRATOR) ? '`ADMINISTRATOR` - Has every permission' : `\`${targetMember.permissions.toArray().join('` `')}\``;
            const userInfoEmbed = new Discord.MessageEmbed()
                .setColor(colorHex)
                .setAuthor(`User info for ${targetUser.tag} -- Detailed`, targetUser.displayAvatarURL({ dynamic: true }))
                .setThumbnail(targetUser.displayAvatarURL())
                .setDescription(`
                :small_orange_diamond: **User ID:** ${targetUser.id}
                :small_orange_diamond: **Account Created:** ${dateOrdinal(targetUser.createdAt.getUTCDate())} ${targetUser.createdAt.toLocaleString('default', { month: 'long' })} ${targetUser.createdAt.getUTCFullYear()} ${formatDate(targetUser.createdAt)}
                :small_orange_diamond: **Account Age:** ${Math.floor((Date.now() - targetUser.createdAt) / (1000 * 60 * 60 * 24))} days
                :small_orange_diamond: **Guild Joined At:** ${dateOrdinal(targetMember.joinedAt.getUTCDate())} ${targetMember.joinedAt.toLocaleString('default', { month: 'long' })} ${targetMember.joinedAt.getUTCFullYear()} ${formatDate(targetMember.joinedAt)}
                :small_orange_diamond: **Age in Guild:** ${Math.floor((Date.now() - targetMember.joinedAt) / (1000 * 60 * 60 * 24))} days
                :small_orange_diamond: **Name in Guild:** ${targetMember.displayName}
                :small_orange_diamond: **Is Guild Owner:** ${targetUser.id == message.guild.ownerId ? 'Yes' : 'No'}
                :small_orange_diamond: **Is Member Managable:** ${targetMember.manageable ? 'Yes' : 'No'}
                :small_orange_diamond: **In Voice Channel:** ${targetMember.voice.channel ? targetMember.voice.channel.name : 'None'}
                :small_orange_diamond: **Highest Role:** ${targetUser.id === message.guild.ownerId ? "**SERVER OWNER**" : targetMember.roles.highest.toString() || ""} (${targetUser.id === message.guild.ownerId ? 999 : targetMember.roles.highest.position || 0})
                :small_orange_diamond: **Role Color:** ${targetMember.displayHexColor.toUpperCase()}`)
                .addField(`User Flags:`, `\`${targetUser.flags? targetUser.flags.toArray().join('` `'): "None"}\``)
                .addField(`Roles: [${targetMember.roles.cache.map(roles => `${roles}`).slice(0, -1).length}]`, `${targetMember.roles.cache.map(roles => `${roles}`).slice(0, -1).join(' ')}`)   
                .addField(`Permissions:`, `${permissionOutput}`);
            return message.channel.send({ embeds: [userInfoEmbed] })
        }
        else {
            if (message.mentions.users.size) if (message.mentions.users.first().id != args[0].replace(/[\\<>@#&!]/g, "" && (args[1] == "-info" || args[1] == "-i"))) return message.channel.send(`:x: Please mention a user before appending \`-info\``);
            const userInfoEmbed = new Discord.MessageEmbed()
                .setColor(colorHex)
                .setAuthor(`${targetMember.displayName}'s user info`, targetUser.displayAvatarURL({ dynamic: true }))
                .setThumbnail(targetUser.displayAvatarURL())
                .setDescription(`
                :small_orange_diamond: **User ID:** ${targetUser.id}
                :small_orange_diamond: **Account Created:** ${dateOrdinal(targetUser.createdAt.getUTCDate())} ${targetUser.createdAt.toLocaleString('default', { month: 'long' })} ${targetUser.createdAt.getUTCFullYear()} ${formatDate(targetUser.createdAt)}
                :small_orange_diamond: **Account Age:** ${Math.floor((Date.now() - targetUser.createdAt) / (1000 * 60 * 60 * 24))} days
                :small_orange_diamond: **Guild Joined At:** ${dateOrdinal(targetMember.joinedAt.getUTCDate())} ${targetMember.joinedAt.toLocaleString('default', { month: 'long' })} ${targetMember.joinedAt.getUTCFullYear()} ${formatDate(targetMember.joinedAt)}
                :small_orange_diamond: **In Voice Channel:** ${targetMember.voice.channel ? targetMember.voice.channel.name : 'None'}
                :small_orange_diamond: **Role Color:** ${targetMember.displayHexColor.toUpperCase()}`)
                .addField(`Roles: [${targetMember.roles.cache.map(roles => `${roles}`).slice(0, -1).length}]`, `${targetMember.roles.cache.map(roles => `${roles}`).slice(0, -1).join(' ')}`)
            return message.channel.send({ embeds: [userInfoEmbed] })
        }
    }
}