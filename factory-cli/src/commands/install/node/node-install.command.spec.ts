import 'mocha';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { createMock } from 'ts-auto-mock';
import { IFileService } from '../../../services/file.service';
import { NodeInstallCommand } from './node-install.command';
import { IEnvironmentService } from '../../../services/environments/environment.service';

describe('Install Node Environment Command', () => {

  var sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(console, 'log');
  })

  afterEach(() => {
    sandbox.restore();
  });

  it('name should equal "install-node"', () => {
    let subject = new NodeInstallCommand(solutionFilePath);
    expect(subject.environment).to.equal("node");
  });

  it('run should return resolved promise if no projects defined', (done) => {
    let fileServiceMock = createMock<IFileService>();
    fileServiceMock.getShamanFile = sandbox.stub().returns(Promise.resolve({projects: []}));
    let subject = new NodeInstallCommand(solutionFilePath);
    subject.fileService = fileServiceMock;
    subject.run().then(_ => done());
  });

  it('run should return resolved promise', (done) => {
    let fileServiceMock = createMock<IFileService>();
    fileServiceMock.getShamanFile = sandbox.stub().returns(Promise.resolve({projects: [
      {
        name: "sample",
        path: "sample",
        environment: "node"
      }
    ]}));
    let environmentServiceMock = createMock<IEnvironmentService>();
    environmentServiceMock.installDependencies = sandbox.stub().returns(Promise.resolve());
    let subject = new NodeInstallCommand(solutionFilePath);
    subject.fileService = fileServiceMock;
    subject.environmentService = environmentServiceMock;
    subject.run().then(_ => done());
  });

});

let solutionFilePath: string = './shaman.json';
