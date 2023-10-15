import 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { expect } from 'chai';
import { createMock } from 'ts-auto-mock';
import { IFileService } from "../../../services/file.service";
import { SolutionProject } from '../../../models/solution';
import { UpdateJsonPublishInstructionService } from './update-json.instruction';

describe('Update JSON Instruction Service', () => {

  chai.use(sinonChai);
  var sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(console, 'log');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('instruction should equal "json"', () => {
    let subject = new UpdateJsonPublishInstructionService();
    expect(subject.instruction).to.equal("json");
  });

  it('processInstruction should call ensureFolderExists', (done) => {
    let fileServiceMock = createMock<IFileService>();
    let project: SolutionProject = {
      name: 'sample',
      template: 'server',
      environment: 'node',
      path: 'sample',
      specs: {publish: [{instruction: 'json', arguments: [{path: 'file.json', replace: {foo: "bar"}}]}]}
    };
    fileServiceMock.readJson = sandbox.stub().returns(Promise.resolve({}));
    fileServiceMock.writeJson = sandbox.stub().returns(Promise.resolve());
    let subject = new UpdateJsonPublishInstructionService();
    subject.fileService = fileServiceMock;
    subject.processInstruction("./", <any>null, project).then(_ => {
      expect(fileServiceMock.writeJson).to.have.been.called;
      done();
    });
  });

});