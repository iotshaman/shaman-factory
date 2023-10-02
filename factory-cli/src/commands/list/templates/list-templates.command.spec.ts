import 'mocha';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { ListTemplatesCommand } from './list-templates.command';
import { TemplateService } from '../../../services/template.service';
import { Template } from '../../../models/template';
import { createMock } from 'ts-auto-mock';

describe('ListTemplatesCommand', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(console, 'log');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('run', () => {
    it('should log the names of all templates returned by the template service', (done) => {
      const mockTemplates: Template[] = [
        { name: 'template1', environment: 'test', type: 'server', version: '1.0.0', file: 'test', language: 'test' },
        { name: 'template2', environment: 'test', type: 'database', version: '1.0.0', file: 'test', language: 'test' },
      ];
      const mockTemplateService = createMock<TemplateService>();
      const getTemplateArrayMock = mockTemplateService.getAllTemplates = sandbox.stub().resolves(mockTemplates);
      const subject = new ListTemplatesCommand();
      sandbox.stub(subject, <any>'templateService').value(mockTemplateService as TemplateService);
      const logSpy = console.log as sinon.SinonSpy;
      subject.run()
        .then(_ => {
          expect(getTemplateArrayMock.calledOnce).to.be.true;
          expect(logSpy.callCount).to.equal(5);
          expect(logSpy.getCall(0).args[0]).to.equal('\nAvailable templates\n-------------------');
          expect(logSpy.getCall(1).args[0]).to.equal('test:');
          expect(logSpy.getCall(2).args[0]).to.equal('  template1');
          expect(logSpy.getCall(3).args[0]).to.equal('  template2');
          expect(logSpy.getCall(4).args[0]).to.equal(undefined);
          done();
        });
    });
  });
});