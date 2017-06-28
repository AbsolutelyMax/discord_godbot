import * as Discord from 'discord.js'
import * as global from "../common"
import { client, createCommand } from "../godbot"
import * as fs from 'fs';

function createNewProfile(userId:string, author:string) {
  let currentProfiles = global.profiles;
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
        "xp": "0",
        "level" : "0"
      }
    }
    currentProfiles.push(newUserObj);//undefined
    fs.writeFile('./profiles.json', JSON.stringify(currentProfiles) , 'utf-8');
    hasProfile = false;
    return("Profile created! Learn about profiles with **>phelp**");
  }
}
function setMotto(newMotto:string, userId:string) {
  let currentProfiles = global.profiles;
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
  let currentProfiles = global.profiles;
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
            .addField("**Name**",
              currentProfiles[i]["" + userId + ""].name, true)
            .addField("**Gender**", currentProfiles[i]["" + userId + ""].gender, true)
            .addField("**Server XP**", currentProfiles[i]["" + userId + ""].xp, true)
            .addField("**Level**", currentProfiles[i]["" + userId + ""].level, true);
          
          hasProfile = false;
          return {embed};
          
          } 
    }
  } else {
    //hasProfile = false;
    return "You do not have a profile. Create one with **>createProfile**";
  }
}
export function getXpToLevel(level:number) {return 5 * (level ^ 2)}
export function incrementXP(userId:string, amount:number) {
  let currentProfiles = global.profiles;
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
          let currentProfilesXP = parseInt(currentProfiles[i]["" + userId + ""].xp); 
          currentProfilesXP += amount;
          currentProfiles[i]["" + userId + ""].xp = currentProfilesXP.toString();

          if(currentProfiles[i]["" + userId + ""].xp >= getXpToLevel(currentProfiles[i]["" + userId + ""].level+1)) {
            console.log("Level up!");
            let remainder = parseInt(currentProfiles[i]["" + userId + ""].xp) % (getXpToLevel(currentProfiles[i]["" + userId + ""].level+1))
            let currentLevel = parseInt(currentProfiles[i]["" + userId + ""].level);
            currentLevel += 1;

            currentProfiles[i]["" + userId + ""].level = currentLevel.toString();
            currentProfiles[i]["" + userId + ""].xp = remainder;
          }
          fs.writeFile('./profiles.json', JSON.stringify(currentProfiles) , 'utf-8');
          hasProfile = false;  
        } 
    }
  } else {
    console.log("err: userId not found in incrementXP");
  }
}

export default function setupCommands() : global.CommandCategory
{
  createCommand("createprofile", "create a profile for the server", global.CommandType.RP, function(msg, str) {
    let result = createNewProfile(msg.author.id, msg.author.username);
    msg.channel.send(result);
  });

  createCommand("setmotto", "set your motto", global.CommandType.RP, function(msg, str) {
    let result = setMotto(str, msg.author.id);
    msg.channel.send(result);
  });

  createCommand("profile", "view your profile or someone elses", global.CommandType.RP, function(msg, str) {
    var author:Discord.User = msg.mentions.members.size != 0 ? msg.mentions.members.first().user : msg.author;
    incrementXP(author.id, 1);
    let gotProfile = getProfile(author.id, author.avatarURL);
    //console.log(gotProfile);
    msg.channel.send(gotProfile);
  });

  createCommand("gay", "assert how gay someone is", global.CommandType.RP, function(msg, str)
  {
    msg.channel.send("How gay is **" + str + "**?").then(async (message:Discord.Message) => 
    {
      for(var i = 0; i < 10; i++)
        await message.react(i + global.Emojis.Number) // fml utf 8 can suck my balls
      await message.react(global.Emojis.Ten);
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

  return {type: global.CommandType.RP, emoji: "lilpump", name: "RP Commands"};
}