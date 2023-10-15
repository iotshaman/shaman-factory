import 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { expect } from 'chai';
import { createMock } from 'ts-auto-mock';
import { IFileService } from "../../../services/file.service";
import { SolutionProject } from '../../../models/solution';
import { MkdirPublishInstructionService } from './mkdir.instruction';

describe('Mkdir Instruction Service', () => {

  chai.use(sinonChai);
  var sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(console, 'log');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('instruction should equal "mkdir"', () => {
    let subject = new MkdirPublishInstructionService();
    expect(subject.instruction).to.equal("mkdir");
  });

  it('processInstruction should call ensureFolderExists', (done) => {
    let fileServiceMock = createMock<IFileService>();
    let project: SolutionProject = {
      name: 'sample',
      template: 'server',
      environment: 'node',
      path: 'sample',
      specs: {publish: [{instruction: 'mkdir', arguments: ["folder1"]}]}
    };
    fileServiceMock.ensureFolderExists = sandbox.stub().returns(Promise.resolve());
    let subject = new MkdirPublishInstructionService();
    subject.fileService = fileServiceMock;
    subject.processInstruction("./", <any>null, project).then(_ => {
      expect(fileServiceMock.ensureFolderExists).to.have.been.called;
      done();
    });
  });

});