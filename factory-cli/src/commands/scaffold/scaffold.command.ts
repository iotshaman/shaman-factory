import * as _path from 'path';
import { IEnvironmentCommand, ICommand } from "../command";
import { IFileService, FileService } from "../../services/file.service";
import { Solution, SolutionProject } from "../../models/solution";
import { DependencyTree } from '../../models/dependency-tree';
import { ITransformationService, TransformationService } from '../../services/transformation.service';
import { CommandLineArguments } from '../../command-line-arguments';
import { ScaffoldArguments } from './scaffold.arguments';
import { NodeScaffoldCommand } from './node/node-scaffold.command';
import { DotnetScaffoldCommand } from './dotnet/dotnet-scaffold.command';

export class ScaffoldCommand implements ICommand {

  get name(): string { return "scaffold"; }
  fileService: IFileService = new FileService();
  transformationService: ITransformationService = new TransformationService();
  environmentCommands: IEnvironmentCommand[] = [];
  childCommandFactory = (solution: Solution, solutionFolder: string): IEnvironmentCommand[] => {
    return [
      new DotnetScaffoldCommand(solution, solutionFolder),
      new NodeScaffoldCommand(solution, solutionFolder)
    ]
  }

  run = (cla: CommandLineArguments): Promise<void> => {
    const args = new ScaffoldArguments(cla);
    console.log(`Scaffolding solution...`);
    let solution: Solution;
    return this.fileService.getShamanFile(args.solutionFilePath)
      .then(rslt => solution = rslt)
      .then(_ => this.scaffoldSolution(args.solutionFilePath, solution))
      .then(newProjects => this.transformationService.performTransformations(solution, args.solutionFilePath, newProjects))
      .then(_ => {
        console.log("Solution scaffolding is complete.");
      });
  }

  private scaffoldSolution = (solutionFilePath: string, solution: Solution): Promise<string[]> => {
    let cwd = solutionFilePath.replace('shaman.json', '');
    let newProjects = [];
    if (!solution.projects.length) {
      console.warn("No projects found in solution file.");
      return Promise.resolve(null);
    }
    this.environmentCommands = this.childCommandFactory(solution, cwd);
    let dependencyTree = new DependencyTree(solution.projects);
    let scaffoldOrder = dependencyTree.getOrderedProjectList();
    return scaffoldOrder.reduce((a, b) => a.then(_ => {
      let project = solution.projects.find(p => p.name == b);
      return this.fileService.pathExists(_path.join(cwd, project.path))
        .then(pathExists => {
          if (!pathExists) {
            newProjects.push(project.name)
            return this.scaffoldProject(project);
          }
        });
    }), Promise.resolve())
      .then(_ => Promise.resolve(newProjects));
  }

  private scaffoldProject = (project: SolutionProject): Promise<void> => {
    let cmd = this.environmentCommands.find(c => c.environment == project.environment);
    if (!cmd) return Promise.reject(new Error(`Invalid environment '${project.environment}'.`));
    return cmd.run(project);
  }

}
