import * as _path from 'path';
import { Solution, SolutionProject } from "../../../models/solution";
import { FileService, IFileService } from "../../../services/file.service";
import { IPublishInstruction } from "../publish-instruction";
import { IPublishInstructionService } from "./publish-instruction-service";

export interface UpdateJsonPublishInstruction extends IPublishInstruction {
  instruction: string;
  arguments: {path: string; replace: any}[];
}

export class UpdateJsonPublishInstructionService implements IPublishInstructionService {

  fileService: IFileService = new FileService();
  get instruction(): string { return "json"; }

  processInstruction = (cwd: string, _solution: Solution, project: SolutionProject): Promise<void> => {
    const instruction: UpdateJsonPublishInstruction = project.specs.publish
      .find((i: IPublishInstruction) => i.instruction == "json");

    const updateJsonTasks = instruction.arguments.map(a => {
      let projectPath = _path.join(cwd, 'bin', project.environment, project.path);
      let jsonFilePath = _path.join(projectPath, a.path);
      return this.fileService.readJson(jsonFilePath).then(file => {
        const propNames = Object.keys(a.replace);
        for (const name of propNames) file[name] = a.replace[name];
        return this.fileService.writeJson(jsonFilePath, file);
      });
    });
    return Promise.all(updateJsonTasks).then(_ => (null));
  }

}