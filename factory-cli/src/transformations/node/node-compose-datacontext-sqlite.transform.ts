import { ProjectTransformation, Solution } from "../../models/solution";
import { FileService, IFileService } from "../../services/file.service";
import { ITypescriptSourceService, TypescriptSourceService } from "../../services/source/typescript-source.service";
import { ITransformation } from "../transformation";

export class NodeComposeSqliteDataContextTransformation implements ITransformation {

  get name(): string { return "compose:datacontext-sqlite"; }
  get environment(): string { return "node"; }
  get language(): string { return "typescript"; }
  fileService: IFileService = new FileService();
  sourceService: ITypescriptSourceService = new TypescriptSourceService();

  transform = (transformation: ProjectTransformation, solution: Solution, solutionFolderPath: string): Promise<void> => {
    const project = solution.projects.find(p => p.name == transformation.targetProject);
    if (!project) return Promise.reject(new Error(`Invalid target project in transformation: '${transformation.targetProject}'.`));
    let databaseProject = solution.projects.find(p => p.name == transformation.sourceProject);
    if (!databaseProject) return Promise.reject(new Error(`Invalid source project in transformation: '${transformation.sourceProject}'.`));
    const contextName = databaseProject.specs?.contextName ?? "SampleDatabaseContext";
    return this.sourceService.createAppConfigFromSampleConfig(solutionFolderPath, project)
      .then(_ => this.sourceService.addSqliteAppConfigurationJson(solutionFolderPath, project))
      .then(_ => this.sourceService.addSqliteAppConfigurationModel(solutionFolderPath, project))
      .then(_ => this.sourceService.addDataContextCompositionType(solutionFolderPath, project, contextName))
      .then(_ => this.sourceService.addDataContextComposition(solutionFolderPath, project, databaseProject.name, contextName, "sqliteConfig"));
  }

}