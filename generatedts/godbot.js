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
exports.client = new Discord.Client();
const global = require("./common");
const Collections = require("typescript-collections");
// scripts
const youtube_1 = require("./scripts/youtube");
const rp_1 = require("./scripts/rp");
const generator_1 = require("./scripts/generator");
const games_1 = require("./scripts/games");
const random_1 = require("./scripts/random");
exports.commands = new Collections.Dictionary();
var curhelpmessage;
exports.client.on("ready", () => {
    exports.commands.setValue("about", function (msg, str) { msg.channel.send("lol im god don't fuck wit me"); });
    exports.commands.setValue("help", function (msg, str) {
        msg.channel.send("wat info u need").then((message) => __awaiter(this, void 0, void 0, function* () {
            curhelpmessage = message;
            yield message.react(global.Emojis.Game);
            yield message.react(exports.client.emojis.find(emoji => emoji.name === "lilpump"));
            yield message.react(exports.client.emojis.find(emoji => emoji.name === "yt"));
            yield message.react(global.Emojis.Waste);
            const collector = message.createReactionCollector((reaction, user) => !user.bot, {});
            collector.on("collect", (reaction) => __awaiter(this, void 0, void 0, function* () {
                if (reaction.emoji.name === "lilpump") {
                    curhelpmessage = yield message.edit("https://www.youtube.com/watch?v=T-J2PaQb6ZE");
                }
                else if (reaction.emoji.name === "yt") {
                    curhelpmessage = yield message.edit("**play <youtubelink>** | play a youtube video\n**skip** | skip current video\n**stop** | stop current video");
                }
                switch (reaction.emoji.identifier) {
                    case global.Emojis.Game:
                        {
                            curhelpmessage = yield message.edit("**dice** | roll the dice", {});
                            break;
                        }
                    case global.Emojis.Waste:
                        {
                            collector.stop();
                            curhelpmessage.delete();
                            break;
                        }
                }
            }));
        }));
    });
    youtube_1.default();
    rp_1.default();
    generator_1.default();
    games_1.default();
    random_1.default();
    console.log("god bot is present");
});
exports.client.on("message", msg => {
    let prefix = global.config.prefix;
    if (!msg.content.startsWith(prefix) || msg.author.bot)
        return;
    //message.author.id !== config.ownerID
    console.log(msg.content);
    exports.commands.keys().forEach(function (command, index) {
        if (msg.content.toLowerCase().startsWith((prefix + command).toLowerCase()))
            exports.commands.values()[index](msg, msg.content.substring(prefix.length + command.length + 1).trim());
    });
});
exports.client.login(global.config.token);
//# sourceMappingURL=godbot.js.map