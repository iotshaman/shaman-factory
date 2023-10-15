import { CommandLineInput } from "../models/command-line-input";
import { Prompt } from "../models/prompt";
import { UserInterfaceService } from "../services/user-interface.service";
import { ICommand } from "./command";

export class EchoCommand implements ICommand {

  get name(): string { return "echo"; }
  private userInterface: UserInterfaceService = new UserInterfaceService();

  run = (args: CommandLineInput): Promise<void> => {
    return new Promise(async res => {
      if (!args) {
        let prompt = new Prompt("value", "Please enter text that you would like to echo: ");
        let response = await this.userInterface.prompt(prompt);
        this.echo(response.value);
        return res();
      }
      if (!args.hasParameter('value')) throw new Error('No echo value provided (use --value="something to echo" syntax).');
      this.echo(args.getParameterValueOrDefault('value'));
      res();
    })
  }

  private echo = (value: string) => {
    console.log(`\r\nEcho: ${value}`);
  }

}