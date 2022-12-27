import * as _path from 'path';
import { CommandLineArguments } from "../../command-line-arguments";

export class GenerateArguments {

  solutionName: string;
  filePath: string;
  template: string;
  recipeName: string;
  addFlag: boolean;

  constructor(args: CommandLineArguments) {
    this.solutionName = args.getValueOrDefault('name');
    this.filePath = args.getValueOrDefault('filePath');
    this.template = args.getValueOrDefault('template');
    this.recipeName = args.getValueOrDefault('recipe');
    this.addFlag = args.getFlag('-add');
  }

}