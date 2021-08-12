require('events').EventEmitter.defaultMaxListeners = 20;

const fs = require('fs');
const Discord = require('discord.js');
const DisTube = require('distube')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { SpotifyPlugin } = require('@distube/spotify')
const { Intents } = require('discord.js')

const { prefix, token, colorHex } = require('./config.json');

const client = new Discord.Client({ allowedMentions: { parse: ['users', 'roles'], repliedUser: true }, intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const currency = new Discord.Collection();
const category = new Discord.Collection();
const tmpMsg = new Discord.Collection();

const distube = new DisTube.default(client, {
    searchSongs: 10,
    emitNewSongOnly: false,
    leaveOnEmpty: true,
    leaveOnFinish: true,
    emptyCooldown: 0,
    leaveOnFinish: true,
    leaveOnStop: true,
    emitAddSongWhenCreatingQueue: true,
    emitAddListWhenCreatingQueue: true,
    plugins: [new SoundCloudPlugin(), new SpotifyPlugin({ parallel: true, emitEventsAfterFetching: false })],
});

//items
const backButton = new Discord.MessageButton({
    style: 'SECONDARY',
    label: 'Back',
    emoji: '⬅️',
    customId: 'back'
})
const forwardButton = new Discord.MessageButton({
    style: 'SECONDARY',
    label: 'Next',
    emoji: '➡️',
    customId: 'forward'
})
const infoButton = new Discord.MessageButton({
    style: 'SECONDARY',
    label: 'Info',
    emoji: 'ℹ',
    customId: 'info'
})

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);

    let commandsNames = `${category.get(command.category)} \`${command.name}\``;
    if (category.get(command.category) == undefined) commandsNames = `\`${command.name}\``;
    category.set(command.category, commandsNames);
}

client.on('ready', async () => {
    console.log("Kyahahahaha!")

    const guildId = client.guilds.cache.map(guild => guild.id)
    guildId.forEach(g => tmpMsg.set(g, null))

    // const storedBalances = await Users.findAll();
    // storedBalances.forEach(b => currency.set(b.user_id, b));

    const activity = require('../assets/texts/activity.json');
    const activityIndex = Math.floor(Math.random() * (activity['activity'].length - 1) + 1);
    client.user.setActivity(`a!help | ${activity['activity'][activityIndex]['activity']} | [${activity['activity'][activityIndex]['number']}]`, { type: 'LISTENING' });
    // client.user.setActivity(`a!help | On ${client.guilds.cache.size} servers! | [0]`)
    setInterval(() => {
        var activityIndex = Math.floor(Math.random() * (activity['activity'].length - 1) + 1);
        client.user.setActivity(`a!help | ${activity['activity'][activityIndex]['activity']} | [${activity['activity'][activityIndex]['number']}]`, { type: 'LISTENING' });
    }, 2400000);
});

client.on('messageCreate', message => {
    // currency.addExp(message.author.id, Math.floor(Math.random() * (3)));
})

