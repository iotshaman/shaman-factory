import 'mocha';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { createMock } from 'ts-auto-mock';
import { ListCommand } from './list.command';
import { IListCommand } from '../command';
import { CommandLineArguments } from '../../command-line-arguments';
import { ListTemplatesCommand } from './templates/list-templates.command';
import { ListRecipesCommand } from './recipes/list-recipes.command';

describe('ListCommand', () => {

  var sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(console, 'log');
  })

  afterEach(() => {
    sandbox.restore();
  });

  describe('name', () => {
    it('should return "ls"', () => {
      const subject = new ListCommand();
      expect(subject.name).to.equal('ls');
    });
  });

  describe('run', () => {
    it('should reject with an error if the target list flag is invalid', (done) => {
      const subject = new ListCommand();
      const cla = new CommandLineArguments(['test', 'test', 'ls', '-add']);
      subject.run(cla)
        .catch(err => {
          expect(err.message).to.equal('Invalid list flag provided.');
          done();
        });
    });

    it('should call the run method of the correct list command', (done) => {
      const subject = new ListCommand();
      const mockListCommand = createMock<IListCommand>();
      mockListCommand.flag = '-recipes';
      const runMock = mockListCommand.run = sandbox.stub().returns(Promise.resolve());
      const listCommandFactoryStub = sandbox.stub(subject, 'listCommandFactory').returns([
        mockListCommand
      ]);

      const cla = new CommandLineArguments(['test', 'test', 'ls', '-recipes']);
      subject.run(cla)
        .then(_ => {
          expect(listCommandFactoryStub.calledOnce).to.be.true;
          expect(runMock.calledOnce).to.be.true;
          done();
        });
    });
  });

  describe('listCommandFactory', () => {
    it('should return an array of list commands', () => {
      const subject = new ListCommand();
      const result = subject.listCommandFactory();
      expect(result).to.be.an('array').that.has.lengthOf(2);
      expect(result[0]).to.be.an.instanceOf(ListTemplatesCommand);
      expect(result[1]).to.be.an.instanceOf(ListRecipesCommand);
    });
  });

});

