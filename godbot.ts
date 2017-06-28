import * as Discord from 'discord.js';
export const client = new Discord.Client();
import * as global from "./common";
import * as Collections from 'typescript-collections';

// scripts
import ytexport from "./scripts/youtube";
import rpexport from "./scripts/rp"
import generatorexport from "./scripts/generator"
import gamesexport from "./scripts/games";
import randexport from "./scripts/random";

export const commands = new Collections.Dictionary<string, (msg:Discord.Message, str:string) => void>();
var curhelpmessage:Discord.Message;

client.on("ready", () => {
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
  generatorexport();
  gamesexport();
  randexport();

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