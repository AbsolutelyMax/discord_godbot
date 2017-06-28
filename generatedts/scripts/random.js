"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const godbot_1 = require("../godbot");
function setupCommands() {
    godbot_1.commands.setValue("africa", function (msg, str) {
        msg.channel.send("https://www.youtube.com/watch?v=FTQbiNvZqaY");
    });
    godbot_1.commands.setValue("fireworks", function (msg, str) {
        let result = "fireworks.gif";
        msg.channel.send("hooray!", { file: result });
    });
}
exports.default = setupCommands;
//# sourceMappingURL=random.js.map