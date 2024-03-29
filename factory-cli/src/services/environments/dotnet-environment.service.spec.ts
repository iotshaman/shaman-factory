import 'mocha';
import 'sinon-chai'
import * as _path from 'path';
import * as _cmd from 'child_process';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { createMock } from 'ts-auto-mock';
import { IFileService } from '../file.service';
import { DotnetEnvironmentService } from './dotnet-environment.service';
import { Solution } from '../../models/solution';

describe('DotNet Environment Service', () => {

  var sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(console, 'log');
  })

  afterEach(() => {
    sandbox.restore();
  });

  it('updateProjectDefinition should call renameFile', (done) => {
    let solution = new Solution();
    solution.projects = [{ name: 'sample', environment: 'dotnet', template: 'library', path: './sample' }];
    let fileServiceMock = createMock<IFileService>();
    fileServiceMock.renameFile = sandbox.stub().returns(Promise.resolve());
    let subject = new DotnetEnvironmentService();
    subject.fileService = fileServiceMock;
    subject.updateProjectDefinition("./sample", "sample", solution).then(_ => {
      expect(fileServiceMock.renameFile).to.have.been.called;
      done();
    });
  });

  it('updateProjectDefinition should throw if invalid dependency provided', (done) => {
    let solution = new Solution();
    solution.projects = [
      { name: 'a', environment: 'dotnet', template: 'library', path: './a', language: 'csharp', include: ['c'] },
      { name: 'b', environment: 'dotnet', template: 'library', path: './b', language: 'csharp' }
    ];
    let fileServiceMock = createMock<IFileService>();
    fileServiceMock.renameFile = sandbox.stub().returns(Promise.resolve());
    let subject = new DotnetEnvironmentService();
    subject.fileService = fileServiceMock;
    subject.updateProjectDefinition("./a", "a", solution)
      .then(_ => { throw new Error("Expected rejected promise, but promise completed.") })
      .catch(ex => {
        expect(ex.message).to.equal("Invalid dependency 'c'.");
        done();
      });
  });

  it('updateProjectDefinition should throw if child process returns non-zero status code', (done) => {
    let solution = new Solution();
    solution.projects = [
      { name: 'a', environment: 'dotnet', template: 'library', path: './a', language: 'csharp', include: ['b'] },
      { name: 'b', environment: 'dotnet', template: 'library', path: './b', language: 'csharp' }
    ];
    let spawnMock: any = {
      stdout: { on: sandbox.stub().yields("output") },
      stderr: { on: sandbox.stub().yields("error") },
      on: sandbox.stub().yields(1)
    };
    sandbox.stub(_cmd, 'spawn').returns(spawnMock);
    let fileServiceMock = createMock<IFileService>();
    let subject = new DotnetEnvironmentService();
    subject.fileService = fileServiceMock;
    subject.updateProjectDefinition("./a", "a", solution)
      .then(_ => { throw new Error("Expected rejected promise, but promise completed.") })
      .catch(ex => {
        expect(ex.message).to.equal("An error occurred while adding dotnet project dependency.");
        done();
      });
  });

  it('updateProjectDefinition should spawn process to add project dependency', (done) => {
    let solution = new Solution();
    solution.projects = [
      { name: 'a', environment: 'dotnet', template: 'library', path: './a', language: 'csharp', include: ['b'] },
      { name: 'b', environment: 'dotnet', template: 'library', path: './b', language: 'csharp' }
    ];
    let spawnMock: any = {
      stdout: { on: sandbox.stub().yields("output") },
      stderr: { on: sandbox.stub().yields("error") },
      on: sandbox.stub().yields(0)
    };
    sandbox.stub(_cmd, 'spawn').returns(spawnMock);
    let fileServiceMock = createMock<IFileService>();
    fileServiceMock.renameFile = sandbox.stub().returns(Promise.resolve());
    let subject = new DotnetEnvironmentService();
    subject.fileService = fileServiceMock;
    subject.updateProjectDefinition("./a", "a", solution).then(_ => {
      expect(spawnMock.on).to.have.been.called;
      done();
    });
  });

  it('installDependencies should throw if child process throws', (done) => {
    sandbox.stub(_cmd, 'exec').yields(new Error("test error"), null, "output");
    let subject = new DotnetEnvironmentService();
    subject.installDependencies("./sample")
      .then(_ => { throw new Error("Expected rejected promise, but promise completed.") })
      .catch(ex => {
        expect(ex.message).to.equal("test error");
        done();
      });
  });

  it('installDependencies should return resolved promise', (done) => {
    sandbox.stub(_cmd, 'exec').yields(null, null, null);
    let subject = new DotnetEnvironmentService();
    subject.installDependencies("./sample").then(_ => done());
  });

  it('buildProject should throw if child process throws', (done) => {
    sandbox.stub(_cmd, 'exec').yields(new Error("test error"), null, "output");
    let subject = new DotnetEnvironmentService();
    subject.buildProject(<any>null, "sample")
      .then(_ => { throw new Error("Expected rejected promise, but promise completed.") })
      .catch(ex => {
        expect(ex.message).to.equal("test error");
        done();
      });
  });

  it('buildProject should return resolved promise', (done) => {
    sandbox.stub(_cmd, 'exec').yields(null, null, null);
    let subject = new DotnetEnvironmentService();
    subject.buildProject(<any>null, "sample").then(_ => done());
  });

  it('checkNamingConvention should return resolved promise', (done) => {
    let subject = new DotnetEnvironmentService();
    subject.checkNamingConvention("Test", "Test").then(_ => done());
  });

  it('checkNamingConvention should throw if solution name is not provided.', (done) => {
    let subject = new DotnetEnvironmentService();
    subject.checkNamingConvention("test", <any>null)
      .then(_ => { throw new Error("Expected rejected promise, but promise completed.") })
      .catch((ex: Error) => {
        expect(ex.message).to.equal("Dotnet solutions require a name, please update your shaman.json file.");
          done();
      });
  });

  it('checkNamingConvention should throw if project name does not follow proper dotnet naming conventions', (done) => {
    let subject = new DotnetEnvironmentService();
    subject.checkNamingConvention("test", "Test")
      .then(_ => { throw new Error("Expected rejected promise, but promise completed.") })
      .catch((ex: Error) => {
        expect(ex.message).to.equal("Project name \"test\" does not meet proper dotnet naming conventions. " +
          "It's recommended that the project name be changed to \"Test\".");
          done();
      });
  });

  it('checkNamingConvention should throw if solution name does not follow proper dotnet naming conventions', (done) => {
    let subject = new DotnetEnvironmentService();
    subject.checkNamingConvention("Test", "test")
      .then(_ => { throw new Error("Expected rejected promise, but promise completed.") })
      .catch((ex: Error) => {
        expect(ex.message).to.equal("Solution name \"test\" does not meet proper dotnet naming conventions. " +
          "It's recommended that the solution name be changed to \"Test\".");
        done();
      });
  });

  it('publishProject should throw if child process throws', (done) => {
    sandbox.stub(_cmd, 'exec').yields(new Error("test error"), null, "output");
    let subject = new DotnetEnvironmentService();
    subject.publishProject(<any>null, "sample1", "sample2")
      .then(_ => { throw new Error("Expected rejected promise, but promise completed.") })
      .catch(ex => {
        expect(ex.message).to.equal("test error");
        done();
      });
  });

  it('publishProject should return resolved promise', (done) => {
    sandbox.stub(_cmd, 'exec').yields(null, null, null);
    let subject = new DotnetEnvironmentService();
    subject.publishProject(<any>null, "sample1", "sample2").then(_ => done());
  });

});
