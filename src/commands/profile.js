const { prefix, colorHex } = require('../config.json');
// const { Op } = require('sequelize');
// const { Users, UserProfiles } = require('../database/dbProfileObjects.js');
const Discord = require('discord.js');
module.exports = {
    name: "profile",
    aliases: [],
    description: "Get the profile of a user! Learn more about your friends!",
    usage: { "<anything>": "Anything!" },
    subcommands: {},
    category: "Currency",
    args: false,
    cooldown: 5,
    guildOnly: false,
    async execute(client, message, args, currency, category, distube, tmpMsg) {
        message.channel.send(":x: Database under maintenance!")
        // const profileArgs = message.content.slice(prefix.length).trim().split(/ +/); //args = array
        // const profileName = profileArgs.shift().toLowerCase();  

        // const target = message.mentions.users.first() || message.author
        // const user = await Users.findOne({ where: { user_id: target.id } })
        // if (!user) return message.channel.send('**It seems that I don\'t have a cache for this profile...**\nI\'ll create an entry in the database for it right now!\nPlease try again!');
        // await user.addProfile()
        
        // if (args[0] && args[0] == 'description') {
        //     let description = message.content.slice(prefix.length + profileName.length + args[0].length + 3);
        //     if (description.length > 250) return message.channel.send(`**:x: Your desired description is too long!**\n_Should be under 250 characters_`);
        //     await user.addDescription(description)
        //     message.channel.send(`Successfully set description to: **${description}**\nCheck your profile with \`akina profile\``);
        // }

    }
}