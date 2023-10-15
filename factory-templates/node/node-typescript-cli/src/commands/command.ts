import { CommandLineInput } from "../models/command-line-input";

export interface ICommand {
  name: string;
  run: (args: CommandLineInput) => Promise<void>;
}
