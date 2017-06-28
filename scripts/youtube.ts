import * as Discord from 'discord.js'
import * as global from "../common"
import { client, commands } from "../godbot" 
import * as ytsearchimport from 'youtube-search';
import * as yt from 'ytdl-core';

const queue:string[] = [];
const ytsearchoptions:ytsearchimport.YouTubeSearchOptions = { maxResults: 5, key: (global.config.youtubeKey as string) };
var curstream:Discord.StreamDispatcher;
var outputVolume = global.config.defaultVolume as number;
var curyoutubemessage:Discord.Message;
var curyoutubemessagecollector:Discord.ReactionCollector;

function ytSearch(searchquery:string, 
  cb:(err: Error, result?: ytsearchimport.YouTubeSearchResults[], pageInfo?: ytsearchimport.YouTubeSearchPageResults) => void)
{
  ytsearchimport(searchquery, ytsearchoptions, cb);
}

function ytStop()
{
  queue.length = 0;
  curstream.end();
}

function ytPlay(msg:Discord.Message, str:string)
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
}

async function createOrEditYoutubeMessage(channel:Discord.TextChannel | Discord.DMChannel | Discord.GroupDMChannel, info:yt.videoInfo)
{
  if (curyoutubemessage)
  {
    curyoutubemessage = await curyoutubemessage.edit("Now playing **" + info.title + "**" + " by *" + info.author.name + "*");
    await curyoutubemessage.clearReactions();
    await curyoutubemessage.react(global.Emojis.Pause);
    await curyoutubemessage.react(global.Emojis.Stop);
    await curyoutubemessage.react(global.Emojis.Skip);
  }else channel.send("Now playing **" + info.title + "**" + " by *" + info.author.name + "*").then(async (message:Discord.Message) => 
  {
    curyoutubemessage = message;
    await message.react(global.Emojis.Pause);
    await message.react(global.Emojis.Stop);
    await message.react(global.Emojis.Skip);
    curyoutubemessagecollector = message.createReactionCollector((reaction, user:Discord.User) => !user.bot, {});
    curyoutubemessagecollector.on("collect", reaction => 
    {
      switch(reaction.emoji.identifier)
      {
        case global.Emojis.Pause:
        {
          curstream.pause();
          break;
        }
        case global.Emojis.Stop:
        {
          ytStop();
          reaction.users.filter(value => !value.bot).forEach(value => reaction.remove(value));
          break;
        }
        case global.Emojis.Skip:
        {
          curstream.end();
          reaction.users.filter(value => !value.bot).forEach(value => reaction.remove(value));
          break;
        }
      }
    });
  }).catch(console.error);
}

function playNext()
{
  if (queue.length == 0) { 
    client.voiceConnections.first().disconnect(); 
    curyoutubemessagecollector.stop(); 
      curyoutubemessage.delete(); return; }
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
    createOrEditYoutubeMessage(channel, info);
  });
}

export default function setupCommands()
{
  commands.setValue("play", function(msg, str)
  {
    ytPlay(msg, str);
  });

  commands.setValue("stop", function(msg, str) 
  {
    ytStop();
    msg.delete();
  });

  commands.setValue("pause", function(msg, str)
  {
    curstream.pause();
    msg.delete();
  });

  commands.setValue("resume", function(msg, str)
  {
    curstream.resume();
    msg.delete();
  });

  commands.setValue("skip", function (msg, str) 
  {
    curstream.end();
    msg.delete();
  });

  commands.setValue("volume", function(msg, str) 
  {
    var num = parseInt(str);
    if (num > 100) num = 100;
    if (num < 0) num = 0;
    outputVolume = num;
    if (curstream != null) if (!curstream.destroyed) curstream.setVolume(outputVolume);
  });

  commands.setValue("search", function(msg, str) 
  {
    ytSearch(str, (error, resultarray:ytsearchimport.YouTubeSearchResults[]) => 
    {
      if (error) console.error(error);
      var cStr:string = "";
      var n:number = 0;
      resultarray.forEach(result => 
      {
        cStr += (n + 1) + ": " + result.title;
        if (n != resultarray.length - 1) cStr += "\n";
        n++;
      });
      msg.channel.send("", {embed: {title: "Results", description: cStr, color: 0xFF0000, thumbnail: 
      {url: "http://icons.iconarchive.com/icons/dakirby309/simply-styled/128/YouTube-icon.png", height: 64, width: 64}}})
      .then(async (message:Discord.Message) => 
      {
        for (var i = 0; i < n; i++)
          await message.react((i + 1) + global.Emojis.Number);
        const collecter = message.createReactionCollector((reaction, user:Discord.User) => !user.bot, {});
        collecter.on("collect", (reaction) => 
        {
          ytPlay(msg, resultarray[parseInt(reaction.emoji.identifier.charAt(0)) - 1].link);
          collecter.stop();
          message.delete();
        });
      }).catch(console.error);
    });
  });
}

client.on("messageReactionRemove", reaction => 
{
  if (curstream == null || curstream.destroyed || curyoutubemessage == null) return;
  if (reaction.message != curyoutubemessage) return;
  if (reaction.emoji.identifier == global.Emojis.Pause) curstream.resume();
});