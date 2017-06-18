const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const fs = require("fs");

client.on("ready", () => {
  console.log("god bot is present");
});

client.on("message", msg => {
	let prefix = config.prefix;

    if (!msg.content.startsWith(prefix) || msg.author.bot) return;
    //message.author.id !== config.ownerID
    
    if (msg.content.startsWith(prefix + "help")) {
		msg.channel.send("COMMANDS: africa");
	} else

    if (msg.content.startsWith(prefix + "africa")) {
		msg.channel.send("https://www.youtube.com/watch?v=FTQbiNvZqaY");
	} 

});

ask = function() {

}

client.login(config.token);