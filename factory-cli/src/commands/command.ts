import { CommandLineArguments } from "../command-line-arguments";
import { SolutionProject } from "../models/solution";

export interface ICommand {
  name: string;
  run: (cla: CommandLineArguments) => Promise<void>;
}

export interface IEnvironmentCommand {
  environment: string;
  run: (project?: SolutionProject) => Promise<void>;
  waitForChildProcesses?: Promise<void>;
}

export interface IListCommand {
  flag: string;
  run: () => Promise<void>;
}