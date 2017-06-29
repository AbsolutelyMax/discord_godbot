import * as Discord from "discord.js";
import * as global from "../common";
import * as rp from "./rp";
import { client, createCommand, pushCommands } from "../godbot"

export default function setupCommands()
{
  pushCommands({name: "Random", emoji: "shred"}, 
  [
    createCommand("africa", "africa", function(msg, str) {
      msg.channel.send("https://www.youtube.com/watch?v=FTQbiNvZqaY");
    }),

    createCommand("fireworks", "make fireworks", function(msg, str) {
      let result = "fireworks.gif";
      rp.incrementXP(msg.author.id, 50);
      msg.channel.send("hooray!", {file: result});
    })
  ]);
}