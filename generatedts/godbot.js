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
exports.commands = new Collections.Dictionary();
var curhelpmessage;
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
    exports.client.guilds.first().emojis.forEach(function (emoji) {
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
var trapNames = ["wett", "nigga", "thot", "yeet", "booty", "finnesse", "brip", "bool", "lean", "woke", "ass", "deadass", "traphouse", "naenae", "dookie", "shih", "wile", "twerk", "vines", "compilation", "hood", "loud", "weed", "bih", "babymomma", "homie", "codeine", "thotty", "sidenigga", "whip", "donk", "fucc", "trapqueen", "hotnigga", "2phones", "boolbrab", "beangron", "yallmineifiwileout", "nut", "vape", "nuttedallonherlips", "lovesosa", "fatnigga", "drank", "hennessy", "henny", "dab", "whip", "lilnei", "remyboys", "ballin", "desiigner", "nug", "benjamins", "blunted", "buggin", "flaggin", "bussin", "buckwild", "brackin", "king", "dawg", "ghetto", "holla", "flyyoungred", "wildin", "kicks", "minecraft", "rollup", "shawty", "slammin", "juice", "baddie", "hubby", "balla", "bangin", "blowin", "blockhead", "blunt", "bootylicious", "bowl", "busta", "crip", "crib", "doodoo", "stuntin", "fatty", "420", "frontin", "gassedup", "hoochie", "hotbox", "neckass", "ratchet", "squad", "onfleek", "worldstar", "hunnit", "gang", "savage", "brib", "nilp", "sauce", "masta", "niggit", "krunk", "yudfuk", "grobe", "cuck", "niggalips", "brib", "bruh", "yuh", "mud", "boy", "raunchy"];
function getTrapName() {
    var trapName = trapNames[randomValue(0, trapNames.length)] + trapNames[randomValue(0, trapNames.length)] + ' ' + trapNames[randomValue(0, trapNames.length)] + trapNames[randomValue(0, trapNames.length)];
    return trapName;
}
exports.client.on("ready", () => {
    exports.commands.setValue("africa", function (msg, str) {
        msg.channel.send("https://www.youtube.com/watch?v=FTQbiNvZqaY");
    });
    /*
    commands[getEmojiFromString("therose")] = function(msg) {
      casting.cast(Discord.Message, msg).channel.send("nice emoji dude");
    }
    */
    exports.commands.setValue("8ball", function (msg, str) {
        let ans = "";
        let postMsg = msg.content.slice(7);
        ans = eightBall(postMsg);
        msg.channel.send(ans);
    });
    exports.commands.setValue("flip", function (msg, str) {
        var coin = (Math.floor(Math.random() * 2) == 0) ? 'heads' : 'tails';
        let result = coin.toString();
        msg.channel.send(result);
    });
    exports.commands.setValue("roll", function (msg, str) {
        let sum = rollTheDice(parseInt(str));
        let result = sum.toString();
        msg.channel.send(result);
    });
    exports.commands.setValue("trapname", function (msg, str) {
        let result = getTrapName();
        msg.channel.send("Your trap name is: " + result);
    });
    exports.commands.setValue("fireworks", function (msg, str) {
        let result = "fireworks.gif";
        msg.channel.send("hooray!", { file: result });
    });
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