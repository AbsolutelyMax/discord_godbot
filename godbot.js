const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
  console.log("god bot is present");
});

client.on("message", msg => {
	if (msg.content.startsWith("africa")) {
		msg.channel.send("https://www.youtube.com/watch?v=FTQbiNvZqaY");
	}
});

client.login("MzI2MDc0OTcwNTg3MjY3MTAz.DChhTg.2zeJf9PqvpGOLGVYwSRnI8JtgrE");