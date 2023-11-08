import * as chai from 'chai';
import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { createMock } from 'ts-auto-mock';
import { ProjectTransformation, Solution } from '../../models/solution';
import { ITypescriptSourceService } from "../../services/source/typescript/typescript-source.service";
import { NodeComposeDataContextTransformation } from './node-compose-datacontext.transform';

describe('Node Compose DataContext Transformation', () => {

  chai.use(sinonChai);
  var sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(console, 'log');
  })

  afterEach(() => {
    sandbox.restore();
  });

  it('name should return "compose:datacontext"', () => {
    let subject = new NodeComposeDataContextTransformation();
    expect(subject.name).to.equal("compose:datacontext");
  });

  it('environment should return "node"', () => {
    let subject = new NodeComposeDataContextTransformation();
    expect(subject.environment).to.equal("node");
  });

  it('language should return "typescript"', () => {
    let subject = new NodeComposeDataContextTransformation();
    expect(subject.language).to.equal("typescript");
  });

  it('transform should throw if invalid target project found', (done) => {
    let solution = new Solution();
    solution.projects = [];
    let transformation = new ProjectTransformation();
    transformation.targetProject = "invalid";
    let subject = new NodeComposeDataContextTransformation();
    subject.transform(transformation, solution, "./")
      .then(_ => { throw new Error("Expected rejected promise, but promise completed.") })
      .catch(ex => {
        expect(ex.message).to.equal("Invalid target project in transformation: 'invalid'.");
        done();
      });
  });

  it('transform should throw if invalid source project found', (done) => {
    let solution = new Solution();
    solution.projects = [{ name: 'svr', environment: "node", template: "server", path: "./svr" }];
    let transformation = new ProjectTransformation();
    transformation.targetProject = "svr";
    transformation.sourceProject = "invalid"
    let subject = new NodeComposeDataContextTransformation();
    subject.transform(transformation, solution, "./")
      .then(_ => { throw new Error("Expected rejected promise, but promise completed.") })
      .catch(ex => {
        expect(ex.message).to.equal("Invalid source project in transformation: 'invalid'.");
        done();
      });
  });

  it('transform should throw if database type not specified in database project specs', (done) => {
    let solution = new Solution();
    solution.projects = [
      { name: 'svr', environment: "node", template: "server", path: "./svr" },
      { name: 'db', environment: "node", template: "database", path: "./db" }
    ];
    let transformation = new ProjectTransformation();
    transformation.targetProject = "svr";
    transformation.sourceProject = "db"
    let typescriptSourceService = createMock<ITypescriptSourceService>();
    typescriptSourceService.addDataContextCompositionType = sandbox.stub().returns(Promise.resolve());
    let subject = new NodeComposeDataContextTransformation();
    subject.sourceService = typescriptSourceService;
    subject.transform(transformation, solution, "./")
      .then(_ => {
        done(new Error("Expected rejected promise, but promise completed."))
      })
      .catch(ex => {
        expect(ex.message).to.equal("Database type not specified in database project specs.");
        done();
      })
  });

  it('transform should call addAppConfigurationJson', (done) => {
    let solution = new Solution();
    solution.projects = [
      {name: 'svr', environment: "node", template: "server", path: "./svr"},
      {name: 'db', environment: "node", template: "database", path: "./db", specs: { databaseType: 'noop' }}
    ];
    let transformation = new ProjectTransformation();
    transformation.targetProject = "svr";
    transformation.sourceProject = "db"
    let typescriptSourceService = createMock<ITypescriptSourceService>();
    typescriptSourceService.addAppConfigurationJson = sandbox.stub().returns(Promise.resolve());
    let subject = new NodeComposeDataContextTransformation();
    subject.sourceService = typescriptSourceService;
    subject.transform(transformation, solution, "./").then(_ => {
      expect(typescriptSourceService.addAppConfigurationJson).to.have.been.called;
      done();
    })
    .catch(ex => done(ex));
  });

  it('transform should call addAppConfigurationModel', (done) => {
    let solution = new Solution();
    solution.projects = [
      {name: 'svr', environment: "node", template: "server", path: "./svr"},
      {name: 'db', environment: "node", template: "database", path: "./db", specs: { databaseType: 'noop' }}
    ];
    let transformation = new ProjectTransformation();
    transformation.targetProject = "svr";
    transformation.sourceProject = "db"
    let typescriptSourceService = createMock<ITypescriptSourceService>();
    typescriptSourceService.addAppConfigurationModel = sandbox.stub().returns(Promise.resolve());
    let subject = new NodeComposeDataContextTransformation();
    subject.sourceService = typescriptSourceService;
    subject.transform(transformation, solution, "./").then(_ => {
      expect(typescriptSourceService.addAppConfigurationModel).to.have.been.called;
      done();
    })
    .catch(ex => done(ex));
  });


  it('transform should call addDataContextCompositionType', (done) => {
    let solution = new Solution();
    solution.projects = [
      { name: 'svr', environment: "node", template: "server", path: "./svr" },
      { name: 'db', environment: "node", template: "database", path: "./db", specs: { databaseType: "mysql" } }
    ];
    let transformation = new ProjectTransformation();
    transformation.targetProject = "svr";
    transformation.sourceProject = "db"
    let typescriptSourceService = createMock<ITypescriptSourceService>();
    typescriptSourceService.addDataContextCompositionType = sandbox.stub().returns(Promise.resolve());
    let subject = new NodeComposeDataContextTransformation();
    subject.sourceService = typescriptSourceService;
    subject.transform(transformation, solution, "./").then(_ => {
      expect(typescriptSourceService.addDataContextCompositionType).to.have.been.called;
      done();
    });
  });

  it('transform should use the contextName provided in the project specs if provided', (done) => {
    let solution = new Solution();
    solution.projects = [
      { name: 'svr', environment: "node", template: "server", path: "./svr" },
      { name: 'db', environment: "node", template: "database", path: "./db", specs: { contextName: "MyContext", databaseType: "mysql" } }
    ];
    let transformation = new ProjectTransformation();
    transformation.targetProject = "svr";
    transformation.sourceProject = "db"
    let typescriptSourceService = createMock<ITypescriptSourceService>();
    typescriptSourceService.addDataContextCompositionType = sandbox.stub().callsFake((_path, _project, contextName) => {
      expect(contextName).to.equal("MyContext")
    })
    let subject = new NodeComposeDataContextTransformation();
    subject.sourceService = typescriptSourceService;
    subject.transform(transformation, solution, "./").then(_ => done());
  });

  it('transform should use the default contextName if one is not provided in the project specs', (done) => {
    let solution = new Solution();
    solution.projects = [
      { name: 'svr', environment: "node", template: "server", path: "./svr" },
      { name: 'db', environment: "node", template: "database", path: "./db", specs: { databaseType: "mysql" } }
    ];
    let transformation = new ProjectTransformation();
    transformation.targetProject = "svr";
    transformation.sourceProject = "db"
    let typescriptSourceService = createMock<ITypescriptSourceService>();
    typescriptSourceService.addDataContextCompositionType = sandbox.stub().callsFake((_path, _project, contextName) => {
      expect(contextName).to.equal("SampleDatabaseContext")
    })
    let subject = new NodeComposeDataContextTransformation();
    subject.sourceService = typescriptSourceService;
    subject.transform(transformation, solution, "./").then(_ => done());
  });

  it('transform should call addDataContextComposition', (done) => {
    let solution = new Solution();
    solution.projects = [
      { name: 'svr', environment: "node", template: "server", path: "./svr" },
      { name: 'db', environment: "node", template: "database", path: "./db", specs: { databaseType: "mysql" } }
    ];
    let transformation = new ProjectTransformation();
    transformation.targetProject = "svr";
    transformation.sourceProject = "db"
    let typescriptSourceService = createMock<ITypescriptSourceService>();
    typescriptSourceService.addDataContextComposition = sandbox.stub().returns(Promise.resolve());
    let subject = new NodeComposeDataContextTransformation();
    subject.sourceService = typescriptSourceService;
    subject.transform(transformation, solution, "./").then(_ => {
      expect(typescriptSourceService.addDataContextComposition).to.have.been.called;
      done();
    });
  });

});