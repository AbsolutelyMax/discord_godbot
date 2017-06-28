"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global = require("../common");
const rp = require("./rp");
const godbot_1 = require("../godbot");
function setupCommands() {
    godbot_1.createCommand("africa", "africa", global.CommandType.Rand, function (msg, str) {
        msg.channel.send("https://www.youtube.com/watch?v=FTQbiNvZqaY");
    });
    godbot_1.createCommand("fireworks", "make fireworks", global.CommandType.Rand, function (msg, str) {
        let result = "fireworks.gif";
        rp.incrementXP(msg.author.id, 50);
        msg.channel.send("hooray!", { file: result });
    });
    return { type: global.CommandType.Rand, emoji: "shred", name: "Random" };
}
exports.default = setupCommands;
//# sourceMappingURL=random.js.map