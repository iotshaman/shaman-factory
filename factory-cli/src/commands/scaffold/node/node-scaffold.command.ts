import * as _path from 'path';
import { Solution, SolutionProject } from '../../../models/solution';
import { FileService, IFileService } from '../../../services/file.service';
import { IEnvironmentService } from '../../../services/environments/environment.service';
import { NodeEnvironmentService } from '../../../services/environments/node-environment.service';
import { ITemplateService, TemplateService } from '../../../services/template.service';
import { IEnvironmentCommand } from '../../command';

export class NodeScaffoldCommand implements IEnvironmentCommand {

  get environment(): string { return "node"; }
  fileService: IFileService = new FileService();
  environmentService: IEnvironmentService = new NodeEnvironmentService();
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
    console.log(`Scaffolding node ${templateName}.`);
    return this.environmentService.checkNamingConvention(name)
      .then(_ => {
        if (project.custom) return this.getAndUnzipCustomTemplate(templateName, folderPath);
        else return this.getAndUnzipTemplate(templateName, folderPath);
      })
      .then(_ => this.environmentService.updateProjectDefinition(folderPath, name, this.solution))
      .then(_ => this.environmentService.addProjectScaffoldFile(folderPath, name, this.solution))
      .then(_ => this.environmentService.installDependencies(folderPath, name))
      .then(_ => this.environmentService.executeProjectScaffolding(folderPath))
      .then(_ => {
        console.log("Scaffolding complete.");
      })
  }

  private getAndUnzipTemplate = (templateName: string, folderPath: string): Promise<void> => {
    return this.templateService.getTemplate("node", templateName)
      .then(template => this.templateService.unzipProjectTemplate(template, folderPath));
  }

  private getAndUnzipCustomTemplate = (templateName: string, folderPath: string): Promise<void> => {
    return this.templateService.getCustomTemplate("node", templateName, this.solution.auth)
      .then(template => this.templateService.unzipCustomProjectTemplate(template, folderPath));
  }
}
