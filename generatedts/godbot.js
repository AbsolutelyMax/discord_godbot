"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const client = new Discord.Client();
const yt = require("ytdl-core");
const Collections = require("typescript-collections");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("./config.json", "UTF-8"));
const commands = new Collections.Dictionary();
const queue = [];
var curstream;
var outputVolume = config.defaultVolume;
function playNext() {
    if (queue.length == 0) {
        client.voiceConnections.first().disconnect();
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
        channel.send("Now playing **" + info.title + "**" + " by *" + info.author.name + "*");
        curstream = connection.playStream(yt(str, { filter: "audioonly" }));
        curstream.addListener("end", playNext);
        curstream.setVolume(outputVolume);
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
client.on("ready", () => {
    commands.setValue("africa", function (msg, str) {
        console.log(str);
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
    commands.setValue("play", function (msg, str) {
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
    });
    commands.setValue("stop", function (msg, str) {
        curstream.end();
        queue.length = 0;
        msg.channel.send("Stopped playback");
    });
    commands.setValue("pause", function (msg, str) {
        curstream.pause();
        msg.channel.send("Paused playback");
    });
    commands.setValue("resume", function (msg, str) {
        curstream.resume();
        msg.channel.send("Resumed playback");
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
client.login(config.token);
//# sourceMappingURL=godbot.js.map