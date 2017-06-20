import * as Discord from 'discord.js';
const client = new Discord.Client();
import { Readable } from "stream";
import * as yt from 'ytdl-core';
import * as Collections from 'typescript-collections';
import * as fs from 'fs';

const config = JSON.parse(fs.readFileSync("./config.json", "UTF-8"));
const commands = new Collections.Dictionary<string, (msg:Discord.Message, str:string) => void>();
const queue:string[] = [];
var curstream:Readable;

function playNext()
{
  if (queue.length == 0) return;
  playAudio(queue[0], client.voiceConnections.first());
  queue.shift();
}

function playAudio(str:string, connection:Discord.VoiceConnection)
{
  curstream = yt(str, {filter: "audioonly"});
  curstream.addListener("end", playNext);
  connection.playStream(curstream);
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
    console.log(str);
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
    console.log(coin);
    let result = coin.toString();
    msg.channel.send(result);
  });

  commands.setValue("roll", function(msg, str) {
    let sum = rollTheDice(parseInt(str));
    console.log(sum);
    let result = sum.toString();
    msg.channel.send(result);
  });

  commands.setValue("play", function(msg, str)
  {
    if (msg.member.voiceChannel == null) return;
    msg.member.voiceChannel.join().then(connection => 
    {
      if (queue.length == 0 && ( curstream == null || !curstream.readable))
      {
        playAudio(str, connection);
      }else 
      {
        queue.push(str);
      }
    }).catch(console.error);
  });

  commands.setValue("stop", function(msg, str) 
  {
    queue.length = 0;
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
      commands.values()[index](msg, msg.content.substring(prefix.length + command.length + 1));
  });
});

client.login(config.token as string);