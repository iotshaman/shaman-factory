import { CommandLineArguments } from "../../command-line-arguments";
import { ICommand, IEnvironmentCommand } from "../../commands/command";
import { FileService, IFileService } from "../../services/file.service";
import { DotnetInstallCommand } from "./dotnet/dotnet-install.command";
import { InstallArguments } from "./install.arguments";
import { NodeInstallCommand } from "./node/node-install.command";

export class InstallCommand implements ICommand {

  get name(): string { return "install"; }
  environmentCommands: IEnvironmentCommand[] = [];
  fileService: IFileService = new FileService();
  environmentCommandFactory = (solutionFilePath: string): IEnvironmentCommand[] => {
    return [
      new NodeInstallCommand(solutionFilePath),
      new DotnetInstallCommand(solutionFilePath)
    ]
  }

  run = async (cla: CommandLineArguments): Promise<void> => {
    const args = new InstallArguments(cla);
    this.environmentCommands = this.environmentCommandFactory(args.solutionFilePath);
    if (args.environment != "*") return this.installEnvironment(args.environment);
    let installEnvironmentsTask = this.fileService.getShamanFile(args.solutionFilePath).then(solution => {
      let projectEnvironments = solution.projects.map(p => p.environment);
      let environmentSet = [...new Set(projectEnvironments)];
      return environmentSet.reduce((a, b) => a.then(_ =>
        this.installEnvironment(b)
      ), Promise.resolve());
    });
    await installEnvironmentsTask;
    console.log("Solution install is complete.");
  }

  private installEnvironment = (environment: string): Promise<void> => {
    let cmd = this.environmentCommands.find(c => c.environment == environment);
    if (!cmd) return Promise.reject(new Error(`Invalid environment '${environment}'.`));
    return cmd.run();
  }

}
