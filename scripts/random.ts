import * as Discord from "discord.js";
import * as global from "../common";
import * as rp from "./rp";
import { client, createCommand } from "../godbot"

export default function setupCommands() : global.CommandCategory
{
  createCommand("africa", "africa", global.CommandType.Rand, function(msg, str) {
    msg.channel.send("https://www.youtube.com/watch?v=FTQbiNvZqaY");
  });

  createCommand("fireworks", "make fireworks", global.CommandType.Rand,  function(msg, str) {
    let result = "fireworks.gif";
    rp.incrementXP(msg.author.id, 50);
    msg.channel.send("hooray!", {file: result});
  });

  return {type: global.CommandType.Rand, emoji: "shred", name: "Random"};
}