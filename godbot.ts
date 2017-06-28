import * as Discord from 'discord.js';
export const client = new Discord.Client();
import * as global from "./common";

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
  type:global.CommandType,
  cb:global.CommandFunction
};

const prefix:string = (global.config.prefix as string);
const commands:Command[] = [];
const categories:global.CommandCategory[] = [];
export function createCommand(name:string, description:string, type:global.CommandType, cb:global.CommandFunction)
{
  commands.push({ name: name, description: description, type:type, cb: cb });
}

var curhelpmessage:Discord.Message;

client.on("ready", () => {
  createCommand("about", "information about the bot", global.CommandType.Stock, function(msg, str) { msg.channel.send("lol im god don't fuck wit me"); });

  createCommand("help", "information about commands", global.CommandType.Stock, function (msg, str) 
  {
    msg.channel.send("", {embed: new Discord.RichEmbed().setAuthor("Help").setTitle("Select reactions for more detailed info").
      setColor(0x00FF00)}).then(async (message:Discord.Message) => 
    {
      curhelpmessage = message;
      /*
      await message.react(global.Emojis.Game);
      await message.react(client.emojis.find(emoji => emoji.name === "lilpump"));
      await message.react(client.emojis.find(emoji => emoji.name === "yt"));*/
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
        const embed = new Discord.RichEmbed(message.embeds[0]);
        var cate = categories.find(v => v.emoji == reaction.emoji.name || v.emoji == reaction.emoji.identifier);
        if (cate)
        {
          embed.setTitle(cate.name);
          embed.fields = [];
          commands.filter(v => 
          {
            if (cate)
            {
              return v.type == cate.type;
            }
          }).forEach(v => 
          {
            embed.addField(prefix + v.name, v.description, true);
          });
        }else return;
        curhelpmessage = await message.edit("", {embed: embed});
      });
    });
  });
  
  categories.push({type: global.CommandType.Stock, emoji:"lilpump", name: "Stock"});
  categories.push(ytexport());
  categories.push(rpexport());
  categories.push(generatorexport());
  categories.push(gamesexport());
  categories.push(randexport());

  console.log("god bot is present");
});

client.on("message", msg => {
	let prefix = global.config.prefix as string;
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  //message.author.id !== config.ownerID
  console.log(msg.content);
  commands.forEach(function(command, index) 
  {
    if (msg.content.toLowerCase().startsWith((prefix + command.name).toLowerCase()))
      commands[index].cb(msg, msg.content.substring(prefix.length + command.name.length + 1).trim());
  });
});

client.login(global.config.token as string);