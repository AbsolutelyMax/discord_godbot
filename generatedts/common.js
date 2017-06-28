"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
exports.config = JSON.parse(fs.readFileSync("./config.json", "UTF-8"));
exports.profiles = JSON.parse(fs.readFileSync("./profiles.json", "UTF-8"));
exports.Emojis = {
    Number: "%E2%83%A3",
    Ten: "%F0%9F%94%9F",
    Stop: "%E2%97%BC",
    Pause: "%E2%8F%B3",
    Skip: "%E2%8F%A9",
    Game: "%F0%9F%8E%AE",
    Waste: "%F0%9F%97%91"
};
function randomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
exports.randomValue = randomValue;
//# sourceMappingURL=common.js.map