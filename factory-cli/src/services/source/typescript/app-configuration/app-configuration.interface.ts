import { SolutionProject } from "../../../../models/solution";

export interface IAppConfiguration {
  configType: string;
  getConfigName(): string;
  addAppConfigurationJson(solutionFolderPath: string, project: SolutionProject): Promise<void>;
  addAppConfigurationModel(solutionFolderPath: string, project: SolutionProject): Promise<void>;
}