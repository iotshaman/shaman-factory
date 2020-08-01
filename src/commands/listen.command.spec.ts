import 'mocha';
import * as sinon from 'sinon';
import * as _http from 'http';
import * as _cmd from 'child_process';
import * as _path from 'path';
import { expect } from 'chai';
import { ListenCommand } from './listen.command';

describe('CreateCommand', () => {
  
  var sandbox: sinon.SinonSandbox;
  let logger: sinon.SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    logger = sandbox.stub(console, 'log');
  })

  afterEach(() => {
    sandbox.restore();
  });

  it('name should be "listen"', () => {
    let subject = new ListenCommand();
    expect(subject.name).to.to.equal("listen");
  });

  it('server should listen on port 10003 by default', (done) => {
    let stub = sandbox.stub();
    sandbox.stub(_http, 'createServer').returns(<any>{listen: stub});
    let subject = new ListenCommand();
    subject.run().then(_ => {
      expect(stub.calledWith("10003")).to.be.true;
      done();
    });
  });

  it('server should return 404 if route is not found', (done) => {    
    let responseCode = -1;
    let response = { writeHead: (_a, _b) => {responseCode = _a}, end: done}
    let stub = sandbox.stub(_http, 'createServer')
    stub = stub.returns(<any>{listen: sandbox.stub()});
    stub = stub.yields({ url: '/' }, response);
    let subject = new ListenCommand();
    subject.run();
    expect(responseCode).to.equal(404);
  });

  it('server should return 500 if compiler throws', (done) => {    
    let responseCode = -1;
    let response = { writeHead: (a) => {responseCode = a}, end: () => {
      expect(responseCode).to.equal(500);
      done();
    }}
    let stub = sandbox.stub(_http, 'createServer')
    stub = stub.returns(<any>{listen: sandbox.stub()});
    stub = stub.yields({ url: '/compile', method: 'POST' }, response);
    sandbox.stub(_cmd, 'exec').yields(new Error("test error"), null, null);
    let subject = new ListenCommand();
    subject.run();
  });

  it('server should return 204 if compilation is successful', (done) => {    
    let responseCode = -1;
    let response = { writeHead: (a) => {responseCode = a}, end: () => {
      expect(responseCode).to.equal(204);
      done();
    }}
    let stub = sandbox.stub(_http, 'createServer')
    stub = stub.returns(<any>{listen: sandbox.stub()});
    stub = stub.yields({ url: '/compile', method: 'POST' }, response);
    sandbox.stub(_cmd, 'exec').yields(null, null, null);
    sandbox.stub(_path, 'isAbsolute').returns(true);
    let subject = new ListenCommand();
    subject.run("", "3000");
  });

  it('server should write stderr to console', (done) => {  
    let response = { writeHead: (_a) => {}, end: () => {
      expect(logger.calledWith("stderr")).to.be.true;
      done();
    }}
    let stub = sandbox.stub(_http, 'createServer')
    stub = stub.returns(<any>{listen: sandbox.stub()});
    stub = stub.yields({ url: '/compile', method: 'POST' }, response);
    sandbox.stub(_cmd, 'exec').yields(null, null, "stderr");
    let subject = new ListenCommand();
    subject.run();
  });

});