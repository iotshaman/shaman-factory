import * as _path from 'path';
import { ISourceFactory } from '../../../../factories/source/source.factory';
import { TypescriptSourceFactory } from '../../../../factories/source/typescript-source.factory';
import { SolutionProject } from "../../../../models/solution";
import { FileService, IFileService } from '../../../file.service';
import { IAppConfiguration } from "./app-configuration.interface";

export class MysqlAppConfigurationService implements IAppConfiguration {

  configType: string = "mysql";
  fileService: IFileService = new FileService();
  sourceFactory: ISourceFactory = new TypescriptSourceFactory();

  getConfigName(): string {
    return "mysqlConfig";
  }

  addAppConfigurationJson = (solutionFolderPath: string, project: SolutionProject): Promise<void> => {
    const projectFolderPath = _path.join(solutionFolderPath, project.path);
    const configFilePath = _path.join(projectFolderPath, 'app', 'config', 'app.config.json');
    const sampleConfigFilePath = _path.join(projectFolderPath, 'app', 'config', 'app.config.sample.json');
    const mysqlConfig: any = {
      connectionLimit: 10,
      host: "",
      user: "",
      password: "",
      database: "",
      waitForConnections: false
    }
    const updateConfigFileTask = this.fileService.readJson<any>(configFilePath).then(config => {
      config.mysqlConfig = mysqlConfig;
      return this.fileService.writeJson(configFilePath, config);
    });
    const updateSampleConfigFileTask = this.fileService.readJson<any>(sampleConfigFilePath).then(config => {
      config.mysqlConfig = mysqlConfig;
      return this.fileService.writeJson(sampleConfigFilePath, config);
    });
    return Promise.all([updateConfigFileTask, updateSampleConfigFileTask]).then(_ => null);
  }

  addAppConfigurationModel = (solutionFolderPath: string, project: SolutionProject): Promise<void> => {
    const projectFolderPath = _path.join(solutionFolderPath, project.path);
    const configFilePath = _path.join(projectFolderPath, 'src', 'models', 'app.config.ts');
    return this.fileService.getSourceFile(configFilePath).then(sourceFile => {
      const importHook = sourceFile.transformationLines.find(l => l.lifecycleHookData.args.type == "import");
      const configHook = sourceFile.transformationLines.find(l => l.lifecycleHookData.args.type == "config");
      if (!importHook) throw new Error("No import hook found in app config.");
      if (!configHook) throw new Error("No configuration hook found in app config.");
      const importLineFactory = () => {
        return this.sourceFactory.buildImportStatement(importHook, "mysql", ["PoolConfig"])
      };
      const buildAppConfigPropertyFactory = () => {
        return this.sourceFactory.buildClassProperty(configHook, "mysqlConfig", "PoolConfig")
      };
      sourceFile.replaceLines(importHook.index, importLineFactory);
      sourceFile.replaceLines(configHook.index, buildAppConfigPropertyFactory);
      return this.fileService.writeFile(configFilePath, sourceFile.toString());
    });
  }

}