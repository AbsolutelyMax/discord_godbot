"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const client = new Discord.Client();
const ytsearchimport = require("youtube-search");
const yt = require("ytdl-core");
const Collections = require("typescript-collections");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("./config.json", "UTF-8"));
const profiles = JSON.parse(fs.readFileSync("./profiles.json", "UTF-8"));
const commands = new Collections.Dictionary();
const queue = [];
const ytsearchoptions = { maxResults: 5, key: config.youtubeKey };
var curstream;
var outputVolume = config.defaultVolume;
var curyoutubemessage;
var curyoutubemessagecollector;
var curhelpmessage;
var Emojis = {
    Number: "%E2%83%A3",
    Ten: "%F0%9F%94%9F",
    Stop: "%E2%97%BC",
    Pause: "%E2%8F%B3",
    Skip: "%E2%8F%A9",
    Game: "%F0%9F%8E%AE",
    Waste: "%F0%9F%97%91"
};
function ytSearch(searchquery, cb) {
    ytsearchimport(searchquery, ytsearchoptions, cb);
}
function ytStop() {
    queue.length = 0;
    curstream.end();
}
function ytPlay(msg, str) {
    if (msg.member.voiceChannel == null) {
        msg.channel.send("get in a channel shithead");
        return;
    }
    msg.member.voiceChannel.join().then(connection => {
        client.guilds.first().member(client.user).setDeaf(true);
        if (queue.length == 0 && (curstream == null || curstream.destroyed))
            playAudio(str, connection, msg.channel);
        else {
            yt.getInfo(str, function (error, info) {
                if (error)
                    msg.channel.send("lmao video please");
                queue.push(str);
                msg.channel.send("Queued **" + info.title + "** by *" + info.author.name + "*");
            });
        }
    }).catch(console.error);
}
function createOrEditYoutubeMessage(channel, info) {
    return __awaiter(this, void 0, void 0, function* () {
        if (curyoutubemessage) {
            curyoutubemessage = yield curyoutubemessage.edit("Now playing **" + info.title + "**" + " by *" + info.author.name + "*");
            yield curyoutubemessage.clearReactions();
            yield curyoutubemessage.react(Emojis.Pause);
            yield curyoutubemessage.react(Emojis.Stop);
            yield curyoutubemessage.react(Emojis.Skip);
        }
        else
            channel.send("Now playing **" + info.title + "**" + " by *" + info.author.name + "*").then((message) => __awaiter(this, void 0, void 0, function* () {
                curyoutubemessage = message;
                yield message.react(Emojis.Pause);
                yield message.react(Emojis.Stop);
                yield message.react(Emojis.Skip);
                curyoutubemessagecollector = message.createReactionCollector((reaction, user) => !user.bot, {});
                curyoutubemessagecollector.on("collect", reaction => {
                    switch (reaction.emoji.identifier) {
                        case Emojis.Pause:
                            {
                                curstream.pause();
                                break;
                            }
                        case Emojis.Stop:
                            {
                                ytStop();
                                reaction.users.filter(value => !value.bot).forEach(value => reaction.remove(value));
                                break;
                            }
                        case Emojis.Skip:
                            {
                                curstream.end();
                                reaction.users.filter(value => !value.bot).forEach(value => reaction.remove(value));
                                break;
                            }
                    }
                });
            })).catch(console.error);
    });
}
function playNext() {
    if (queue.length == 0) {
        client.voiceConnections.first().disconnect();
        curyoutubemessagecollector.stop();
        curyoutubemessage.delete();
        return;
    }
    playAudio(queue[0], client.voiceConnections.first(), client.guilds.first().defaultChannel);
    queue.shift();
}
function playAudio(str, connection, channel) {
    yt.getInfo(str, function (error, info) {
        if (error) {
            channel.send("wtf is this link");
            return;
        }
        curstream = connection.playStream(yt(str, { filter: "audioonly", quality: "highest" }));
        curstream.addListener("end", playNext);
        curstream.setVolume(outputVolume);
        createOrEditYoutubeMessage(channel, info);
    });
}
function randomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function eightBall(arg) {
    var rNum = randomValue(1, 5);
    var rstr;
    switch (rNum) {
        case 1:
            rstr = "No";
            break;
        case 2:
            rstr = "Yes, " + arg;
            break;
        case 3:
            rstr = "Maybe";
            break;
        case 4:
            rstr = arg + " I think so";
            break;
        case 5:
            rstr = "I think not";
            break;
        default:
            rstr = "wtf bruH/ !!??";
    }
    return rstr;
}
function getEmojiFromString(emojiname) {
    client.guilds.first().emojis.forEach(function (emoji) {
        if (emoji.name === emojiname)
            return "<:" + emoji.identifier + ">";
    });
    return "";
}
function rollTheDice(dice) {
    let final = 0;
    for (var i = 0; i < dice; i++) {
        final += randomValue(1, 6);
    }
    return final;
}
function createNewProfile(userId, author) {
    let currentProfiles = profiles;
    let hasProfile = false;
    for (var i = 0; i < currentProfiles.length; i++) {
        if (Object.keys(currentProfiles[i])[0] === userId) {
            hasProfile = true;
        }
        else {
            hasProfile = false;
        }
    }
    if (hasProfile) {
        return "You already have an profile, access it by typing **>profile**";
    }
    else {
        var newUserObj = {
            [userId]: {
                "name": [author],
                "gender": "m",
                "motto": "No Motto",
                "xp": "0"
            }
        };
        currentProfiles.push(newUserObj); //undefined
        fs.writeFile('./profiles.json', JSON.stringify(currentProfiles), 'utf-8');
        hasProfile = false;
        return ("Profile created! Learn about profiles with **>phelp**");
    }
}
function setMotto(newMotto, userId) {
    let currentProfiles = profiles;
    let hasProfile = false;
    for (var i = 0; i < currentProfiles.length; i++) {
        if (Object.keys(currentProfiles[i])[0] === userId) {
            hasProfile = true;
        }
        else {
            hasProfile = false;
        }
    }
    //console.log("current motto: " + currentProfiles[0]["" + userId + ""].motto);
    if (hasProfile) {
        for (var i = 0; i < currentProfiles.length; i++) {
            //console.log(Object.keys(currentProfiles[i])[0] === userId);
            if (Object.keys(currentProfiles[i])[0] === userId) {
                currentProfiles[i]["" + userId + ""].motto = [newMotto];
                fs.writeFile('./profiles.json', JSON.stringify(currentProfiles), 'utf-8');
                console.log("motto set in func");
                return "Motto created: " + newMotto;
            }
        }
    }
    else {
        hasProfile = false;
        return "You do not have a profile. Create one with **>createProfile**";
    }
}
function getProfile(userId, image) {
    let currentProfiles = profiles;
    let hasProfile = false;
    for (var i = 0; i < currentProfiles.length; i++) {
        if (Object.keys(currentProfiles[i])[0] === userId) {
            hasProfile = true;
        }
        else {
            hasProfile = false;
        }
    }
    if (hasProfile) {
        for (var i = 0; i < currentProfiles.length; i++) {
            //console.log(Object.keys(currentProfiles[i])[0] === userId);
            if (Object.keys(currentProfiles[i])[0] === userId) {
                const embed = new Discord.RichEmbed()
                    .setTitle(currentProfiles[i]["" + userId + ""].name + "'s profile")
                    .setAuthor(userId, image)
                    .setColor(0x00AE86)
                    .setDescription(currentProfiles[i]["" + userId + ""].motto)
                    .setFooter("God has spoken", "http://i.imgur.com/yNz72fJ.jpg") //god image
                    .setThumbnail(image)
                    .setTimestamp()
                    .addField("Name", currentProfiles[i]["" + userId + ""].name, true)
                    .addField("Gender", currentProfiles[i]["" + userId + ""].gender, true)
                    .addField("Server XP", currentProfiles[i]["" + userId + ""].xp, true);
                return { embed };
            }
        }
    }
    else {
        return "You do not have a profile. Create one with **>createProfile**";
    }
}
client.on("ready", () => {
    commands.setValue("africa", function (msg, str) {
        msg.channel.send("https://www.youtube.com/watch?v=FTQbiNvZqaY");
    });
    /*
    commands[getEmojiFromString("therose")] = function(msg) {
      casting.cast(Discord.Message, msg).channel.send("nice emoji dude");
    }
    */
    commands.setValue("8ball", function (msg, str) {
        let ans = "";
        let postMsg = msg.content.slice(7);
        ans = eightBall(postMsg);
        msg.channel.send(ans);
    });
    commands.setValue("flip", function (msg, str) {
        var coin = (Math.floor(Math.random() * 2) == 0) ? 'heads' : 'tails';
        let result = coin.toString();
        msg.channel.send(result);
    });
    commands.setValue("roll", function (msg, str) {
        let sum = rollTheDice(parseInt(str));
        let result = sum.toString();
        msg.channel.send(result);
    });
    commands.setValue("createProfile", function (msg, str) {
        let result = createNewProfile(msg.author.id, msg.author.username);
        msg.channel.send(result);
    });
    commands.setValue("setMotto", function (msg, str) {
        let result = setMotto(str, msg.author.id);
        msg.channel.send(result);
    });
    commands.setValue("profile", function (msg, str) {
        let gotProfile = getProfile(msg.author.id, msg.author.avatarURL);
        console.log(gotProfile);
        msg.channel.send(gotProfile);
    });
    commands.setValue("play", function (msg, str) {
        ytPlay(msg, str);
    });
    commands.setValue("stop", function (msg, str) {
        ytStop();
        msg.delete();
    });
    commands.setValue("pause", function (msg, str) {
        curstream.pause();
        msg.delete();
    });
    commands.setValue("resume", function (msg, str) {
        curstream.resume();
        msg.delete();
    });
    commands.setValue("skip", function (msg, str) {
        curstream.end();
        msg.delete();
    });
    commands.setValue("volume", function (msg, str) {
        var num = parseInt(str);
        if (num > 100)
            num = 100;
        if (num < 0)
            num = 0;
        outputVolume = num;
        if (curstream != null)
            if (!curstream.destroyed)
                curstream.setVolume(outputVolume);
    });
    commands.setValue("about", function (msg, str) { msg.channel.send("lol im god don't fuck wit me"); });
    commands.setValue("gay", function (msg, str) {
        msg.channel.send("How gay is **" + str + "**?").then((message) => __awaiter(this, void 0, void 0, function* () {
            for (var i = 0; i < 10; i++)
                yield message.react(i + Emojis.Number); // fml utf 8 can suck my balls
            yield message.react(Emojis.Ten);
            const collecter = message.createReactionCollector((reaction, user) => !user.bot);
            collecter.on("collect", (reaction) => {
                var num;
                if (reaction.emoji.identifier.charAt(1) == 'F')
                    num = 10;
                else
                    num = parseInt(reaction.emoji.identifier.charAt(0));
                reaction.message.channel.send(str + " is " + (num == 0 ? 0 : num * 10) + " percent gay");
                collecter.stop();
            });
        })).catch(console.error);
    });
    commands.setValue("help", function (msg, str) {
        msg.channel.send("wat info u need").then((message) => __awaiter(this, void 0, void 0, function* () {
            curhelpmessage = message;
            yield message.react(Emojis.Game);
            yield message.react(client.emojis.find(emoji => emoji.name === "lilpump"));
            yield message.react(client.emojis.find(emoji => emoji.name === "yt"));
            yield message.react(Emojis.Waste);
            const collector = message.createReactionCollector((reaction, user) => !user.bot, {});
            collector.on("collect", (reaction) => __awaiter(this, void 0, void 0, function* () {
                if (reaction.emoji.name === "lilpump") {
                    curhelpmessage = yield message.edit("https://www.youtube.com/watch?v=T-J2PaQb6ZE");
                }
                else if (reaction.emoji.name === "yt") {
                    curhelpmessage = yield message.edit("**play <youtubelink>** | play a youtube video\n**skip** | skip current video\n**stop** | stop current video");
                }
                switch (reaction.emoji.identifier) {
                    case Emojis.Game:
                        {
                            curhelpmessage = yield message.edit("**dice** | roll the dice", {});
                            break;
                        }
                    case Emojis.Waste:
                        {
                            collector.stop();
                            curhelpmessage.delete();
                            break;
                        }
                }
            }));
        }));
    });
    commands.setValue("search", function (msg, str) {
        ytSearch(str, (error, resultarray) => {
            if (error)
                console.error(error);
            var cStr = "```";
            var n = 0;
            resultarray.forEach(result => {
                cStr += (n + 1) + ": " + result.title;
                if (n != resultarray.length - 1)
                    cStr += "\n";
                n++;
            });
            cStr += "```";
            msg.channel.send(cStr).then((message) => __awaiter(this, void 0, void 0, function* () {
                for (var i = 0; i < n; i++)
                    yield message.react((i + 1) + Emojis.Number);
                const collecter = message.createReactionCollector((reaction, user) => !user.bot, {});
                collecter.on("collect", (reaction) => {
                    ytPlay(msg, resultarray[parseInt(reaction.emoji.identifier.charAt(0)) - 1].link);
                    collecter.stop();
                    message.delete();
                });
            })).catch(console.error);
        });
    });
    console.log("god bot is present");
});
client.on("message", msg => {
    let prefix = config.prefix;
    if (!msg.content.startsWith(prefix) || msg.author.bot)
        return;
    //message.author.id !== config.ownerID
    console.log(msg.content);
    commands.keys().forEach(function (command, index) {
        if (msg.content.startsWith(prefix + command))
            commands.values()[index](msg, msg.content.substring(prefix.length + command.length + 1).trim());
    });
});
client.on("messageReactionRemove", reaction => {
    if (curstream == null || curstream.destroyed || curyoutubemessage == null)
        return;
    if (reaction.message != curyoutubemessage)
        return;
    if (reaction.emoji.identifier == Emojis.Pause)
        curstream.resume();
});
client.login(config.token);
//# sourceMappingURL=godbot.js.map