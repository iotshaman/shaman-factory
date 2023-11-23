import * as _path from 'path';
import { ISourceFactory } from "../../../factories/source/source.factory";
import { TypescriptSourceFactory } from "../../../factories/source/typescript-source.factory";
import { SolutionProject } from "../../../models/solution";
import { FileService, IFileService } from '../../file.service';
import { IAppConfiguration } from './app-configuration/app-configuration.interface';
import { MysqlAppConfigurationService } from './app-configuration/mysql-app-configuration.service';
import { SqliteAppConfigurationService } from './app-configuration/sqlite-app-configuration.service';

export interface ITypescriptSourceService {
  createAppConfigFromSampleConfig: (solutionFolderPath: string, project: SolutionProject) => Promise<void>;
  addAppConfigurationJson: (solutionFolderPath: string, project: SolutionProject, databaseType: string) => Promise<void>;
  addAppConfigurationModel: (solutionFolderPath: string, project: SolutionProject, databaseType: string) => Promise<void>;
  addDataContextCompositionType: (solutionFolderPath: string, project: SolutionProject, contextName: string) => Promise<void>;
  addDataContextComposition: (solutionFolderPath: string, project: SolutionProject,
    databaseProjectName: string, contextName: string, configName: string) => Promise<void>;
}

export class TypescriptSourceService implements ITypescriptSourceService {

  fileService: IFileService = new FileService();
  sourceFactory: ISourceFactory = new TypescriptSourceFactory();
  appConfigurationServiceArray: IAppConfiguration[] = [
    new MysqlAppConfigurationService(),
    new SqliteAppConfigurationService()
  ]

  createAppConfigFromSampleConfig = (solutionFolderPath: string, project: SolutionProject): Promise<void> => {
    const projectFolderPath = _path.join(solutionFolderPath, project.path);
    const configFilePath = _path.join(projectFolderPath, 'app', 'config', 'app.config.json');
    const sampleConfigFilePath = _path.join(projectFolderPath, 'app', 'config', 'app.config.sample.json');
    return this.fileService.copyFile(sampleConfigFilePath, configFilePath);
  }

  addAppConfigurationJson = (solutionFolderPath: string, project: SolutionProject, databaseType: string): Promise<void> => {
    const configService = this.appConfigurationServiceArray.find(s => s.configType == databaseType);
    return configService.addAppConfigurationJson(solutionFolderPath, project);
  }

  addAppConfigurationModel = (solutionFolderPath: string, project: SolutionProject, databaseType: string): Promise<void> => {
    const configService = this.appConfigurationServiceArray.find(s => s.configType == databaseType);
    return configService.addAppConfigurationModel(solutionFolderPath, project);
  }

  addDataContextCompositionType = (solutionFolderPath: string, project: SolutionProject, contextName: string): Promise<void> => {
    const projectFolderPath = _path.join(solutionFolderPath, project.path);
    const typesFilePath = _path.join(projectFolderPath, 'src', 'composition', 'app.composition.types.ts');
    return this.fileService.getSourceFile(typesFilePath).then(sourceFile => {
      const compositionHook = sourceFile.transformationLines
        .filter(l => l.lifecycleHookData.args.type == "compose")
        .find(l => l.lifecycleHookData.args.target == "TYPES");
      if (!compositionHook) throw new Error("No composition hook found in TYPES objects.");
      const buildAppConfigPropertyFactory = () => {
        return this.sourceFactory.buildObjectPropertyAssignment(compositionHook, contextName, contextName)
      };
      sourceFile.replaceLines(compositionHook.index, buildAppConfigPropertyFactory);
      return this.fileService.writeFile(typesFilePath, sourceFile.toString());
    });
  }

  addDataContextComposition = (solutionFolderPath: string, project: SolutionProject,
    databaseProjectName: string, contextName: string, databaseType: string): Promise<void> => {
    const configService = this.appConfigurationServiceArray.find(s => s.configType == databaseType);
    const configName = configService.getConfigName();
    const projectFolderPath = _path.join(solutionFolderPath, project.path);
    const compositionFilePath = _path.join(projectFolderPath, 'src', 'composition', 'app.composition.ts');
    return this.fileService.getSourceFile(compositionFilePath).then(sourceFile => {
      const importHook = sourceFile.transformationLines.find(l => l.lifecycleHookData.args.type == "import");
      const compositionHook = sourceFile.transformationLines
        .filter(l => l.lifecycleHookData.args.type == "compose")
        .find(l => l.lifecycleHookData.args.target == "datacontext");
      if (!importHook) throw new Error("No import hook found in composition file.");
      if (!compositionHook) throw new Error("No data context composition hook found in composition file.");
      const importLineFactory = () => {
        return this.sourceFactory.buildImportStatement(importHook, databaseProjectName, [`I${contextName}`, contextName])
      };
      const composeLineFactory = () => this.sourceFactory.buildDataContextComposition(compositionHook, contextName, configName);
      sourceFile.replaceLines(importHook.index, importLineFactory);
      sourceFile.replaceLines(compositionHook.index, composeLineFactory);
      return this.fileService.writeFile(compositionFilePath, sourceFile.toString());
    });
  }

}
