import * as _path from 'path';
import * as _cmd from 'child_process';
import { ChildProcessWithoutNullStreams } from 'child_process';
import { IEnvironmentCommand } from "../../command";
import { SolutionProject } from '../../../models/solution';

export class DotnetRunCommand implements IEnvironmentCommand {

  get environment(): string { return "dotnet"; }
  waitForChildProcesses?: Promise<void>;

  constructor(private solutionFilePath: string) { }

  run = (project: SolutionProject): Promise<void> => {
    console.log(`Running dotnet run script for project ${project.name}.`);
    return this.spawnChildProcess(this.solutionFilePath, project)
      .then(childProcess => {
        this.waitForChildProcesses = new Promise<void>((res) => childProcess.on('close', (_code) => res()));
      });
  }

  private spawnChildProcess = (solutionFilePath: string, project: SolutionProject): Promise<ChildProcessWithoutNullStreams> => {
    return new Promise((res) => {
      let cwd = _path.join(solutionFilePath.replace('shaman.json', ''), project.path);
      let childProcess = _cmd.spawn("dotnet", ['run', "--no-build"], { cwd });
      childProcess.stdout.on('data', (data) => process.stdout.write(`${data}`));
      childProcess.stderr.on('data', (data) => process.stderr.write(`${data}`));
      res(childProcess);
    });
  }

}