client.on('messageCreate', async message => {
    if ((!message.content.startsWith(prefix) && !(message.content === "<@!776735927229087764>")) || message.author.bot) return;
    // console.log(`${message.author.id}: ${message.content}`);

    const args = message.content.slice(prefix.length).trim().split(/ +/); //args = array
    if (args[0] === '' || message.content === '<@!776735927229087764>') return message.channel.send(`**Hiii ${message.author.tag}, did you call me? I'm Akina!**\nDo \`a! help\` to see what I can do!\nDo \`a! prefix\` to set a guild-wide prefix!`);
    const commandName = args.shift().toLowerCase(); //pulls out the first thing after the prefix: command name

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName) && cmd.aliases != "");
    if (!command) return

    if (command.args && !args.length) {
        let reply = `:x: **I need arguments for this command!**`

        if (command.usage) {
            var outputUsage = Object.keys(command.usage).join(" ")
            reply += `\n\nYou should use it like this!\n\`${prefix} ${command.name} ${outputUsage}\``
        }

        return message.channel.send(reply);
    }

    if (command.guildOnly && message.channel.type == 'DM') {
        return message.reply({ content: ":x: **I can\'t execute that command in DMs!**", allowedMentions: { repliedUser: false } })
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            const hoursLeft = Math.floor(timeLeft / 3600);
            const minutesLeft = Math.floor((timeLeft - (Math.floor(timeLeft / 3600) * 3600)) / 60)
            const secondsLeft = Math.floor(timeLeft - (Math.floor(((timeLeft - (Math.floor(timeLeft / 3600) * 3600)) / 60) + hoursLeft * 60) * 60))

            var output = ``
            if (!hoursLeft == 0) output += `${hoursLeft} hours, ${minutesLeft} minutes, ${secondsLeft} seconds!**`
            else if (!minutesLeft == 0) output += `${minutesLeft} minutes, ${secondsLeft} seconds!**`
            else output += `${secondsLeft} seconds!**`

            return message.channel.send(`:x: W-We are going too fast!\n**You can use this command again in ${output}`)
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(client, message, args, currency, category, distube, tmpMsg);
    }
    catch (error) {
        console.error(error);
        message.reply({ content: ':x: **I-I failed to execute that command...**', allowedMentions: { repliedUser: false } });
    }
});

