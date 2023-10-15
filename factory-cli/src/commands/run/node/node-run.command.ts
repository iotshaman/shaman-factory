import * as _path from 'path';
import * as _cmd from 'child_process';
import { ChildProcessWithoutNullStreams } from 'child_process';
import { IEnvironmentCommand } from "../../command";
import { SolutionProject } from '../../../models/solution';

export class NodeRunCommand implements IEnvironmentCommand {

  get environment(): string { return "node"; }
  waitForChildProcesses?: Promise<void>;
  /* istanbul ignore next */
  private npm: string = process.platform === 'win32' ? 'npm.cmd' : 'npm';

  constructor(
    private script: string,
    private solutionFilePath: string
  ) { }

  run = (project: SolutionProject): Promise<void> => {
    console.log(`Running node script '${this.script} for project ${project.name}.`);
    return this.spawnChildProcess(this.solutionFilePath, project, this.script)
      .then(childProcess => {
        this.waitForChildProcesses = new Promise<void>((res) => childProcess.on('close', (_code) => res()));
      });
  }

  private spawnChildProcess = (solutionFilePath: string, solutionProject: SolutionProject, 
    script: string): Promise<ChildProcessWithoutNullStreams> => {
    return new Promise((res) => {
      let cwd = _path.join(solutionFilePath.replace('shaman.json', ''), solutionProject.path);
      let childProcess = _cmd.spawn(this.npm, ['run', script], { cwd });
      childProcess.stdout.on('data', (data) => process.stdout.write(`${data}`));
      childProcess.stderr.on('data', (data) => process.stderr.write(`${data}`));
      res(childProcess);
    });
  }

}