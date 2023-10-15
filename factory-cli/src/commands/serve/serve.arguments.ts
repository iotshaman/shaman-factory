import * as _path from 'path';
import { CommandLineArguments } from "../../command-line-arguments";

export class ServeArguments {

  project: string;
  script: string;
  solutionFilePath: string;

  constructor(args: CommandLineArguments) {
    this.project = args.getValueOrDefault('project');
    this.solutionFilePath = args.getValueOrDefault("filePath");
    this.solutionFilePath = _path.join(process.cwd(), this.solutionFilePath);
  }

}