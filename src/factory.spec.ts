import 'mocha';
import { expect } from 'chai';
import { Factory } from './factory';
import { ICommand } from './commands/command';

describe('Factory', () => {

  it('should be created', () => {
    let factory = new Factory();
    expect(factory).not.to.be.null;
  })

  it('Generate should throw if no command provided', () => {
    let factory = new Factory([new MockCommand()]);
    let msg = "Command parameter not provided.";
    expect(() => factory.Generate(null, [])).to.throw(msg);
  });

  it('Generate should throw if invalid command', () => {
    let factory = new Factory([new MockCommand()]);
    let msg = "Invalid command 'invalid'.";
    expect(() => factory.Generate("invalid", [])).to.throw(msg);
  });

  it('Generate should return resolved promise', (done) => {
    let factory = new Factory([new MockCommand()]);
    factory.Generate("mock", []).then(done);
  });

})

class MockCommand implements ICommand {
  name: string = 'mock';
  run(arg: string) {
    return Promise.resolve();
  }
}