"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global = require("../common");
const godbot_1 = require("../godbot");
var trapNames = ["wett", "nigga", "thot", "yeet", "booty", "finnesse", "brip", "bool", "lean", "woke", "ass", "deadass", "traphouse", "naenae", "dookie", "shih", "wile", "twerk", "vines", "compilation", "hood", "loud", "weed", "bih", "babymomma", "homie", "codeine", "thotty", "sidenigga", "whip", "donk", "fucc", "trapqueen", "hotnigga", "2phones", "boolbrab", "beangron", "yallmineifiwileout", "nut", "vape", "nuttedallonherlips", "lovesosa", "fatnigga", "drank", "hennessy", "henny", "dab", "whip", "lilnei", "remyboys", "ballin", "desiigner", "nug", "benjamins", "blunted", "buggin", "flaggin", "bussin", "buckwild", "brackin", "king", "dawg", "ghetto", "holla", "flyyoungred", "wildin", "kicks", "minecraft", "rollup", "shawty", "slammin", "juice", "baddie", "hubby", "balla", "bangin", "blowin", "blockhead", "blunt", "bootylicious", "bowl", "busta", "crip", "crib", "doodoo", "stuntin", "fatty", "420", "frontin", "gassedup", "hoochie", "hotbox", "neckass", "ratchet", "squad", "onfleek", "worldstar", "hunnit", "gang", "savage", "brib", "nilp", "sauce", "masta", "niggit", "krunk", "yudfuk", "grobe", "cuck", "niggalips", "brib", "bruh", "yuh", "mud", "boy", "raunchy"];
function getTrapName() {
    var trapName = trapNames[global.randomValue(0, trapNames.length)] +
        trapNames[global.randomValue(0, trapNames.length)] + ' ' +
        trapNames[global.randomValue(0, trapNames.length)] +
        trapNames[global.randomValue(0, trapNames.length)];
    return trapName;
}
function setupCommands() {
    godbot_1.pushCommands({ name: "Max's Generators", emoji: "cashmeousside" }, [
        godbot_1.createCommand("trapname", "generate a trapname", function (msg, str) {
            let result = getTrapName();
            msg.channel.send("Your trap name is: " + result);
        })
    ]);
}
exports.default = setupCommands;
//# sourceMappingURL=generator.js.map