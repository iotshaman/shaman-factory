import * as _path from 'path';
import * as _cmd from 'child_process';
import { IEnvironmentCommand } from "../../command";
import { FileService, IFileService } from '../../../services/file.service';
import { Solution } from '../../../models/solution';
import { DependencyTree } from '../../../models/dependency-tree';
import { IEnvironmentService } from '../../../services/environments/environment.service';
import { NodeEnvironmentService } from '../../../services/environments/node-environment.service';

export class NodeBuildCommand implements IEnvironmentCommand {

  get environment(): string { return "node"; }
  fileService: IFileService = new FileService();
  environmentService: IEnvironmentService = new NodeEnvironmentService();

  constructor(private solutionFilePath: string) { }

  run = (): Promise<void> => {
    console.log(`Building node solution.`);
    return this.fileService.getShamanFile(this.solutionFilePath)
      .then(solution => this.buildSolution(this.solutionFilePath, solution));
  }

  private buildSolution = (solutionFilePath: string, solution: Solution): Promise<void> => {
    let cwd = solutionFilePath.replace('shaman.json', '');
    let projects = solution.projects.filter(p => p.environment == "node");
    if (!projects.length) return Promise.resolve();
    let dependencyTree = new DependencyTree(projects);
    let buildOrder = dependencyTree.getOrderedProjectList();
    return buildOrder.reduce((a, b) => a.then(_ => {
      let project = solution.projects.find(p => p.name == b);
      return this.environmentService.buildProject(project.name, _path.join(cwd, project.path));
    }), Promise.resolve());
  }

}