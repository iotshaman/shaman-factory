import { CreateCommand } from "./commands/create.command";
import { ICommand } from "./commands/command";

export class Factory {

  constructor(private commands: ICommand[] = FactoryCommands) { }

  Generate = (command: string, args: string[]): Promise<void> => {
    if (!command) throw new Error("Command parameter not provided.");
    let cmd = this.commands.find(c => c.name == command);
    if (!cmd) throw new Error(`Invalid command '${command}'.`)
    return cmd.run(...args);
  }

}

const FactoryCommands: ICommand[] = [
  new CreateCommand()
]