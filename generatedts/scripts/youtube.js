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
const global = require("../common");
const godbot_1 = require("../godbot");
const ytsearchimport = require("youtube-search");
const yt = require("ytdl-core");
const queue = [];
const ytsearchoptions = { maxResults: 5, key: global.config.youtubeKey };
var curstream;
var outputVolume = global.config.defaultVolume;
var curyoutubemessage;
var curyoutubemessagecollector;
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
        godbot_1.client.guilds.first().member(godbot_1.client.user).setDeaf(true);
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
            yield curyoutubemessage.react(global.Emojis.Pause);
            yield curyoutubemessage.react(global.Emojis.Stop);
            yield curyoutubemessage.react(global.Emojis.Skip);
        }
        else
            channel.send("Now playing **" + info.title + "**" + " by *" + info.author.name + "*").then((message) => __awaiter(this, void 0, void 0, function* () {
                curyoutubemessage = message;
                yield message.react(global.Emojis.Pause);
                yield message.react(global.Emojis.Stop);
                yield message.react(global.Emojis.Skip);
                curyoutubemessagecollector = message.createReactionCollector((reaction, user) => !user.bot, {});
                curyoutubemessagecollector.on("collect", reaction => {
                    switch (reaction.emoji.identifier) {
                        case global.Emojis.Pause:
                            {
                                curstream.pause();
                                break;
                            }
                        case global.Emojis.Stop:
                            {
                                ytStop();
                                reaction.users.filter(value => !value.bot).forEach(value => reaction.remove(value));
                                break;
                            }
                        case global.Emojis.Skip:
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
        godbot_1.client.voiceConnections.first().disconnect();
        curyoutubemessagecollector.stop();
        curyoutubemessage.delete();
        return;
    }
    playAudio(queue[0], godbot_1.client.voiceConnections.first(), godbot_1.client.guilds.first().defaultChannel);
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
function setupCommands() {
    godbot_1.commands.setValue("play", function (msg, str) {
        ytPlay(msg, str);
    });
    godbot_1.commands.setValue("stop", function (msg, str) {
        ytStop();
        msg.delete();
    });
    godbot_1.commands.setValue("pause", function (msg, str) {
        curstream.pause();
        msg.delete();
    });
    godbot_1.commands.setValue("resume", function (msg, str) {
        curstream.resume();
        msg.delete();
    });
    godbot_1.commands.setValue("skip", function (msg, str) {
        curstream.end();
        msg.delete();
    });
    godbot_1.commands.setValue("volume", function (msg, str) {
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
    godbot_1.commands.setValue("search", function (msg, str) {
        ytSearch(str, (error, resultarray) => {
            if (error)
                console.error(error);
            var cStr = "";
            var n = 0;
            resultarray.forEach(result => {
                cStr += (n + 1) + ": " + result.title;
                if (n != resultarray.length - 1)
                    cStr += "\n";
                n++;
            });
            msg.channel.send("", { embed: { title: "Results", description: cStr, color: 0xFF0000, thumbnail: { url: "http://icons.iconarchive.com/icons/dakirby309/simply-styled/128/YouTube-icon.png", height: 64, width: 64 } } })
                .then((message) => __awaiter(this, void 0, void 0, function* () {
                for (var i = 0; i < n; i++)
                    yield message.react((i + 1) + global.Emojis.Number);
                const collecter = message.createReactionCollector((reaction, user) => !user.bot, {});
                collecter.on("collect", (reaction) => {
                    ytPlay(msg, resultarray[parseInt(reaction.emoji.identifier.charAt(0)) - 1].link);
                    collecter.stop();
                    message.delete();
                });
            })).catch(console.error);
        });
    });
}
exports.default = setupCommands;
godbot_1.client.on("messageReactionRemove", reaction => {
    if (curstream == null || curstream.destroyed || curyoutubemessage == null)
        return;
    if (reaction.message != curyoutubemessage)
        return;
    if (reaction.emoji.identifier == global.Emojis.Pause)
        curstream.resume();
});
//# sourceMappingURL=youtube.js.map