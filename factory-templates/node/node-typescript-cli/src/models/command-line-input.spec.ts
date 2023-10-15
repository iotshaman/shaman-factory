import 'mocha';
import { expect } from 'chai';

import { CommandLineInput } from './command-line-input';

describe('Command Line Arguments', () => {

  it('constructor should throw if no command provided', () => {
    let func = () => { new CommandLineInput(['test', 'test']) }
    expect(func).to.throw('No command provided.');
  });

  it('constructor should set flags', () => {
    let subject = new CommandLineInput(['test', 'test', 'noop', '-flag1']);
    expect(subject.flags[0]).to.equal('flag1');
  });

  it('constructor should set parameters', () => {
    let subject = new CommandLineInput(['test', 'test', 'noop', '--foo=bar']);
    expect(subject.getParameterValueOrDefault('foo')).to.equal('bar');
  });

});