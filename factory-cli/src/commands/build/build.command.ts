import * as _path from 'path';
import { CommandLineArguments } from "../../command-line-arguments";
import { IEnvironmentCommand, ICommand } from "../../commands/command";
import { FileService, IFileService } from "../../services/file.service";
import { BuildArguments } from './build.arguments';
import { DotnetBuildCommand } from './dotnet/dotnet-build.command';
import { NodeBuildCommand } from './node/node-build.command';

export class BuildCommand implements ICommand {

  get name(): string { return "build"; }
  environmentCommands: IEnvironmentCommand[] = [];
  fileService: IFileService = new FileService();
  childCommandFactory = (solutionFilePath: string): IEnvironmentCommand[] => {
    return [
      new NodeBuildCommand(solutionFilePath),
      new DotnetBuildCommand(solutionFilePath)
    ]
  }

  run = (cla: CommandLineArguments): Promise<void> => {
    const args = new BuildArguments(cla);
    this.environmentCommands = this.childCommandFactory(args.solutionFilePath);
    if (args.environment != "*") return this.buildEnvironment(args.environment);
    let buildEnvironmentsTask = this.fileService.getShamanFile(args.solutionFilePath).then(solution => {
      let projectEnvironments = solution.projects.map(p => p.environment);
      let environmentSet = [...new Set(projectEnvironments)];
      return environmentSet.reduce((a, b) => a.then(_ => 
        this.buildEnvironment(b)
      ), Promise.resolve());
    });
    return buildEnvironmentsTask.then(_ => console.log("Solution build is complete."));
  }

  private buildEnvironment = (environment: string): Promise<void> => {
    let cmd = this.environmentCommands.find(c => c.environment == environment);
    if (!cmd) return Promise.reject(new Error(`Invalid environment '${environment}'.`));
    return cmd.run();
  }

}
