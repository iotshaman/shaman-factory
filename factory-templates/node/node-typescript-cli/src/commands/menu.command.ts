import { CommandLineInput } from "../models/command-line-input";
import { ICommand } from "./command";

export class MenuCommand implements ICommand {

  get name(): string { return "menu"; }

  run = (args: CommandLineInput): Promise<void> => {
    return new Promise(res => {
      console.log("\r\nPlease choose from one of the following options:");
      console.log("Type 'menu' to display this menu.");
      console.log("Type 'echo' to open echo cli.");
      console.log("Type 'exit' to close CLI.\r\n");
      res();
    })
  }

}