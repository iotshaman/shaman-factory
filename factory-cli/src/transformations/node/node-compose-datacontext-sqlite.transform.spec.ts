import * as chai from 'chai';
import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { createMock } from 'ts-auto-mock';
import { ProjectTransformation, Solution } from '../../models/solution';
import { ITypescriptSourceService } from "../../services/source/typescript-source.service";
import { NodeComposeSqliteDataContextTransformation } from './node-compose-datacontext-sqlite.transform';

describe('Node Compose Sqlite DataContext Transformation', () => {
  
  chai.use(sinonChai);
  var sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(console, 'log');
  })

  afterEach(() => {
    sandbox.restore();
  });

  it('name should return "compose:datacontext-sqlite"', () => {
    let subject = new NodeComposeSqliteDataContextTransformation();
    expect(subject.name).to.equal("compose:datacontext-sqlite");
  });

  it('environment should return "node"', () => {
    let subject = new NodeComposeSqliteDataContextTransformation();
    expect(subject.environment).to.equal("node");
  });

  it('language should return "typescript"', () => {
    let subject = new NodeComposeSqliteDataContextTransformation();
    expect(subject.language).to.equal("typescript");
  });

  it('transform should throw if invalid target project found', (done) => {
    let solution = new Solution();
    solution.projects = [];
    let transformation = new ProjectTransformation();
    transformation.targetProject = "invalid";
    let subject = new NodeComposeSqliteDataContextTransformation();
    subject.transform(transformation, solution, "./")
      .then(_ => { throw new Error("Expected rejected promise, but promise completed.") })
      .catch(ex => {
        expect(ex.message).to.equal("Invalid target project in transformation: 'invalid'.");
        done();
      });
  });

  it('transform should throw if invalid source project found', (done) => {
    let solution = new Solution();
    solution.projects = [{name: 'svr', environment: "node", template: "server", path: "./svr"}];
    let transformation = new ProjectTransformation();
    transformation.targetProject = "svr";
    transformation.sourceProject = "invalid"
    let subject = new NodeComposeSqliteDataContextTransformation();
    subject.transform(transformation, solution, "./")
      .then(_ => { throw new Error("Expected rejected promise, but promise completed.") })
      .catch(ex => {
        expect(ex.message).to.equal("Invalid source project in transformation: 'invalid'.");
        done();
      });
  });

  it('transform should call addSqliteAppConfigurationJson', (done) => {
    let solution = new Solution();
    solution.projects = [
      {name: 'svr', environment: "node", template: "server", path: "./svr"},
      {name: 'db', environment: "node", template: "database", path: "./db"}
    ];
    let transformation = new ProjectTransformation();
    transformation.targetProject = "svr";
    transformation.sourceProject = "db"
    let typescriptSourceService = createMock<ITypescriptSourceService>();
    typescriptSourceService.addSqliteAppConfigurationJson = sandbox.stub().returns(Promise.resolve());
    let subject = new NodeComposeSqliteDataContextTransformation();
    subject.sourceService = typescriptSourceService;
    subject.transform(transformation, solution, "./").then(_ => {
      expect(typescriptSourceService.addSqliteAppConfigurationJson).to.have.been.called;
      done();
    });
  });

  it('transform should call addSqliteAppConfigurationModel', (done) => {
    let solution = new Solution();
    solution.projects = [
      {name: 'svr', environment: "node", template: "server", path: "./svr"},
      {name: 'db', environment: "node", template: "database", path: "./db"}
    ];
    let transformation = new ProjectTransformation();
    transformation.targetProject = "svr";
    transformation.sourceProject = "db"
    let typescriptSourceService = createMock<ITypescriptSourceService>();
    typescriptSourceService.addSqliteAppConfigurationModel = sandbox.stub().returns(Promise.resolve());
    let subject = new NodeComposeSqliteDataContextTransformation();
    subject.sourceService = typescriptSourceService;
    subject.transform(transformation, solution, "./").then(_ => {
      expect(typescriptSourceService.addSqliteAppConfigurationModel).to.have.been.called;
      done();
    });
  });

  it('transform should call addDataContextCompositionType', (done) => {
    let solution = new Solution();
    solution.projects = [
      {name: 'svr', environment: "node", template: "server", path: "./svr"},
      {name: 'db', environment: "node", template: "database", path: "./db"}
    ];
    let transformation = new ProjectTransformation();
    transformation.targetProject = "svr";
    transformation.sourceProject = "db"
    let typescriptSourceService = createMock<ITypescriptSourceService>();
    typescriptSourceService.addDataContextCompositionType = sandbox.stub().returns(Promise.resolve());
    let subject = new NodeComposeSqliteDataContextTransformation();
    subject.sourceService = typescriptSourceService;
    subject.transform(transformation, solution, "./").then(_ => {
      expect(typescriptSourceService.addDataContextCompositionType).to.have.been.called;
      done();
    });
  });

  it('transform should call addDataContextComposition', (done) => {
    let solution = new Solution();
    solution.projects = [
      {name: 'svr', environment: "node", template: "server", path: "./svr"},
      {name: 'db', environment: "node", template: "database", path: "./db"}
    ];
    let transformation = new ProjectTransformation();
    transformation.targetProject = "svr";
    transformation.sourceProject = "db"
    let typescriptSourceService = createMock<ITypescriptSourceService>();
    typescriptSourceService.addDataContextComposition = sandbox.stub().returns(Promise.resolve());
    let subject = new NodeComposeSqliteDataContextTransformation();
    subject.sourceService = typescriptSourceService;
    subject.transform(transformation, solution, "./").then(_ => {
      expect(typescriptSourceService.addDataContextComposition).to.have.been.called;
      done();
    });
  });

  it('transform should call addDataContextCompositionType', (done) => {
    let solution = new Solution();
    solution.projects = [
      {name: 'svr', environment: "node", template: "server", path: "./svr"},
      {name: 'db', environment: "node", template: "database", path: "./db", specs: {contextName: "MyContext"}}
    ];
    let transformation = new ProjectTransformation();
    transformation.targetProject = "svr";
    transformation.sourceProject = "db"
    let typescriptSourceService = createMock<ITypescriptSourceService>();
    typescriptSourceService.addDataContextCompositionType = sandbox.stub().callsFake((_path, _prject, contextName) => {
      expect(contextName).to.equal("MyContext")
    })
    let subject = new NodeComposeSqliteDataContextTransformation();
    subject.sourceService = typescriptSourceService;
    subject.transform(transformation, solution, "./").then(_ => done());
  });

});