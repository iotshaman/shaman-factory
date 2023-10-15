import * as _path from 'path';
import { ICommand, IEnvironmentCommand } from "../../commands/command";
import { Solution, SolutionProject } from '../../models/solution';
import { IFileService, FileService } from "../../services/file.service";
import { DependencyTree } from '../../models/dependency-tree';
import { DotnetRunCommand } from '../run/dotnet/dotnet-run.command';
import { NodeRunCommand } from '../run/node/node-run.command';
import { CommandLineArguments } from '../../command-line-arguments';
import { ServeArguments } from './serve.arguments';

export class ServeCommand implements ICommand {

  get name(): string { return "serve"; }
  /* istanbul ignore next */
  environentCommands: IEnvironmentCommand[] = [];
  fileService: IFileService = new FileService();
  childCommandFactory = (script: string, solutionFilePath: string): IEnvironmentCommand[] => {
    return [
      new NodeRunCommand(script, solutionFilePath),
      new DotnetRunCommand(solutionFilePath)
    ]
  }

  run = (cla: CommandLineArguments): Promise<void> => {
    const args = new ServeArguments(cla);
    if (!args.project) return Promise.reject(new Error('Project argument not provided to serve command.'));
    return this.fileService.getShamanFile(args.solutionFilePath)
      .then(solution => {
        this.environentCommands = this.childCommandFactory("start", args.solutionFilePath);
        let solutionProject = solution.projects.find(p => p.name == args.project);
        if (!solutionProject) throw new Error(`Invalid project '${args.project}'.`);
        return this.serveProject(args.project, solution);
      })
      .then(commands => Promise.all(commands.map(cmd => cmd.waitForChildProcesses)))
      .then(_ => (null));
  }

  private serveProject = (projectName: string, solution: Solution): Promise<IEnvironmentCommand[]> => {
    let commands: IEnvironmentCommand[] = [];
    let dependencyTree = new DependencyTree(solution.projects, 'runtimeDependencies');
    let buildOrder = dependencyTree.getOrderedProjectListFromNode(projectName);
    let serveTask = buildOrder.reduce((a, b) => a.then(_ => {
      let project = solution.projects.find(p => p.name == b);
      return this.serveRuntimeDependency(project)
        .then(cmd => commands.push(cmd))
        .then(_ => (null));
    }), Promise.resolve());
    return serveTask.then(_ => commands);
  }

  private serveRuntimeDependency = (project: SolutionProject): Promise<IEnvironmentCommand> => {
    let cmd = this.environentCommands.find(c => c.environment == project.environment);
    if (!cmd) return Promise.reject(new Error(`Invalid environment '${project.environment}'.`));
    return cmd.run(project).then(_ => (cmd));
  }

}