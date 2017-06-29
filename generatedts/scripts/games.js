"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global = require("../common");
const godbot_1 = require("../godbot");
function eightBall(arg) {
    var rNum = global.randomValue(1, 5);
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
function rollTheDice(dice) {
    let final = 0;
    for (var i = 0; i < dice; i++) {
        final += global.randomValue(1, 6);
    }
    return final;
}
function setupCommands() {
    godbot_1.pushCommands({ name: "Games", emoji: global.Emojis.Game }, [
        godbot_1.createCommand("8ball", "8ball n shit", function (msg, str) {
            let ans = "";
            let postMsg = msg.content.slice(7);
            ans = eightBall(postMsg);
            msg.channel.send(ans);
        }),
        godbot_1.createCommand("flip", "flip a coin", function (msg, str) {
            var coin = (Math.floor(Math.random() * 2) == 0) ? 'heads' : 'tails';
            let result = coin.toString();
            msg.channel.send(result);
        }),
        godbot_1.createCommand("roll", "roll som die", function (msg, str) {
            let sum = rollTheDice(parseInt(str));
            let result = sum.toString();
            msg.channel.send(result);
        })
    ]);
}
exports.default = setupCommands;
//# sourceMappingURL=games.js.map