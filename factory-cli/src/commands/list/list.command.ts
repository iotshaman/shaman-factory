import { CommandLineArguments } from "../../command-line-arguments";
import { ICommand, IListCommand } from "../command";
import { ListArguments } from "./list.arguments";
import { ListRecipesCommand } from "./recipes/list-recipes.command";
import { ListTemplatesCommand } from "./templates/list-templates.command";

export class ListCommand implements ICommand {
  get name(): string { return "ls"; };
  listCommandFactory = (): IListCommand[] => {
    return [
      new ListTemplatesCommand(),
      new ListRecipesCommand()
    ]
  }

  run = (cla: CommandLineArguments): Promise<void> => {
    const args = new ListArguments(cla);
    const cmd = this.listCommandFactory().find(c => c.flag === args.targetListFlag);
    if (!cmd) return Promise.reject(new Error('Invalid list flag provided.'));
    return cmd.run();
  };

} 