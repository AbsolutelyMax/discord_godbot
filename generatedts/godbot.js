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
// scripts
const youtube_1 = require("./scripts/youtube");
const rp_1 = require("./scripts/rp");
const generator_1 = require("./scripts/generator");
const games_1 = require("./scripts/games");
const random_1 = require("./scripts/random");
const prefix = global.config.prefix;
const commands = [];
const categories = [];
function createCommand(name, description, type, cb) {
    commands.push({ name: name, description: description, type: type, cb: cb });
}
exports.createCommand = createCommand;
var curhelpmessage;
exports.client.on("ready", () => {
    createCommand("about", "information about the bot", global.CommandType.Stock, function (msg, str) { msg.channel.send("lol im god don't fuck wit me"); });
    createCommand("help", "information about commands", global.CommandType.Stock, function (msg, str) {
        msg.channel.send("", { embed: new Discord.RichEmbed().setAuthor("Help", exports.client.user.displayAvatarURL)
                .setTitle("Select reactions for more detailed info").setColor(0x00FF00) }).then((message) => __awaiter(this, void 0, void 0, function* () {
            curhelpmessage = message;
            /*
            await message.react(global.Emojis.Game);
            await message.react(client.emojis.find(emoji => emoji.name === "lilpump"));
            await message.react(client.emojis.find(emoji => emoji.name === "yt"));*/
            categories.forEach((c) => __awaiter(this, void 0, void 0, function* () {
                if (!c.emoji.includes('%'))
                    yield message.react(exports.client.emojis.find(emoji => emoji.name == c.emoji));
                else
                    yield message.react(c.emoji);
            }));
            yield message.react(global.Emojis.Waste);
            const collector = message.createReactionCollector((reaction, user) => !user.bot, {});
            collector.on("collect", (reaction) => __awaiter(this, void 0, void 0, function* () {
                if (reaction.emoji.identifier == global.Emojis.Waste) {
                    curhelpmessage.delete();
                    collector.stop();
                }
                const embed = new Discord.RichEmbed().setTitle("Help").setColor(0x00FF00);
                var cate = categories.find(v => v.emoji == reaction.emoji.name || v.emoji == reaction.emoji.identifier);
                if (cate) {
                    embed.setTitle(cate.name);
                    embed.addField('\u200B', '\u200B', false);
                    embed.fields = [];
                    commands.filter(v => {
                        if (cate) {
                            return v.type == cate.type;
                        }
                    }).forEach(v => {
                        embed.addField(prefix + v.name, v.description, false);
                    });
                }
                else
                    return;
                curhelpmessage = yield message.edit("", { embed: embed });
            }));
        }));
    });
    categories.push({ type: global.CommandType.Stock, emoji: "lilpump", name: "Stock" });
    categories.push(youtube_1.default());
    categories.push(rp_1.default());
    categories.push(generator_1.default());
    categories.push(games_1.default());
    categories.push(random_1.default());
    console.log("god bot is present");
});
exports.client.on("message", msg => {
    let prefix = global.config.prefix;
    if (!msg.content.startsWith(prefix) || msg.author.bot)
        return;
    //message.author.id !== config.ownerID
    console.log(msg.content);
    commands.forEach(function (command, index) {
        if (msg.content.toLowerCase().startsWith((prefix + command.name).toLowerCase()))
            commands[index].cb(msg, msg.content.substring(prefix.length + command.name.length + 1).trim());
    });
});
exports.client.login(global.config.token);
//# sourceMappingURL=godbot.js.map