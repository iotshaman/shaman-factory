import * as _path from 'path';
import { IEnvironmentCommand, ICommand } from '../command';
import { Solution } from '../../models/solution';
import { IFileService, FileService } from '../../services/file.service';
import { IPublishInstructionService } from './instructions/publish-instruction-service';
import { IPublishInstruction } from './publish-instruction';
import { CopyFilePublishInstructionService } from './instructions/copy-file.instruction';
import { CommandLineArguments } from '../../command-line-arguments';
import { PublishArguments } from './publish.arguments';
import { NodePublishCommand } from './node/node-publish.command';
import { DotnetPublishCommand } from './dotnet/dotnet-publish.command';

export class PublishCommand implements ICommand {

  get name(): string { return "publish" };
  environmentCommands: IEnvironmentCommand[] = [];
  publishInstructionsServices: IPublishInstructionService[] = [
    new CopyFilePublishInstructionService()
  ];
  fileService: IFileService = new FileService();
  childCommandFactory = (solutionFilePath: string): IEnvironmentCommand[] => {
    return [
      new NodePublishCommand(solutionFilePath),
      new DotnetPublishCommand(solutionFilePath)
    ]
  }

  run = (cla: CommandLineArguments): Promise<void> => {
    const args = new PublishArguments(cla);
    this.environmentCommands = this.childCommandFactory(args.solutionFilePath);
    console.log("Publishing solution...");
    let cwd = args.solutionFilePath.replace("shaman.json", "");
    let publishEnvironmentsTask = () => this.fileService.getShamanFile(args.solutionFilePath).then(solution => {
      if (args.environment != "*") {
        return this.publishEnvironment(args.environment)
          .then(_ => ({solution, environments: [args.environment]}));
      }
      let projectEnvironments = solution.projects.map(p => p.environment);
      let environmetsSet = [...new Set(projectEnvironments)];
      return environmetsSet.reduce((a, b) => a.then(_ =>
        this.publishEnvironment(b)
      ), Promise.resolve())
      .then(_ => ({solution, environments: environmetsSet}));
    });
    return this.fileService.ensureFolderExists(cwd, "bin")
      .then(_ => publishEnvironmentsTask())
      .then(rslt => this.processInstructions(cwd, rslt.solution, rslt.environments))
      .then(_ => console.log("Solution publish is complete."));
  }

  private publishEnvironment(environment: string): Promise<void> {
    let cmd = this.environmentCommands.find(c => c.environment == environment)
    if (!cmd) return Promise.reject(new Error(`Invalid environment '${environment}'.`));
    return cmd.run();
  }

  private processInstructions = (cwd: string, solution: Solution, environments: string[]): Promise<void> => {
    let instructions: {project: string, instruction: IPublishInstruction}[] = solution.projects 
      .filter(p => environments.some(e => e == p.environment))
      .filter(p => !!p.specs?.publish?.length)
      .map(p => ({name: p.name, instructions: <IPublishInstruction[]>p.specs.publish}))
      .reduce((a: {project: string, instruction: IPublishInstruction}[], b) => {
        b.instructions.forEach(instruction => a.push({project: b.name, instruction: instruction}))
        return a;
      }, []);

    return instructions.reduce((a, b) => a.then(_ => {
      let instructionService = this.publishInstructionsServices
        .find(i => i.instruction == b.instruction.instruction);
      if (!instructionService) throw new Error(`Invalid publish instruction: '${b.instruction.instruction}'.`);
      let project = solution.projects.find(p => p.name == b.project);
      return instructionService.processInstruction(cwd, solution, project);
    }), Promise.resolve());
  }

}
