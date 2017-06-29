import * as Discord from 'discord.js';
export const client = new Discord.Client();
import * as global from "./common";
import * as Collections from "typescript-collections";

// scripts
import ytexport from "./scripts/youtube";
import rpexport from "./scripts/rp";
import generatorexport from "./scripts/generator";
import gamesexport from "./scripts/games";
import randexport from "./scripts/random";

type Command = 
{
  name:string,
  description:string,
  cb:global.CommandFunction
};

const prefix:string = (global.config.prefix as string);
const commands:Command[][] = [[]];
const categories:global.CommandCategory[] = [];
//const commands:Command[] = [];
//const categories:global.CommandCategory[] = [];
export function createCommand(name:string, description:string, cb:global.CommandFunction) : Command
{
  return { name: name, description: description, cb: cb };
}

export function pushCommands(category:global.CommandCategory, com:Command[])
{
  commands.push(com);
  categories.push(category);
}

var curhelpmessage:Discord.Message;

client.on("ready", () => {
  pushCommands({name: "Stock", emoji:"lilpump"}, [
    createCommand("about", "information about the bot", function(msg, str) { msg.channel.send("lol im god don't fuck wit me"); }),

    createCommand("help", "information about commands", function (msg, str) 
    {
      msg.channel.send("", {embed: new Discord.RichEmbed().setAuthor("Help", client.user.displayAvatarURL)
        .setTitle("Select reactions for more detailed info").setColor(0x00FF00)}).then(async (message:Discord.Message) => 
      {
        curhelpmessage = message;
        categories.forEach(async c => 
        {
          if (!c.emoji.includes('%')) await message.react(client.emojis.find(emoji => emoji.name == c.emoji)); 
            else await message.react(c.emoji);
        });
        await message.react(global.Emojis.Waste);

        const collector = message.createReactionCollector((reaction, user:Discord.User) => !user.bot, {});
        collector.on("collect", async (reaction) => 
        {
          if (reaction.emoji.identifier == global.Emojis.Waste) 
          { curhelpmessage.delete(); collector.stop(); }
          var cate = categories.find(v => v.emoji == reaction.emoji.name || v.emoji == reaction.emoji.identifier);
          if (!cate) return;
          const embed = new Discord.RichEmbed().setTitle("Help").setColor(0x00FF00);
          embed.setTitle(cate.name);
          embed.addField('\u200B', '\u200B', false);
          embed.fields = [];
          commands[categories.indexOf(cate)].forEach(f => 
          {
            embed.addField(prefix + f.name, f.description, false);
          });
          curhelpmessage = await message.edit("", {embed: embed});
        });
      });
    })
  ]);
  
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
  commands.forEach(function(commandarray, index1) 
  {
    commandarray.forEach((command, index2) => 
    {
      if (msg.content.toLowerCase().startsWith((prefix + command.name).toLowerCase()))
        command.cb(msg, msg.content.substring(prefix.length + command.name.length + 1).trim());
    });
  });
});

client.login(global.config.token as string);