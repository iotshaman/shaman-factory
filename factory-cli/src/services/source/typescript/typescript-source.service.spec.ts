import 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { expect } from 'chai';
import { createMock } from 'ts-auto-mock';
import { IFileService } from '../../file.service';
import { TypescriptSourceService } from './typescript-source.service';
import { SolutionProject } from '../../../models/solution';
import { LineDetail, SourceFile } from '../../../models/source-file';
import { ISourceFactory } from '../../../factories/source/source.factory';
import { IAppConfiguration } from './app-configuration/app-configuration.interface';

describe('Typescript Source Service', () => {

  chai.use(sinonChai);
  var sandbox: sinon.SinonSandbox;
  const importHook = `//shaman: {"lifecycle": "transformation", "args": {"type": "import", "target": "*"}}`;
  const compositionTypesHook = `//shaman: {"lifecycle": "transformation", "args": {"type": "compose", "target": "TYPES"}}`;
  const compositionHook = `//shaman: {"lifecycle": "transformation", "args": {"type": "compose", "target": "datacontext"}}`;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(console, 'log');
  })

  afterEach(() => {
    sandbox.restore();
  });

  it('should copy app.config.sample.json to app.config.json', (done) => {
    let project = new SolutionProject();
    project.path = "sample"
    let fileServiceMock = createMock<IFileService>();
    fileServiceMock.copyFile = sandbox.stub().returns(Promise.resolve());
    let subject = new TypescriptSourceService();
    subject.fileService = fileServiceMock;
    subject.createAppConfigFromSampleConfig("./", project).then(_ => {
      expect(fileServiceMock.copyFile).to.have.been.called;
      done();
    })
      .catch(ex => done(new Error(ex)));
  });

  it('addAppConfigurationJson should call addAppConfigurationJson on service', (done) => {
    let project = new SolutionProject();
    project.path = "sample"
    let appConfigMock = createMock<IAppConfiguration>();
    appConfigMock.configType = "noop";
    appConfigMock.addAppConfigurationJson = sandbox.stub().returns(Promise.resolve());
    let subject = new TypescriptSourceService();
    subject.appConfigurationServiceArray = [appConfigMock];
    subject.addAppConfigurationJson("./", project, "noop").then(_ => {
      expect(appConfigMock.addAppConfigurationJson).to.have.been.called;
      done();
    })
      .catch(ex => done(new Error(ex)));
  });

  it('addAppConfigurationModel should call addAppConfigurationModel on service', (done) => {
    let project = new SolutionProject();
    project.path = "sample"
    let appConfigMock = createMock<IAppConfiguration>();
    appConfigMock.configType = "noop";
    appConfigMock.addAppConfigurationModel = sandbox.stub().returns(Promise.resolve());
    let subject = new TypescriptSourceService();
    subject.appConfigurationServiceArray = [appConfigMock];
    subject.addAppConfigurationModel("./", project, "noop").then(_ => {
      expect(appConfigMock.addAppConfigurationModel).to.have.been.called;
      done();
    })
      .catch(ex => done(new Error(ex)));
  });

  it('addDataContextCompositionType should throw if no composition types hook found', (done) => {
    let project = new SolutionProject();
    project.path = "./sample"
    let sourceFile = new SourceFile();
    let fileServiceMock = createMock<IFileService>();
    fileServiceMock.getSourceFile = sandbox.stub().returns(Promise.resolve(sourceFile));
    let subject = new TypescriptSourceService();
    subject.fileService = fileServiceMock;
    subject.addDataContextCompositionType("./", project, "MyContext")
      .then(_ => { throw new Error("Expected rejected promise, but promise completed.") })
      .catch(ex => {
        expect(ex.message).to.equal("No composition hook found in TYPES objects.");
        done();
      });
  });

  it('addDataContextCompositionType should call replaceLines', (done) => {
    let project = new SolutionProject();
    project.path = "./sample"
    let sourceFile = new SourceFile();
    sourceFile.lines = [
      new LineDetail({ index: 0, indent: 0, content: compositionTypesHook, lifecycleHook: true })
    ]
    sandbox.stub(sourceFile, 'replaceLines').callsFake((_i, lineFactory) => lineFactory());
    let fileServiceMock = createMock<IFileService>();
    fileServiceMock.getSourceFile = sandbox.stub().returns(Promise.resolve(sourceFile));
    let sourceFactoryMock = createMock<ISourceFactory>();
    sourceFactoryMock.buildObjectPropertyAssignment = sandbox.stub().returns([]);
    let subject = new TypescriptSourceService();
    subject.fileService = fileServiceMock;
    subject.sourceFactory = sourceFactoryMock;
    subject.addDataContextCompositionType("./", project, "MyContext").then(_ => {
      expect(sourceFile.replaceLines).to.have.been.calledOnce;
      done();
    })
  });

  it('addDataContextComposition should throw error if no import hook found', (done) => {
    let project = new SolutionProject();
    project.path = "./sample"
    let sourceFile = new SourceFile();
    let fileServiceMock = createMock<IFileService>();
    fileServiceMock.getSourceFile = sandbox.stub().returns(Promise.resolve(sourceFile));
    let subject = new TypescriptSourceService();
    subject.appConfigurationServiceArray = [
      new NoopAppConfigurationService()
    ];
    subject.fileService = fileServiceMock;
    subject.addDataContextComposition("./", project, "sample-database", "MyContext", "noop")
      .then(_ => { throw new Error("Expected rejected promise, but promise completed.") })
      .catch(ex => {
        expect(ex.message).to.equal("No import hook found in composition file.");
        done();
      });
  });

  it('addDataContextComposition should throw error if no import hook found', (done) => {
    let project = new SolutionProject();
    project.path = "./sample"
    let sourceFile = new SourceFile();
    sourceFile.lines = [new LineDetail({ index: 0, indent: 0, content: importHook, lifecycleHook: true })]
    let fileServiceMock = createMock<IFileService>();
    fileServiceMock.getSourceFile = sandbox.stub().returns(Promise.resolve(sourceFile));
    let subject = new TypescriptSourceService();
    subject.appConfigurationServiceArray = [
      new NoopAppConfigurationService()
    ];
    subject.fileService = fileServiceMock;
    subject.addDataContextComposition("./", project, "sample-database", "MyContext", "noop")
      .then(_ => { throw new Error("Expected rejected promise, but promise completed.") })
      .catch(ex => {
        expect(ex.message).to.equal("No data context composition hook found in composition file.");
        done();
      });
  });

  it('addDataContextComposition should call replaceLines twice', (done) => {
    let project = new SolutionProject();
    project.path = "./sample"
    let sourceFile = new SourceFile();
    sourceFile.lines = [
      new LineDetail({ index: 0, indent: 0, content: importHook, lifecycleHook: true }),
      new LineDetail({ index: 1, indent: 0, content: compositionHook, lifecycleHook: true })
    ]
    sandbox.stub(sourceFile, 'replaceLines').callsFake((_i, lineFactory) => lineFactory());
    let fileServiceMock = createMock<IFileService>();
    fileServiceMock.getSourceFile = sandbox.stub().returns(Promise.resolve(sourceFile));
    let sourceFactoryMock = createMock<ISourceFactory>();
    sourceFactoryMock.buildImportStatement = sandbox.stub().returns([]);
    sourceFactoryMock.buildClassProperty = sandbox.stub().returns([]);
    let subject = new TypescriptSourceService();
    subject.appConfigurationServiceArray = [
      new NoopAppConfigurationService()
    ];
    subject.fileService = fileServiceMock;
    subject.sourceFactory = sourceFactoryMock;
    subject.addDataContextComposition("./", project, "sample-database", "MyContext", "noop").then(_ => {
      expect(sourceFile.replaceLines).to.have.been.calledTwice;
      done();
    })
  });

});

class NoopAppConfigurationService implements IAppConfiguration {

  configType: string = "noop";

  getConfigName(): string {
    return 'noopConfig';
  }

  addAppConfigurationJson(solutionFolderPath: string, project: SolutionProject): Promise<void> {
    return Promise.resolve();
  }
  addAppConfigurationModel(solutionFolderPath: string, project: SolutionProject): Promise<void> {
    return Promise.resolve();
  }

}