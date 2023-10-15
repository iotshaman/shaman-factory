import 'mocha';
import * as sinon from 'sinon';
import * as _cmd from 'child_process';
import { expect } from 'chai';
import { NodeRunCommand } from './node-run.command';
import { Solution, SolutionProject } from '../../../models/solution';

describe('Run Node Environment Command', () => {

  var sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(console, 'log');
  })

  afterEach(() => {
    sandbox.restore();
  });

  it('name should equal "node"', () => {
    let subject = new NodeRunCommand('start', './shaman.json');
    expect(subject.environment).to.equal("node");
  });

  it('run should return resolved promise', (done) => {
    let sampleSolution = new SampleSolution();
    let subject = new NodeRunCommand('start', './shaman.json');
    let spawnMock: any = {
      stdout: { on: sandbox.stub().yields("output") },
      stderr: { on: sandbox.stub().yields("error") },
      on: sandbox.stub().yields(0)
    };
    sandbox.stub(_cmd, 'spawn').returns(spawnMock);
    subject.run(sampleSolution.projects[0]).then(_ => done());
  });

});

class SampleSolution implements Solution {
  name: string;
  projects: SolutionProject[];

  constructor() {
    this.name = 'sample';
    this.projects = [
      {
        name: "sample",
        path: "sample",
        environment: "node",
        template: "server"
      }
    ]
  }

}
