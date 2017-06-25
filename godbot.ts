import * as Discord from 'discord.js';
const client = new Discord.Client();
import { Readable } from "stream";
import * as yt from 'ytdl-core';
import * as Collections from 'typescript-collections';
import * as fs from 'fs';

const config = JSON.parse(fs.readFileSync("./config.json", "UTF-8"));
const commands = new Collections.Dictionary<string, (msg:Discord.Message, str:string) => void>();
const queue:string[] = [];
var curstream:Discord.StreamDispatcher;
var outputVolume = config.defaultVolume as number;
var curyoutubemessage:Discord.Message;

var Emojis =
{
  Number: "%E2%83%A3",
  Ten: "%F0%9F%94%9F",
  Stop: "%E2%97%BC",
  Pause: "%E2%8F%B3",
  Skip: "%E2%8F%A9"
}

function playNext()
{
  if (queue.length == 0) { client.voiceConnections.first().disconnect(); return; }
  playAudio(queue[0], client.voiceConnections.first(), client.guilds.first().defaultChannel);
  queue.shift();
}

function playAudio(str:string, connection:Discord.VoiceConnection, channel:Discord.TextChannel | Discord.DMChannel | Discord.GroupDMChannel)
{
  yt.getInfo(str, function(error, info)
  {
    if (error)  { channel.send("wtf is this link"); return }
    curstream = connection.playStream(yt(str, {filter: "audioonly", quality: "highest"}));
    curstream.addListener("end", playNext);
    curstream.setVolume(outputVolume);
    channel.send("Now playing **" + info.title + "**" + " by *" + info.author.name + "*").then(async (message:Discord.Message) => 
    {
      curyoutubemessage = message;
      //await message.react(Emojis.Pause);
      await message.react(Emojis.Stop);
      await message.react(Emojis.Skip);
      const collector = message.createReactionCollector((reaction, user:Discord.User) => !user.bot, {});
      collector.on("collect", reaction => 
      {
        switch(reaction.emoji.identifier)
        {
          /*
          case Emojis.Pause:
            {
              curstream.pause();
              break;
            }*/
          case Emojis.Stop:
            {
              curstream.end();
              queue.length = 0;
              reaction.users.filter(value => !value.bot).forEach(value => reaction.remove(value));
              reaction.message.channel.send("Stopped playback");
              break;
            }
          case Emojis.Skip:
          {
            curstream.end();
            message.channel.send("Skipped video");
            break;
          }
        }
      });
      curstream.on("end", function() { collector.stop(); });
    }).catch(console.error);
  });
}

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

  commands.setValue("play", function(msg, str)
  {
    if (msg.member.voiceChannel == null) { msg.channel.send("get in a channel shithead"); return; }
    msg.member.voiceChannel.join().then(connection => 
    {
      client.guilds.first().member(client.user).setDeaf(true);
      if (queue.length == 0 && (curstream == null || curstream.destroyed))
        playAudio(str, connection, msg.channel);
      else 
      {
        yt.getInfo(str, function(error, info)
        {
          if (error) msg.channel.send("lmao video please");
          queue.push(str);
          msg.channel.send("Queued **" + info.title + "** by *" + info.author.name + "*");
        });
      }
    }).catch(console.error);
  });

  commands.setValue("stop", function(msg, str) 
  {
    queue.length = 0;
    curstream.end();
    msg.channel.send("Stopped playback");
  });

/* dont work idk why
  commands.setValue("pause", function(msg, str)
  {
    curstream.pause();
    msg.channel.send("Paused playback");
  });

  commands.setValue("resume", function(msg, str)
  {
    curstream.resume();
    msg.channel.send("Resumed playback");
  });
*/
  commands.setValue("skip", function (msg, str) 
  {
    curstream.end();
    msg.channel.send("Skipped video");
  });

  commands.setValue("volume", function(msg, str) 
  {
    var num = parseInt(str);
    if (num > 100) num = 100;
    if (num < 0) num = 0;
    outputVolume = num;
    if (curstream != null) if (!curstream.destroyed) curstream.setVolume(outputVolume);
  });

  commands.setValue("about", function(msg, str) { msg.channel.send("lol im god"); });
  commands.setValue("gay", function(msg, str)
  {
    msg.channel.send("How gay is **" + str + "**?").then(async (message:Discord.Message) => 
    {
      for(var i = 0; i < 10; i++)
        await message.react(i + "%E2%83%A3") // fml utf 8 can suck my balls
      message.react("%F0%9F%94%9F");
      const collecter = message.createReactionCollector((reaction, user:Discord.User) => !user.bot);
      collecter.on("collect", (reaction) => 
      {
        var num;
        if (reaction.emoji.identifier.charAt(1) == 'F') num = 10; else num = parseInt(reaction.emoji.identifier.charAt(0));
        reaction.message.channel.send(str + " is " + (num == 0 ? 0 : num * 10) + " percent gay");
        collecter.stop();
      });
    }).catch(console.error);
  });

  console.log("god bot is present");
});

client.on("message", msg => {
	let prefix = config.prefix as string;
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  //message.author.id !== config.ownerID
  console.log(msg.content);
  commands.keys().forEach(function(command, index) 
  {
    if (msg.content.startsWith(prefix + command))
      commands.values()[index](msg, msg.content.substring(prefix.length + command.length + 1).trim());
  });
});

client.on("messageReactionRemove", reaction => 
{
  if (curstream == null || curstream.destroyed || curyoutubemessage == null) return;
  if (reaction.message != curyoutubemessage) return;
  if (reaction.emoji.identifier == Emojis.Pause) 
  {
    curstream.stream.resume();
  }
});

client.login(config.token as string);