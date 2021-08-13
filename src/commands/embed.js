const Discord = require('discord.js');
const { Permissions } = require('discord.js')
const { prefix } = require('../config.json');
module.exports = {
    name: "embed",
    aliases: [],
    description: "I will create an embed based on the options you provided! You can omit options that you don't want! Options don't have to be in any order!** \nDo `a!embed help` to see the syntax! \nDo `a!embed example` to see an example embed! \n**All urls must be full and img links must be direct**",
    usage: {
        "[subcommand] <subcommand> ...": "options for the embed, see subcommands!",
    },
    subcommands: {
        "color:": "Color of embed in HEX",
        "title:": "Title of embed",
        "titleURL:": "Link of clickable title",
        "author:": "Author of embed, optionally img and url, in { curly brackets } \n*eg. { author:shimakaze, img:<imgLink>, link:<link> }*",
        "description:": "Description of embed",
        "thumbnail:": "Link of an image at right of embed",
        "field:": "Fields with title and value, optionally inline, in { curly brackets } \nCan create empty field with only inline. Can have multiple fields \n*eg. { title:adven 1, value:I was sailing... }*",
        "fieldIMG:": "Link of an Image below fields",
        "timestamp:": "Time when embed is created. True or false",
        "footer:": "Footer of embed, optionally img, in { curly brackets } \n*eg. { footer:bye!, img:<imgLink> }*",
    },
    category: "Fun",
    args: true,
    cooldown: 5,
    guildOnly: false,
    execute(client, message, args, currency, category, distube, tmpMsg) {
        function validURL(str) {
            if (str.trim() == "") return true
            var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
            return !!pattern.test(str);
        }

        const allArgs = args.join(" ")
        const sayArgs = message.content.slice(prefix.length).trim().split(/ +/); //args = array
        const sayName = sayArgs.shift().toLowerCase();  //messy code
        const generatedEmbed = new Discord.MessageEmbed()

        let messageContent = message.content.slice(prefix.length + sayName.length + 1).trim();
        let sentChannel = message.channel.id
        let mentionedOutput = "";
        let errorMsg = "";

        if (args.length && (args[0].toLowerCase() == "example")) {
            let exampleMessage = "**The following is an example of how embed would look like and the options used**\nLine breaks were added to help visualisation but make sure that the space after the comma ` , ` is there when using a line break!\n\n"
            switch (args[1]) {
                default:
                    exampleMessage += "Here, some options are intentionally left in even when not in use, but can be omitted otherwise. You can leave some options empty, but not all of them. \n**Remember to escape with `\\: \\, \\{ \\}` if you are using them asthetically in your embed!** \n\na!embed color:#be82ff , \ntitle:Adventures with Shimakaze! , \ntitleURL:https://kancolle-anime.jp/ , \nauthor:{ author:IJN Shimakaze, img:https://cdn.awwni.me/y1cg.jpg, url:https://kancolle-anime.jp/ } , \ndescription:It's me! The one and only Shimakaze class Destroyer! I was the fastest destroyer of my time, carrying the most torpedoes! Unfortunately, I was sunk but let's not talk about that... , \nthumbnail:https://cdn.awwni.me/y1cg.jpg , \nfield:{ title:Shima Adventure 1!, value:Yay I was built! I feel so aliveee! } , \nfield:{ title:Shima Adventure 2!, value:The other destroyers are so slowww! uwu } , \nfield:{ inline:true } , \nfield:{ inline:true } , \nfield:{ title:Signed by\\\\:, value:Shimakaze!, inline:true } , \nfieldimg: , \nfooter: { footer:That's it for now! Byeeee! }"
                    let exampleEmbed = new Discord.MessageEmbed()
                        .setColor('#be82ff')
                        .setTitle("Adventures with Shimakaze!")
                        .setURL("https://kancolle-anime.jp/")
                        .setAuthor('IJN Shimakaze', 'https://cdn.awwni.me/y1cg.jpg', 'https://kancolle-anime.jp/')
                        .setDescription("It's me! The one and only Shimakaze class Destroyer! I was the fastest destroyer of my time, carrying the most torpedoes! Unfortunately, I was sunk but let's not talk about that...")
                        .setThumbnail('https://cdn.awwni.me/y1cg.jpg')
                        .addField('Shima Adventure 1!', 'Yay I was built! I feel so aliveee!')
                        .addField('Shima Adventure 2!', 'The other destroyers are so slowww! uwu')
                        .addField('\u200b', '\u200b', true)
                        .addField('\u200b', '\u200b', true)
                        .addField('Signed by:', 'Shimakaze!', true)
                        .setImage('')
                        .setTimestamp(false)
                        .setFooter("That's it for now! Byeeee!", 'https://cdn.awwni.me/y1cg.jpg')
                    return message.channel.send({ content: exampleMessage, embeds: [exampleEmbed] })
            }
        }

        if (allArgs.length && !(allArgs.search(/in:<#\d{18}>/) == -1)) {
            const mentionedChannelID = allArgs.slice(allArgs.search(/<#\d{18}>/), allArgs.search(/<#\d{18}>/) + 21).replace(/[\\<>@#&!]/g, "");
            sentChannel = mentionedChannelID
            messageContent = messageContent.slice(24).trim()
            if (!(client.channels.cache.get(sentChannel).guild.id == message.guild.id)) return message.channel.send(":x: I can only send messages within the same server!");
            if ((!client.channels.cache.get(sentChannel).permissionsFor(message.member).has(Permissions.FLAGS.SEND_MESSAGES, true) || !client.channels.cache.get(sentChannel).permissionsFor(message.member).has(Permissions.FLAGS.VIEW_CHANNEL, true)) && message.member != message.guild.ownerId) 
            return message.channel.send(":x: You do not have permission to send messages to that channel!\nRequires `VIEW\_CHANNEL` and `SEND\_MESSAGES`");
        }

        if (allArgs.length) {
            embedOptions = messageContent.trim().split(" , ")
            for (option of embedOptions) {
                const optionName = option.slice(0, option.search(':')).trim().toLowerCase()
                const optionParam = option.slice(option.search(':') + 1).trim()
                switch (optionName) {
                    case "color":
                        /^#[0-9A-F]{6}$/i.test(optionParam.trim()) ? generatedEmbed.setColor(optionParam) : errorMsg += `:x: Invalid HEX color code!\n Error at \`${option}\`!\n`
                        break;
                    case "title":
                        (optionParam && optionParam.trim() != "") ? generatedEmbed.setTitle(optionParam) : errorMsg += `:x: Title cannot be empty!\n Error at \`${option}\`!\n`
                        break;
                    case "titleurl":
                        validURL(optionParam) ? generatedEmbed.setURL(optionParam) : errorMsg += `:x: Invalid URL in \`titleURL\`!\n Error at \`${option}\`!\n`
                        break;
                    case "author":
                        var optionParamJson = optionParam.replace(/\s*(?<!\\){\s*/g, '{"').replace(/\s*(?<!\\):s*/g, '":"').replace(/\s*(?<!\\)}/g, '"}').replace(/(?<!\\),\s*/g, '","').replace(/https":"\/\//g, 'https://').replace(/http":"\/\//g, 'http://').replace(/\\:/g, ':').replace(/\\,/g, ',').replace(/\\{/, '{').replace(/\\}/, '}')
                        try { var optionJson = JSON.parse(optionParamJson); }
                        catch { return message.channel.send(":x: Something went wrong with parsing input!\nCheck your syntax at Author!") }
                        (optionJson.author && optionJson.author.trim() != "") ? generatedEmbed.setAuthor(optionJson.author, optionJson.img, optionJson.url) : `:x: Author in \`author\` cannot be empty!\n Error at \`${option}\`!\n`
                        break;
                    case "description":
                        (optionParam && optionParam.trim() != "") ? generatedEmbed.setDescription(optionParam) : errorMsg += `:x: Description cannot be empty!\n Error at \`${option}\`!\n`
                        break;
                    case "thumbnail":
                        validURL(optionParam) ? generatedEmbed.setThumbnail(optionParam) : errorMsg += `:x: Invalid URL in \`thumbnail\`!\n Error at \`${option}\`!\n`
                        break;
                    case "field":
                        var optionParamJson = optionParam.replace(/\s*(?<!\\){\s*/g, '{"').replace(/\s*(?<!\\):s*/g, '":"').replace(/\s*(?<!\\)}/g, '"}').replace(/(?<!\\),\s*/g, '","').replace(/https":"\/\//g, 'https://').replace(/http":"\/\//g, 'http://').replace(/\\:/g, ':').replace(/\\,/g, ',').replace(/\\{/, '{').replace(/\\}/, '}')
                        // console.log(optionParamJson);
                        try { var optionJson = JSON.parse(optionParamJson); }
                        catch { return message.channel.send(":x: Something went wrong with parsing input!\nCheck your syntax at Field!") }
                        ((optionJson.title && optionJson.title.trim() != "") && (optionJson.value && optionJson.value.trim() != "")) ? generatedEmbed.addField(optionJson.title, optionJson.value, (optionJson.inline && optionJson.inline.toLowerCase() == 'true') ? true : false) :
                            (!optionJson.title && !optionJson.value && (optionJson.inline && optionJson.inline.trim() != "")) ? generatedEmbed.addField('\u200b', '\u200b', (optionJson.inline && optionJson.inline.toLowerCase() == 'true') ? true : false) :
                                errorMsg += `:x: Title & Value cannot be empty!\n Error at \`${option}\`!\n`
                        break;
                    case "fieldimg":
                        validURL(optionParam) ? generatedEmbed.setImage(optionParam) : errorMsg += `:x: Invalid URL in \`fieldIMG\`!\n Error at \`${option}\`!\n`
                        break;
                    case "timestamp":
                        optionParam.toLowerCase() == "true" ? generatedEmbed.setTimestamp() : errorMsg += `:x: Timestamp must be true, and can be omitted otherwise!\n Error at \`${option}\`!\n`
                        break;
                    case "footer":
                        var optionParamJson = optionParam.replace(/\s*(?<!\\){\s*/g, '{"').replace(/\s*(?<!\\):s*/g, '":"').replace(/\s*(?<!\\)}/g, '"}').replace(/(?<!\\),\s*/g, '","').replace(/https":"\/\//g, 'https://').replace(/http":"\/\//g, 'http://').replace(/\\:/g, ':').replace(/\\,/g, ',').replace(/\\{/, '{').replace(/\\}/, '}')
                        try { var optionJson = JSON.parse(optionParamJson); }
                        catch { return message.channel.send(":x: Something went wrong with parsing input!\nCheck your syntax at Footer!") }
                        (optionJson.footer && optionJson.footer.trim() != "") ? generatedEmbed.setFooter(optionJson.footer, optionJson.img) : `:x: Footer in \`footer\` cannot be empty!\n Error at \`${option}\`!\n`
                        break;
                    default:
                        errorMsg += `:x: Invalid option!\n Error at \`${option}\`!\n`
                }
            }
        }

        errorMsg != "" ? message.channel.send(errorMsg) : ""
        client.channels.cache.get(sentChannel).send({ embeds: [generatedEmbed] })
            .catch(err => { console.log(err); return message.channel.send(":x: I-I couldn't find the channel, or I was lacking permissions"); });
    }
}