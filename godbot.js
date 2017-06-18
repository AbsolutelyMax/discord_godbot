const Discord = require("discord.js");
const client = new Discord.Client();
const casting = require('casting');
const config = require("./config.json");
const fs = require("fs");
var commands = [];

function getEmojiFromString(emoji)
{
  return "<:" + emoji + ":";
}

client.on("ready", () => {
  commands["africa"] = function(msg) { 
    casting.cast(Discord.Message, msg).channel.send("https://www.youtube.com/watch?v=FTQbiNvZqaY");
  };
  
  commands[getEmojiFromString("therose")] = function(msg) {
    casting.cast(Discord.Message, msg).channel.send(":therose:");
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
    if (msg.content.startsWith(prefix + command)) commands[command](msg);
  }
});

client.login(config.token);