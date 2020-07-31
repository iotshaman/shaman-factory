import { CreateCommand } from "./commands/create.command";
import { ICommand } from "./commands/command";

export class Factory {

  constructor(private commands: ICommand[] = FactoryCommands) { }

  Generate = (command: string, args: string[]) => {
    if (!command) throw new Error("Command parameter not provided.");
    let cmd = this.commands.find(c => c.name == command);
    if (!cmd) throw new Error(`Invalid command '${command}'.`)
    cmd.run(...args).catch(ex => {
      console.error(ex);
      process.exit(1);
    })
  }

}

const FactoryCommands: ICommand[] = [
  new CreateCommand()
]