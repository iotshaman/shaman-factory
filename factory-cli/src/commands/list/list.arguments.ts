import { CommandLineArguments } from "../../command-line-arguments";

export class ListArguments {
  targetListFlag: string;
  private listFlags: string[] = ['-templates', '-recipes'];

  constructor(args: CommandLineArguments) {
    this.targetListFlag = this.getTargetListFlag(args);
  }

  private getTargetListFlag = (args: CommandLineArguments): string => {
    return args.getAllActiveFlags()
      .filter(f => this.listFlags.includes(f))[0];
  }
}