distube
    .on("playSong", (queue, song) => {
        distube.voices.get(queue.textChannel.guild.id).setSelfDeaf(true)
        const playSongEmbed = new Discord.MessageEmbed()
            .setColor(colorHex)
            .setAuthor('Playing the current song', song.user.displayAvatarURL({ dynamic: true }))
            .setThumbnail(song.thumbnail)
            .setDescription(`**[${song.name}](${song.url})** (${song.formattedDuration || "Infinite"})\n:headphones: **Queued by:** ${song.user.tag} :headphones: **Playing in:** ${queue.voiceChannel.name || "No channel :("}`)
        queue.textChannel.send({ embeds: [playSongEmbed] })
            .then(msg => setTimeout(() => {
                msg.delete()
            }, song.duration * 999))
    })
    .on("addSong", (queue, song) => {
        const addSongEmbed = new Discord.MessageEmbed()
            .setColor(colorHex)
            .setAuthor('Added song to the queue', song.member.user.displayAvatarURL({ dynamic: true }))
            .setThumbnail(song.thumbnail)
            .setDescription(`**[${song.name}](${song.url})** (${song.formattedDuration || "Infinite"})\n:headphones: **Queued by:** ${song.user.tag}`)
        queue.textChannel.send({ embeds: [addSongEmbed] });
    })
    .on("addList", (queue, playlist) => {
        let author = playlist.user
        let listed = 6
        const generateEmbed = start => {
            if (start == -1) {
                const frontEmbed = new Discord.MessageEmbed()
                    .setColor(colorHex)
                    .setAuthor('Added playlist to the queue', playlist.member.user.displayAvatarURL({ dynamic: true }))
                    .setThumbnail(playlist.thumbnail.url)
                    .setDescription(`**[${playlist.name}](${playlist.url})** [${playlist.songs.length} songs] (${playlist.formattedDuration || "Infinite"})\n:headphones: **Queued by:** ${playlist.user.tag}`)
                    .setFooter("Next page for songs~")
                return frontEmbed
            }
            else {
                let description = ""
                const current = playlist.songs.slice(start, start + listed) //number to show
                const embed = new Discord.MessageEmbed()
                    .setAuthor('Showing the added playlist', playlist.user.displayAvatarURL({ dynamic: true }))
                    .setColor(colorHex)
                    .setFooter(`📖 Pages ${(start + listed) / listed} of ${Math.ceil(playlist.songs.length / listed)} 📖 Songs ${start + 1}-${start + current.length} of ${playlist.songs.length}`)
                current.forEach(s => description += `:small_orange_diamond: **${++start}.** (${s.formattedDuration || "Infinite"}) **[${s.name}](${s.url})**\n`)
                embed.setDescription(description)
                return embed
            }
        }
        queue.textChannel.send({ embeds: [generateEmbed(-1)], components: [new Discord.MessageActionRow({ components: [infoButton] })] }).then(message => {
            setTimeout(() => message.delete(), 60000)
            if (playlist.songs.length <= listed) return;

            const collector = message.createMessageComponentCollector({
                filter: ({ user }) => user.id === author.id,
                time: 90000,
                dispose: true
            })
            let currentIndex = -listed
            collector.on('collect', interaction => {
                interaction.customId === 'back' ? (currentIndex -= listed) : (currentIndex += listed)
                interaction.update({
                    embeds: [generateEmbed(currentIndex)],
                    components: [
                        new Discord.MessageActionRow({
                            components: [
                                ...(currentIndex ? [backButton] : []),
                                ...(currentIndex + listed < playlist.songs.length ? [forwardButton] : [])
                            ]
                        })
                    ]
                })
            })
        })
    })

    .on("searchResult", (message, result) => {
        let author = message.author
        let listed = 5
        const generateEmbed = start => {
            let description = ""
            const current = result.slice(start, start + listed) //number to show
            const embed = new Discord.MessageEmbed()
                .setAuthor('Song selection: type the song number', message.author.displayAvatarURL({ dynamic: true }), 'https://i.imgur.com/SpMwKXm.png')
                .setColor(colorHex)
                .setThumbnail(`https://i.imgur.com/FWKIR7N.png`)
                .setFooter(`📖 Pages ${(start + listed) / listed} of ${Math.ceil(result.length / listed)} 📖 Songs ${start + 1}-${start + current.length} of ${result.length}`)
            current.forEach(r => description += `:small_orange_diamond: **${++start}.** **[${r.name}](${r.url})** (${r.formattedDuration || "Infinite"})\n`)
            embed.setDescription(description)
            return embed
        }
        message.channel.send({ embeds: [generateEmbed(0)], components: (result.length <= listed) ? [] : [new Discord.MessageActionRow({ components: [forwardButton] })] }).then(message => {
            setTimeout(() => message.delete(), 60000)
            if (result.length <= listed) return;

            const collector = message.createMessageComponentCollector({
                filter: ({ user }) => user.id === author.id,
                time: 60000,
                dispose: true
            })
            let currentIndex = 0
            collector.on('collect', interaction => {
                interaction.customId === 'back' ? (currentIndex -= listed) : (currentIndex += listed)
                interaction.update({
                    embeds: [generateEmbed(currentIndex)],
                    components: [
                        new Discord.MessageActionRow({
                            components: [
                                ...(currentIndex ? [backButton] : []),
                                ...(currentIndex + listed < result.length ? [forwardButton] : [])
                            ]
                        })
                    ]
                })
            })
        })
    })
    .on("empty", queue => {
        const emptyEmbed = new Discord.MessageEmbed()
            .setAuthor('Left the voice channel by inactivity', message.guild.me.user.displayAvatarURL({ dynamic: true }))
            .setColor(colorHex)
            .setDescription(`:sparkles: *It's sparklingly empty in here...* \n:notes: *Hope you enjoyed the music!* \n:wave: *See you again another time~*`)
        queue.textChannel.send({ embeds: [emptyEmbed] })
    })
    .on("searchCancel", (message) => message.channel.send(`:white_check_mark: Song selection canceled`))
    .on("searchInvalidAnswer", (message) => message.channel.send(`:x: You didn't select a valid song!`))
    .on("searchNoResult", () => { })
    .on("searchDone", () => { })
    .on("finish", (queue) => {
        const finishEmbed = new Discord.MessageEmbed()
            .setAuthor(`Finished playing songs in ${queue.textChannel.guild.name}`, client.user.displayAvatarURL({ dynamic: true }))
            .setColor(colorHex)
            .setDescription(`:headphones: *Thanks for listening with Akina!*\n:notes: *Hope you enjoyed the music!* \n:wave: *See you again another time~*`)
        queue.textChannel.send({ embeds: [finishEmbed] })
    })

client.login(token);