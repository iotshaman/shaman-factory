import * as chai from 'chai';
import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { createMock } from 'ts-auto-mock';
import { ISourceFactory } from '../../../../factories/source/source.factory';
import { SolutionProject } from '../../../../models/solution';
import { LineDetail, SourceFile } from '../../../../models/source-file';
import { IFileService } from '../../../../services/file.service';
import { MysqlAppConfigurationService } from './mysql-app-configuration.service';

describe('Mysql App Configuration Service', () => {

  chai.use(sinonChai);
  var sandbox: sinon.SinonSandbox;
  const importHook = `//shaman: {"lifecycle": "transformation", "args": {"type": "import", "target": "*"}}`;
  const configurationHook = `//shaman: {"lifecycle": "transformation", "args": {"type": "config", "target": "*"}}`;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(console, 'log');
  })

  afterEach(() => {
    sandbox.restore();
  });

  it("getConfigName should return 'mysqlConfig'", () => {
    let subject = new MysqlAppConfigurationService();
    expect(subject.getConfigName()).to.equal("mysqlConfig");
  })

  it('addAppConfigurationJson should update 2 json files', (done) => {
    let project = new SolutionProject();
    project.path = "./sample"
    let fileServiceMock = createMock<IFileService>();
    fileServiceMock.readJson = sandbox.stub().returns(Promise.resolve({}));
    fileServiceMock.writeJson = sandbox.stub().returns(Promise.resolve());
    let subject = new MysqlAppConfigurationService();
    subject.fileService = fileServiceMock;
    subject.addAppConfigurationJson("./", project).then(_ => {
      expect(fileServiceMock.writeJson).to.have.been.calledTwice;
      done();
    });
  });

    it('addMySqlAppConfigurationModel should throw error if no import hook found', (done) => {
    let project = new SolutionProject();
    project.path = "./sample"
    let sourceFile = new SourceFile();
    let fileServiceMock = createMock<IFileService>();
    fileServiceMock.getSourceFile = sandbox.stub().returns(Promise.resolve(sourceFile));
    let subject = new MysqlAppConfigurationService();
    subject.fileService = fileServiceMock;
    subject.addAppConfigurationModel("./", project)
      .then(_ => { throw new Error("Expected rejected promise, but promise completed.") })
      .catch(ex => {
        expect(ex.message).to.equal("No import hook found in app config.");
        done();
      });
  });

  it('addMySqlAppConfigurationModel should throw error if no configuration hook found', (done) => {
    let project = new SolutionProject();
    project.path = "./sample"
    let sourceFile = new SourceFile();
    sourceFile.lines = [new LineDetail({ index: 0, indent: 0, content: importHook, lifecycleHook: true })]
    let fileServiceMock = createMock<IFileService>();
    fileServiceMock.getSourceFile = sandbox.stub().returns(Promise.resolve(sourceFile));
    let subject = new MysqlAppConfigurationService();
    subject.fileService = fileServiceMock;
    subject.addAppConfigurationModel("./", project)
      .then(_ => { throw new Error("Expected rejected promise, but promise completed.") })
      .catch(ex => {
        expect(ex.message).to.equal("No configuration hook found in app config.");
        done();
      });
  });

  it('addMySqlAppConfigurationModel should call replaceLines twice', (done) => {
    let project = new SolutionProject();
    project.path = "./sample"
    let sourceFile = new SourceFile();
    sourceFile.lines = [
      new LineDetail({ index: 0, indent: 0, content: importHook, lifecycleHook: true }),
      new LineDetail({ index: 1, indent: 0, content: configurationHook, lifecycleHook: true })
    ]
    sandbox.stub(sourceFile, 'replaceLines').callsFake((_i, lineFactory) => lineFactory());
    let fileServiceMock = createMock<IFileService>();
    fileServiceMock.getSourceFile = sandbox.stub().returns(Promise.resolve(sourceFile));
    let sourceFactoryMock = createMock<ISourceFactory>();
    sourceFactoryMock.buildImportStatement = sandbox.stub().returns([]);
    sourceFactoryMock.buildClassProperty = sandbox.stub().returns([]);
    let subject = new MysqlAppConfigurationService();
    subject.fileService = fileServiceMock;
    subject.sourceFactory = sourceFactoryMock;
    subject.addAppConfigurationModel("./", project).then(_ => {
      expect(sourceFile.replaceLines).to.have.been.calledTwice;
      done();
    })
  });

});