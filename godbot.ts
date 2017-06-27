import * as Discord from 'discord.js';
const client = new Discord.Client();
import { Readable } from "stream";
import * as ytsearchimport from 'youtube-search';
import * as yt from 'ytdl-core';
import * as Collections from 'typescript-collections';
import * as fs from 'fs';

const config   = JSON.parse(fs.readFileSync("./config.json", "UTF-8"));
const profiles = JSON.parse(fs.readFileSync("./profiles.json", "UTF-8"));
const commands = new Collections.Dictionary<string, (msg:Discord.Message, str:string) => void>();
const queue:string[] = [];
const ytsearchoptions:ytsearchimport.YouTubeSearchOptions = { maxResults: 5, key: (config.youtubeKey as string) };
var curstream:Discord.StreamDispatcher;
var outputVolume = config.defaultVolume as number;
var curyoutubemessage:Discord.Message;
var curyoutubemessagecollector:Discord.ReactionCollector;
var curhelpmessage:Discord.Message;

var Emojis =
{
  Number: "%E2%83%A3",
  Ten: "%F0%9F%94%9F",
  Stop: "%E2%97%BC",
  Pause: "%E2%8F%B3",
  Skip: "%E2%8F%A9",
  Game: "%F0%9F%8E%AE",
  Waste: "%F0%9F%97%91"
}

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
    await curyoutubemessage.react(Emojis.Pause);
    await curyoutubemessage.react(Emojis.Stop);
    await curyoutubemessage.react(Emojis.Skip);
  }else channel.send("Now playing **" + info.title + "**" + " by *" + info.author.name + "*").then(async (message:Discord.Message) => 
  {
    curyoutubemessage = message;
    await message.react(Emojis.Pause);
    await message.react(Emojis.Stop);
    await message.react(Emojis.Skip);
    curyoutubemessagecollector = message.createReactionCollector((reaction, user:Discord.User) => !user.bot, {});
    curyoutubemessagecollector.on("collect", reaction => 
    {
      switch(reaction.emoji.identifier)
      {
        case Emojis.Pause:
        {
          curstream.pause();
          break;
        }
        case Emojis.Stop:
        {
          ytStop();
          reaction.users.filter(value => !value.bot).forEach(value => reaction.remove(value));
          break;
        }
        case Emojis.Skip:
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

var trapNames = ["wett", "nigga", "thot", "yeet", "booty", "finnesse", "brip", "bool", "lean", "woke", "ass", "deadass", "traphouse", "naenae", "dookie", "shih", "wile", "twerk", "vines", "compilation", "hood", "loud", "weed", "bih", "babymomma", "homie", "codeine", "thotty", "sidenigga", "whip", "donk", "fucc", "trapqueen", "hotnigga", "2phones", "boolbrab", "beangron", "yallmineifiwileout", "nut", "vape", "nuttedallonherlips", "lovesosa", "fatnigga", "drank", "hennessy", "henny", "dab", "whip", "lilnei", "remyboys", "ballin", "desiigner", "nug",  "benjamins", "blunted", "buggin", "flaggin", "bussin", "buckwild", "brackin", "king", "dawg", "ghetto", "holla", "flyyoungred", "wildin", "kicks", "minecraft", "rollup", "shawty", "slammin", "juice", "baddie", "hubby", "balla", "bangin", "blowin", "blockhead", "blunt", "bootylicious", "bowl",  "busta", "crip", "crib", "doodoo", "stuntin", "fatty", "420", "frontin", "gassedup", "hoochie", "hotbox", "neckass", "ratchet", "squad", "onfleek", "worldstar", "hunnit", "gang", "savage", "brib", "nilp", "sauce", "masta", "niggit", "krunk", "yudfuk", "grobe", "cuck", "niggalips", "brib", "bruh", "yuh", "mud", "boy", "raunchy"];

function getTrapName() {
  var trapName = trapNames[randomValue(0, trapNames.length)] + trapNames[randomValue(0, trapNames.length)] + ' ' + trapNames[randomValue(0, trapNames.length)] + trapNames[randomValue(0, trapNames.length)];
	return trapName;
}

function createNewProfile(userId:string, author:string) {
  let currentProfiles = profiles;
  let hasProfile = false;
  for(var i = 0; i < currentProfiles.length; i++) {
    if(Object.keys(currentProfiles[i])[0] === userId) {
      hasProfile = true;
      break;
    } else { hasProfile = false; }
  }
  if(hasProfile) {
    return "You already have an profile, access it by typing **>profile**";
  } else {
    var newUserObj = 
    {
      [userId]: {
        "name": [author],
        "gender": "m",
        "motto": "No Motto",
        "xp": "0"
      }
    }
    currentProfiles.push(newUserObj);//undefined
    fs.writeFile('./profiles.json', JSON.stringify(currentProfiles) , 'utf-8');
    hasProfile = false;
    return("Profile created! Learn about profiles with **>phelp**");
  }
}
function setMotto(newMotto:string, userId:string) {
  let currentProfiles = profiles;
  let hasProfile = false;
  for(var i = 0; i < currentProfiles.length; i++) {
    if(Object.keys(currentProfiles[i])[0] === userId) {
      hasProfile = true;
      break;
    } else { hasProfile = false; }
  }
  //console.log("current motto: " + currentProfiles[0]["" + userId + ""].motto);
  if(hasProfile) {
    for(var i = 0; i < currentProfiles.length; i++) {
      //console.log(Object.keys(currentProfiles[i])[0] === userId);
      
      if(Object.keys(currentProfiles[i])[0] === userId) {
        currentProfiles[i]["" + userId + ""].motto = [newMotto];
        fs.writeFile('./profiles.json', JSON.stringify(currentProfiles) , 'utf-8');
        console.log("motto set in func");
        return "Motto created: " + newMotto;
      } 
    }
  } else {
    hasProfile = false;
    return "You do not have a profile. Create one with **>createProfile**";
  }

}

function getProfile(userId:string, image:string) {
  let currentProfiles = profiles;
  let hasProfile = false; 
  for(var i = 0; i < currentProfiles.length; i++) {
    if(Object.keys(currentProfiles[i])[0] === userId) {
      hasProfile = true;
      break;
    } else { hasProfile = false; }
  }
  if(hasProfile) {
    for(var i = 0; i < currentProfiles.length; i++) {
        //console.log(Object.keys(currentProfiles[i])[0] === userId);
        if(Object.keys(currentProfiles[i])[0] === userId) {

          const embed = new Discord.RichEmbed()
            .setTitle(currentProfiles[i]["" + userId + ""].name + "'s profile")
            .setAuthor(userId, image)

            .setColor(0x00AE86)
            .setDescription(currentProfiles[i]["" + userId + ""].motto)
            .setFooter("God has spoken", client.user.avatarURL) //god image
            //.setImage(image) Set this to chosen image
            .setThumbnail(image)
            .setTimestamp()
            //.setURL("google.com")
            .addField("Name",
              currentProfiles[i]["" + userId + ""].name, true)
            .addField("Gender", currentProfiles[i]["" + userId + ""].gender, true)
            .addField("Server XP", currentProfiles[i]["" + userId + ""].xp, true);
          
          hasProfile = false;
          return {embed};
          
          } 
    }
  } else {
    //hasProfile = false;
    return "You do not have a profile. Create one with **>createProfile**";
  }
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

  commands.setValue("trapname", function(msg, str) {
    let result = getTrapName();
    msg.channel.send("Your trap name is: " + result);
  });

  commands.setValue("fireworks", function(msg, str) {
    let result = "fireworks.gif";
    msg.channel.send("hooray!", {file: result});
  });

  commands.setValue("createprofile", function(msg, str) {
    let result = createNewProfile(msg.author.id, msg.author.username);
    msg.channel.send(result);
  });

  commands.setValue("setmotto", function(msg, str) {
    let result = setMotto(str, msg.author.id);
    msg.channel.send(result);
  });

  commands.setValue("profile", function(msg, str) {
    let gotProfile = getProfile(msg.author.id, msg.author.avatarURL);
    console.log(gotProfile);
    msg.channel.send(gotProfile);
  });

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

  commands.setValue("about", function(msg, str) { msg.channel.send("lol im god don't fuck wit me"); });
  
  commands.setValue("gay", function(msg, str)
  {
    msg.channel.send("How gay is **" + str + "**?").then(async (message:Discord.Message) => 
    {
      for(var i = 0; i < 10; i++)
        await message.react(i + Emojis.Number) // fml utf 8 can suck my balls
      await message.react(Emojis.Ten);
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

  commands.setValue("help", function (msg, str) 
  {
    msg.channel.send("wat info u need").then(async (message:Discord.Message) => 
    {
      curhelpmessage = message;
      await message.react(Emojis.Game);
      await message.react(client.emojis.find(emoji => emoji.name === "lilpump"));
      await message.react(client.emojis.find(emoji => emoji.name === "yt"));
      await message.react(Emojis.Waste);

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
          case Emojis.Game:
          {
            curhelpmessage = await message.edit("**dice** | roll the dice", {});
            break;
          }

          case Emojis.Waste:
          {
            collector.stop();
            curhelpmessage.delete();
            break;
          }
        }
      });
    });
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
          await message.react((i + 1) + Emojis.Number);
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

  console.log("god bot is present");
});

client.on("message", msg => {
	let prefix = config.prefix as string;
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  //message.author.id !== config.ownerID
  console.log(msg.content);
  commands.keys().forEach(function(command, index) 
  {
    if (msg.content.toLowerCase().startsWith((prefix + command).toLowerCase()))
      commands.values()[index](msg, msg.content.substring(prefix.length + command.length + 1).trim());
  });
});

client.on("messageReactionRemove", reaction => 
{
  if (curstream == null || curstream.destroyed || curyoutubemessage == null) return;
  if (reaction.message != curyoutubemessage) return;
  if (reaction.emoji.identifier == Emojis.Pause) curstream.resume();
});

client.login(config.token as string);