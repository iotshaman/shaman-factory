import * as _path from 'path';
import { CommandLineArguments } from '../../command-line-arguments';
import { IEnvironmentCommand, ICommand } from "../../commands/command";
import { FileService, IFileService } from '../../services/file.service';
import { DotnetRunCommand } from './dotnet/dotnet-run.command';
import { NodeRunCommand } from './node/node-run.command';
import { RunArguments } from './run.arguments';

export class RunCommand implements ICommand {

  get name(): string { return "run"; }
  runCommands: IEnvironmentCommand[] = [];
  fileService: IFileService = new FileService();
  childCommandFactory = (script: string, solutionFilePath: string): IEnvironmentCommand[] => {
    return [
      new NodeRunCommand(script, solutionFilePath),
      new DotnetRunCommand(solutionFilePath)
    ]
  }

  run = (cla: CommandLineArguments): Promise<void> => {
    const args = new RunArguments(cla);
    if (!args.project) return Promise.reject(new Error('Project argument not provided to run command.'));
    return this.fileService.getShamanFile(args.solutionFilePath)
      .then(solution => {
        let solutionProject = solution.projects.find(p => p.name == args.project);
        if (!solutionProject) throw new Error(`Invalid project '${args.project}'.`);
        this.runCommands = this.childCommandFactory(args.script, args.solutionFilePath);
        let cmd = this.runCommands.find(c => c.environment == solutionProject.environment);
        if (!cmd) return Promise.reject(new Error(`Invalid environment '${solutionProject.environment}'.`));
        return cmd.run(solutionProject).then(_ => cmd);
      })
      .then(cmd => cmd.waitForChildProcesses);
  }

}
