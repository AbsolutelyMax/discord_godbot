import * as Discord from 'discord.js';
import * as Collections from 'typescript-collections';
import * as fs from 'fs';

export const config   = JSON.parse(fs.readFileSync("./config.json", "UTF-8"));
export const profiles = JSON.parse(fs.readFileSync("./profiles.json", "UTF-8"));
export var Emojis =
{
  Number: "%E2%83%A3",
  Ten: "%F0%9F%94%9F",
  Stop: "%E2%97%BC",
  Pause: "%E2%8F%B3",
  Skip: "%E2%8F%A9",
  Game: "%F0%9F%8E%AE",
  Waste: "%F0%9F%97%91"
};
export type CommandDictionary = Collections.Dictionary<string, (msg:Discord.Message, str:string) => void>;