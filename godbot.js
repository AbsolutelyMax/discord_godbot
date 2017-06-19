const Discord = require("discord.js");
const client = new Discord.Client();
const casting = require('casting');
const config = require("./config.json");
const yt = require('ytdl-core');
const fs = require("fs");
var commands = [];

var currentStream;
var queue = [];

function getCommands() { return commands; }

randomValue = function(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

eightBall = function(arg) {
    var rNum = randomValue(1, 5);

    if(rNum === 1) { return "No" } else
    if(rNum === 2) { return "Yes, " + arg} else
    if(rNum === 3) { return "Maybe" } else
    if(rNum === 4) { return arg + " I think so" } else
    if(rNum === 5) { return "I think not" } else
    {
        return "error";
    }
}

function getEmojiFromString(emojiname)
{
  client.guilds.first().emojis.forEach(function(emoji) 
  {
    if (emoji.name === emojiname) return "<:" + emoji.identifier + ">";
  });

  return "";
}

client.on("ready", () => {
  client.voiceConnections
  commands["africa"] = function(msg, str) { 
    console.log(str);
    casting.cast(Discord.Message, msg).channel.send("https://www.youtube.com/watch?v=FTQbiNvZqaY");
  };
  
  /*
  commands[getEmojiFromString("therose")] = function(msg) {
    casting.cast(Discord.Message, msg).channel.send("bruh !!");
  }*/

  commands["8ball"] = function(msg, str) {
    let ans = "";
    let postMsg = msg.content.slice(7);
    ans = eightBall(postMsg);
    casting.cast(Discord.Message, msg).channel.send(ans);
  };

  commands["ytplay"] = function(oldmsg, str)
  {
    var msg = casting.cast(Discord.Message, oldmsg);
    if (msg.member.voiceChannel == null) return;
    msg.member.voiceChannel.join().then(connection => 
    {
      const stream = yt(str, {filter: "audioonly"});
      connection.playStream(stream);
    }).catch(console.error);
  }


  commands["stop"] = function(oldmsg, str) 
  {
    var msg = casting.cast(Discord.Message, msg);
    client.voiceConnections.first().st
  }

  console.log("god bot is present");
});

client.on("message", msg => {
	let prefix = config.prefix;
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  //message.author.id !== config.ownerID
  console.log(msg.content);
  for (var command in commands)
  {
    if (msg.content.startsWith(prefix + command)) commands[command](msg, msg.content.substring(prefix.length + command.length + 1));
  }
});

client.login(config.token);