import * as _path from 'path';
import { CommandLineArguments } from "../../command-line-arguments";

export class ScaffoldArguments {

  project: string;
  script: string;
  solutionFilePath: string;

  constructor(args: CommandLineArguments) {
    this.solutionFilePath = args.getValueOrDefault("filePath");
    this.solutionFilePath = _path.join(process.cwd(), this.solutionFilePath);
  }

}