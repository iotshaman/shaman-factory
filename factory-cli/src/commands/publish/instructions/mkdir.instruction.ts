import * as _path from 'path';
import { Solution, SolutionProject } from "../../../models/solution";
import { FileService, IFileService } from "../../../services/file.service";
import { IPublishInstruction } from "../publish-instruction";
import { IPublishInstructionService } from "./publish-instruction-service";

export interface MkdirPublishInstruction extends IPublishInstruction {
  instruction: string;
  arguments: string[];
}

export class MkdirPublishInstructionService implements IPublishInstructionService {

  fileService: IFileService = new FileService();
  get instruction(): string { return "mkdir"; }

  processInstruction = (cwd: string, _solution: Solution, project: SolutionProject): Promise<void> => {
    const instruction: MkdirPublishInstruction = project.specs.publish
      .find((i: IPublishInstruction) => i.instruction == "mkdir");

    const mkdirTasks = instruction.arguments.map(folder => {
      let projectPath = _path.join(cwd, 'bin', project.environment, project.path);
      let folderPath = _path.join(projectPath, folder);
      return this.fileService.ensureFolderExists(projectPath, folder)
        .then(_ => this.fileService.writeFile(_path.join(folderPath, '.gitkeep'), ''));
    });
    return Promise.all(mkdirTasks).then(_ => (null));
  }

}