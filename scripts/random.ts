import * as Discord from "discord.js";
import * as global from "../common";
import * as rp from "./rp";
import { client, commands } from "../godbot"

export default function setupCommands()
{
  commands.setValue("africa", function(msg, str) {
    msg.channel.send("https://www.youtube.com/watch?v=FTQbiNvZqaY");
  });

  commands.setValue("fireworks", function(msg, str) {
    let result = "fireworks.gif";
    rp.incrementXP(msg.author.id, 50);
    msg.channel.send("hooray!", {file: result});
  });
}