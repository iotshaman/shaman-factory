import * as _path from 'path';
import { spawn } from 'child_process';
import { Solution, SolutionProject } from '../../../models/solution';
import { FileService, IFileService } from '../../../services/file.service';
import { IEnvironmentService } from '../../../services/environments/environment.service';
import { ITemplateService, TemplateService } from '../../../services/template.service';
import { DotnetEnvironmentService } from '../../../services/environments/dotnet-environment.service';
import { IEnvironmentCommand } from '../../command';

export class DotnetScaffoldCommand implements IEnvironmentCommand {

  get environment(): string { return "dotnet"; }
  fileService: IFileService = new FileService();
  environmentService: IEnvironmentService = new DotnetEnvironmentService();
  templateService: ITemplateService = new TemplateService();

  constructor(
    private solution: Solution,
    private solutionFolder: string
  ) { }

  run = (project: SolutionProject): Promise<void> => {
    let projectName = project.name;
    if (!project.template) return Promise.reject(new Error(`Invalid template name configuration (project=${projectName}).`));
    if (!project.path) return Promise.reject(new Error(`Invalid project path configuration (project=${projectName}).`));
    let templateName = project.template, projectPath = project.path, name = project.name;
    let folderPath = _path.join(this.solutionFolder, projectPath);
    let language = project.language;
    console.log(`Scaffolding dotnet ${templateName}.`);
    return this.environmentService.checkNamingConvention(name, this.solution.name)
      .then(_ => this.addDotnetSolutionFile(this.solution.name, this.solutionFolder))
      .then(_ => this.fileService.createFolderRecursive(this.solutionFolder + projectPath))
      .then(_ => {
        if (project.custom) return this.templateService.getCustomTemplate("dotnet", templateName, this.solution.auth, language);
        else return this.templateService.getTemplate("dotnet", templateName);
      })
      .then(template => {
        if (project.custom) return this.templateService.unzipCustomProjectTemplate(template, folderPath);
        else return this.templateService.unzipProjectTemplate(template, folderPath);
      })
      .then(_ => this.environmentService.updateProjectDefinition(folderPath, name, this.solution))
      .then(_ => this.environmentService.addProjectScaffoldFile(folderPath, name, this.solution))
      .then(_ => this.environmentService.installDependencies(folderPath, name))
      .then(_ => this.environmentService.executeProjectScaffolding(folderPath))
      .then(_ => this.addDotnetProjectToSolutionFile(this.solution.name, this.solutionFolder, projectPath))
      .then(_ => {
        console.log("Scaffolding is complete.");
      })
  }

  private addDotnetSolutionFile = (solutionName: string, solutionFolder: string): Promise<void> => {
    const dotnetSolutionFilePath = _path.join(solutionFolder, `${solutionName}.sln`);
    return this.fileService.pathExists(dotnetSolutionFilePath).then(exists => {
      if (!!exists) return Promise.resolve();
      return new Promise((res, err) => {
        let childProcess = spawn("dotnet", ["new", "sln", "--name", solutionName], { cwd: solutionFolder });
        childProcess.stdout.on('data', (data) => process.stdout.write(`${data}`));
        childProcess.stderr.on('data', (data) => process.stderr.write(`${data}`));
        childProcess.on('close', (code) => code === 0 ? res() : err(
          new Error("An error occurred while adding dotnet solution file.")
        ));
      });
    });
  }

  private addDotnetProjectToSolutionFile = (solutionName: string, solutionFolder: string, projectFolder: string): Promise<void> => {
    return new Promise((res, err) => {
      let childProcess = spawn("dotnet", ["sln", `${solutionName}.sln`, "add", projectFolder], { cwd: solutionFolder });
      childProcess.stdout.on('data', (data) => process.stdout.write(`${data}`));
      childProcess.stderr.on('data', (data) => process.stderr.write(`${data}`));
      childProcess.on('close', (code) => code === 0 ? res() : err(
        new Error("An error occurred while adding dotnet project to solution.")
      ));
    });
  }

}