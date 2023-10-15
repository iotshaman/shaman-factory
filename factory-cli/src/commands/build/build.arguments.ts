import * as _path from 'path';
import { CommandLineArguments } from "../../command-line-arguments";

export class BuildArguments {

  environment: string;
  solutionFilePath: string;

  constructor(args: CommandLineArguments) {
    this.environment = args.getValueOrDefault("environment");
    this.solutionFilePath = args.getValueOrDefault("filePath");
    this.solutionFilePath = _path.join(process.cwd(), this.solutionFilePath);
  }

}