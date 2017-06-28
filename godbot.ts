import * as Discord from 'discord.js';
export const client = new Discord.Client();
import * as global from "./common";
import * as Collections from 'typescript-collections';

// scripts
import ytexport from "./scripts/youtube";
import rpexport from "./scripts/rp"

export const commands = new Collections.Dictionary<string, (msg:Discord.Message, str:string) => void>();
var curhelpmessage:Discord.Message;

function randomValue (min:number, max:number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function eightBall(arg:string) {
    var rNum = randomValue(1, 5);
    var rstr:string;
    switch(rNum)
    {
      case 1:
        rstr = "No"; break;
      case 2:
        rstr = "Yes, " + arg; break;
      case 3:
        rstr = "Maybe"; break;
      case 4:
        rstr = arg + " I think so"; break;
      case 5:
        rstr = "I think not"; break;
      default:
        rstr = "wtf bruH/ !!??";
    }
    return rstr;
}

function getEmojiFromString(emojiname:string)
{
  client.guilds.first().emojis.forEach(function(emoji) 
  {
    if (emoji.name === emojiname) return "<:" + emoji.identifier + ">";
  });
  return "";
}

function rollTheDice(dice:number) {
    let final = 0;
    for(var i = 0; i < dice; i++) {
        final += randomValue(1, 6);
    }
    return final;
}

var trapNames = ["wett", "nigga", "thot", "yeet", "booty", "finnesse", "brip", "bool", "lean", "woke", "ass", "deadass", "traphouse", "naenae", "dookie", "shih", "wile", "twerk", "vines", "compilation", "hood", "loud", "weed", "bih", "babymomma", "homie", "codeine", "thotty", "sidenigga", "whip", "donk", "fucc", "trapqueen", "hotnigga", "2phones", "boolbrab", "beangron", "yallmineifiwileout", "nut", "vape", "nuttedallonherlips", "lovesosa", "fatnigga", "drank", "hennessy", "henny", "dab", "whip", "lilnei", "remyboys", "ballin", "desiigner", "nug",  "benjamins", "blunted", "buggin", "flaggin", "bussin", "buckwild", "brackin", "king", "dawg", "ghetto", "holla", "flyyoungred", "wildin", "kicks", "minecraft", "rollup", "shawty", "slammin", "juice", "baddie", "hubby", "balla", "bangin", "blowin", "blockhead", "blunt", "bootylicious", "bowl",  "busta", "crip", "crib", "doodoo", "stuntin", "fatty", "420", "frontin", "gassedup", "hoochie", "hotbox", "neckass", "ratchet", "squad", "onfleek", "worldstar", "hunnit", "gang", "savage", "brib", "nilp", "sauce", "masta", "niggit", "krunk", "yudfuk", "grobe", "cuck", "niggalips", "brib", "bruh", "yuh", "mud", "boy", "raunchy"];

function getTrapName() {
  var trapName = trapNames[randomValue(0, trapNames.length)] + trapNames[randomValue(0, trapNames.length)] + ' ' + trapNames[randomValue(0, trapNames.length)] + trapNames[randomValue(0, trapNames.length)];
	return trapName;
}

client.on("ready", () => {
  commands.setValue("africa", function(msg, str) {
    msg.channel.send("https://www.youtube.com/watch?v=FTQbiNvZqaY");
  });
  /*
  commands[getEmojiFromString("therose")] = function(msg) {
    casting.cast(Discord.Message, msg).channel.send("nice emoji dude");
  }
  */
  commands.setValue("8ball", function(msg, str) {
    let ans = "";
    let postMsg = msg.content.slice(7);
    ans = eightBall(postMsg);
    msg.channel.send(ans);
  });

  commands.setValue("flip", function(msg, str) {
    var coin = (Math.floor(Math.random() * 2) == 0) ? 'heads' : 'tails';
    let result = coin.toString();
    msg.channel.send(result);
  });

  commands.setValue("roll", function(msg, str) {
    let sum = rollTheDice(parseInt(str));
    let result = sum.toString();
    msg.channel.send(result);
  });

  commands.setValue("trapname", function(msg, str) {
    let result = getTrapName();
    msg.channel.send("Your trap name is: " + result);
  });

  commands.setValue("fireworks", function(msg, str) {
    let result = "fireworks.gif";
    msg.channel.send("hooray!", {file: result});
  });

  commands.setValue("about", function(msg, str) { msg.channel.send("lol im god don't fuck wit me"); });

  commands.setValue("help", function (msg, str) 
  {
    msg.channel.send("wat info u need").then(async (message:Discord.Message) => 
    {
      curhelpmessage = message;
      await message.react(global.Emojis.Game);
      await message.react(client.emojis.find(emoji => emoji.name === "lilpump"));
      await message.react(client.emojis.find(emoji => emoji.name === "yt"));
      await message.react(global.Emojis.Waste);

      const collector = message.createReactionCollector((reaction, user:Discord.User) => !user.bot, {});
      collector.on("collect", async (reaction) => 
      {
        if (reaction.emoji.name === "lilpump")
        {
          curhelpmessage = await message.edit("https://www.youtube.com/watch?v=T-J2PaQb6ZE");
        }else if (reaction.emoji.name === "yt")
        {
          curhelpmessage = await message.edit("**play <youtubelink>** | play a youtube video\n**skip** | skip current video\n**stop** | stop current video");
        }
        switch(reaction.emoji.identifier)
        {
          case global.Emojis.Game:
          {
            curhelpmessage = await message.edit("**dice** | roll the dice", {});
            break;
          }

          case global.Emojis.Waste:
          {
            collector.stop();
            curhelpmessage.delete();
            break;
          }
        }
      });
    });
  });
  
  ytexport();
  rpexport();

  console.log("god bot is present");
});

client.on("message", msg => {
	let prefix = global.config.prefix as string;
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  //message.author.id !== config.ownerID
  console.log(msg.content);
  commands.keys().forEach(function(command, index) 
  {
    if (msg.content.toLowerCase().startsWith((prefix + command).toLowerCase()))
      commands.values()[index](msg, msg.content.substring(prefix.length + command.length + 1).trim());
  });
});

client.login(global.config.token as string);