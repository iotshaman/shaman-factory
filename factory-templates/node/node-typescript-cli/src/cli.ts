import { ICommand } from "./commands/command";
import { EchoCommand } from "./commands/echo.command";
import { MenuCommand } from "./commands/menu.command";
import { CommandLineInput } from "./models/command-line-input";
import { KeyValuePair } from "./models/key-value-pair";
import { Prompt } from "./models/prompt";
import { UserInterfaceService } from "./services/user-interface.service";

let commands: ICommand[] = [
  new MenuCommand(),
  new EchoCommand()
];

(async function() {
  if (process.argv.length > 3) {
    // SINGLE-PURPOSE COMMAND
    let args = new CommandLineInput(process.argv);
    let command = commands.find(c => c.name == args.command);
    if (command == null) throw new Error(`Invalid command '${args.command}'.`);
    await command.run(args);
  } else {
    // INTERACTIVE COMMAND
    console.log("Welcome to your CLI!");
    let userInterface = new UserInterfaceService();
    let menuCommand = new MenuCommand();
    menuCommand.run(null);
    let response: KeyValuePair = {key: '', value: ''};
    while (response.value != 'exit') {
      response = await userInterface.prompt(new Prompt("cmd", ""));
      if (response.value == 'exit') continue;
      let command = commands.find(c => c.name == response.value);
      if (command == null) {
        console.log(`Invalid command '${response.value}'.`);
        menuCommand.run(null);
        continue;
      }
      await command.run(null);
      console.log(`\r\n${command.name} has finished processing, please enter another command or type 'exit' to close.`);
    }
  }
})();