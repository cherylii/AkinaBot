const Discord = require('discord.js');
const { prefix, colorHex } = require('../config.json');

const AdditionalHelp = new Discord.MessageActionRow().addComponents(new Discord.MessageButton()
					.setLabel('More Information')
					.setStyle('LINK')
                    .setURL('https://github.com/faythlii/AkinaBot'));

module.exports = {
    name: "help",
    aliases: ["commands"],
    description: "Shows my all my commands and more about a specific command! I can do quite a bit...",
    usage: {"<command>" : "Command that you are learning about"},
    subcommands: {},
    category: "Information",
    args: false,
    cooldown: 5,
    guildOnly: false,
    execute(client, message, args, currency, category, distube, tmpMsg) {
        
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            const allHelpEmbed = new Discord.MessageEmbed()
                .setColor(colorHex)
                .setAuthor(`Akina's Sparkly Help!`, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`Here is what I can do for you!\nDo \`${prefix}help <command>\` to learn more about a specific command!\nWrap items in "quotes" if it has spaces`)
                .setFooter('Thanks for keeping akina ❤️', message.guild.iconURL());

            for (const item of category) {
                let category = item[0];
                let name = item[1]
                allHelpEmbed.addField(`${category} Commands`, `${name}`)
            }
            data.push(allHelpEmbed)
        }
        else {
            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

            if (!command) {
                return message.channel.send(":x: I-I can\'t find that command!")
            }
            
            var outputSubcommand = "";
            const subcommandK = Object.keys(command.subcommands);
            const subcommandV = Object.values(command.subcommands);
            for (var i = 0; i < subcommandK.length; i++) outputSubcommand += `:small_orange_diamond: \`${subcommandK[i]}\` - ${subcommandV[i]}\n`

            var outputUsage = Object.keys(command.usage).join(" ")

            var outputParameter = "";
            const parameterK = Object.keys(command.usage);
            const parameterV = Object.values(command.usage);
            for (var i = 0; i < parameterK.length; i++) {
            outputParameter += `\`${parameterK[i]}\` - ${parameterV[i]}\n`
            }

            if (args[1] == "-i" || args[1] == "-info") {
                const helpEmbed = new Discord.MessageEmbed()
                    .setColor(colorHex)
                    .setAuthor(`Help -- \`${command.name}\` command -- detailed`, message.author.displayAvatarURL({ dynamic: true }))
                    .addFields(
                        { name: 'Description', value: command.description || `No description` },
                        { name: 'Aliases', value: command.aliases.length ? command.aliases.toString() : "Does\'t have an alias!" },
                        { name: 'Usage', value: outputUsage ? `${outputUsage}\n_\`<> - optional\`_\n_\`[] - required\`_\n` : `Not Required!`},
                        { name: 'Sub-Commands', value: outputSubcommand.length ? `**Append the main command to use!**\n${outputSubcommand}` : `None!` },
                        { name: 'Category', value: command.category || `General` },
                        { name: 'Cooldown', value: (`${command.cooldown}` || 5) + " seconds" },
                        { name: 'Guild-only?', value: command.guildOnly ? "True" : "False" },
                    )
                    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));
                    data.push(helpEmbed);
            } else {
                const helpEmbed = new Discord.MessageEmbed()
                    .setColor(colorHex)
                    .setAuthor(`Command help for ${command.name}!`)
                    .setDescription(`\n**${command.description}**\n\nExclude <> and [] from the command\nYou can do \`${prefix}help [command] -info\` for even more detailed info`)
                    .addFields(
                        { name: 'Usage', value: outputUsage ? `${outputUsage}\n_\`<> - optional\`_\n_\`[] - required\`_\n` : `Not Required!`},
                        { name: 'Parameters', value: outputParameter ? `${outputParameter}` : `None!`},
                        { name: 'Sub-Commands', value: outputSubcommand ? `**Append the main command to use these.**\n${outputSubcommand}` : `None!` },
                    )
                    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));
                    data.push(helpEmbed)
            }
        }

        if (message.channel.type === 'DM') {
            return message.author.send({ embeds: data, components: [AdditionalHelp] }, { split: true })
        }
        else {
            return message.channel.send({ embeds: data, components: [AdditionalHelp] }, { split: true })
                .catch(error => {
                    console.error(`I failed to send help message to ${message.author.tag}.\n`, error);
                    message.reply({ content: ':x: I-I failed to send the help!', allowedMentions: { repliedUser: false }});
                })
        }
    }

}