import * as global from "../common";
import { client, createCommand } from "../godbot"

function eightBall(arg:string) {
    var rNum = global.randomValue(1, 5);
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

function rollTheDice(dice:number) {
    let final = 0;
    for(var i = 0; i < dice; i++) {
        final += global.randomValue(1, 6);
    }
    return final;
}

export default function setupCommands() : global.CommandCategory 
{
  createCommand("8ball", "8ball n shit", global.CommandType.Game, function(msg, str) {
    let ans = "";
    let postMsg = msg.content.slice(7);
    ans = eightBall(postMsg);
    msg.channel.send(ans);
  });

  createCommand("flip", "flip a coin", global.CommandType.Game, function(msg, str) {
    var coin = (Math.floor(Math.random() * 2) == 0) ? 'heads' : 'tails';
    let result = coin.toString();
    msg.channel.send(result);
  });

  createCommand("roll", "roll som die", global.CommandType.Game, function(msg, str) {
    let sum = rollTheDice(parseInt(str));
    let result = sum.toString();
    msg.channel.send(result);
  });

  return {type: global.CommandType.Game, emoji: global.Emojis.Game, name: "Games"};
}