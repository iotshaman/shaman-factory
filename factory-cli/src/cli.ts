import { CommandLineArguments } from "./command-line-arguments";
import { BuildCommand, GenerateCommand, InstallCommand, PublishCommand, ServeCommand, VersionCommand } from "./commands";
import { ICommand } from "./commands/command";
import { EchoCommand } from "./commands/default/echo.command";
import { NoopCommand } from "./commands/default/noop.command";
import { ListCommand } from "./commands/list/list.command";
import { RunCommand } from "./commands/run/run.command";
import { ScaffoldCommand } from "./commands/scaffold/scaffold.command";

const commands: ICommand[] = [
  new NoopCommand(),
  new EchoCommand(),
  new VersionCommand(),
  new InstallCommand(),
  new BuildCommand(),
  new RunCommand(),
  new ScaffoldCommand(),
  new ServeCommand(),
  new PublishCommand(),
  new GenerateCommand(),
  new ListCommand()
];

export function Invoke(argv: string[]): Promise<void> {
  if (argv.length < 3) return Promise.reject(new Error("No arguments provided."));
  let cla: CommandLineArguments = new CommandLineArguments(argv);
  let cmd = commands.find(c => c.name == cla.command);
  if (!cmd) return Promise.reject(new Error(`Invalid command '${cla.command}'.`));
  return cmd.run(cla);
}